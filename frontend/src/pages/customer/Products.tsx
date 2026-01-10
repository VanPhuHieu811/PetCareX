import { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, MapPin, ChevronDown, Check, ChevronLeft, ChevronRight, Loader2, Filter } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import clsx from 'clsx';
import { Product } from '../../types';

// Import API
import { branchApi, productApi } from '../../api/productApi';

// Interface cho Chi Nhánh
interface Branch {
    MaCN: string;
    TenCN: string;
    DiaChi: string;
    SDT?: string;
}

// Interface cho Sản Phẩm từ Backend
interface BackendProduct {
    MaSP: string;
    TenSP: string;
    GiaBan: number;
    DonViTinh: string;
    TenLoaiSP: string;
    SoLuongTonKho: { [branchId: string]: number };
}

interface PaginationMeta {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
}

// Định nghĩa danh mục cố định
const QUICK_FILTERS = [
    { id: 'All', label: 'Tất cả' },
    { id: 'Thuốc', label: 'Thuốc' },
    { id: 'Thức ăn', label: 'Thức ăn' },
    { id: 'Phụ kiện', label: 'Phụ kiện' }
];

export default function Products() {
    const { addToCart } = useCart();

    // --- State Dữ liệu ---
    const [rawProducts, setRawProducts] = useState<BackendProduct[]>([]);
    const [branchList, setBranchList] = useState<Branch[]>([]);

    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingBranches, setLoadingBranches] = useState(false);

    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // --- State Bộ lọc & UI ---
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setSelectedBranch] = useState<string>('');
    const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

    const branchDropdownRef = useRef<HTMLDivElement>(null);

    // --- Hàm gọi API ---
    const fetchBranches = async () => {
        setLoadingBranches(true);
        try {
            const data = await branchApi.getAll();
            if (Array.isArray(data) && data.length > 0) {
                setBranchList(data);
                setSelectedBranch(data[0].MaCN);
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách chi nhánh:", error);
        } finally {
            setLoadingBranches(false);
        }
    };

    const fetchProducts = async (page: number, searchKeyword: string = '', category: string = '') => {
        setLoadingProducts(true);
        try {
            const data = await productApi.getAll(page, 12, searchKeyword, category);

            if (data.success) {
                const productArray = Array.isArray(data.data) ? data.data : (data.data.data || []);
                setRawProducts(productArray);

                if (data.data.pagination) setPagination(data.data.pagination);
                else setPagination(data.pagination);
            }
        } catch (error) {
            console.error("Lỗi kết nối API sản phẩm:", error);
        } finally {
            setLoadingProducts(false);
        }
    };

    // --- Effects ---
    useEffect(() => {
        fetchBranches();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            fetchProducts(1, searchQuery, selectedCategory);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategory]);

    useEffect(() => {
        fetchProducts(currentPage, searchQuery, selectedCategory);
    }, [currentPage]);

    // Xử lý click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) {
                setIsBranchDropdownOpen(false);
            }
        };
        if (isBranchDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isBranchDropdownOpen]);

    // --- Logic hiển thị ---
    const displayProducts: Product[] = rawProducts.map(item => {
        let stock = 0;

        if (selectedBranch && selectedBranch !== 'All') {
            stock = item.SoLuongTonKho[selectedBranch] || 0;
        } else {
            stock = Object.values(item.SoLuongTonKho).reduce((a, b) => a + b, 0);
        }

        return {
            id: item.MaSP,
            name: item.TenSP,
            sku: item.MaSP,
            category: item.TenLoaiSP,
            originalPrice: item.GiaBan,
            salePrice: item.GiaBan,
            discountPercentage: 0,
            image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            description: `Đơn vị tính: ${item.DonViTinh}`,
            rating: 5,
            stock: stock,
            isInStock: stock > 0,
            branchStock: item.SoLuongTonKho
        };
    });

    const currentBranchName = branchList.find(b => b.MaCN === selectedBranch)?.TenCN || 'Đang chọn...';

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Sản phẩm & Thuốc</h1>
                    <p className="text-gray-500 mt-1">Danh sách sản phẩm từ hệ thống kho</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    {/* Branch Dropdown */}
                    <div className="relative" ref={branchDropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                            disabled={loadingBranches}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap bg-white disabled:opacity-70"
                        >
                            {loadingBranches ? (
                                <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                            ) : (
                                <MapPin className="h-5 w-5 text-gray-500" />
                            )}

                            <span className="text-sm font-medium text-gray-700">
                                {selectedBranch === 'All' ? 'Toàn bộ hệ thống' : currentBranchName}
                            </span>
                            <ChevronDown className={clsx("h-4 w-4 text-gray-500 transition-transform", isBranchDropdownOpen && "transform rotate-180")} />
                        </button>

                        {isBranchDropdownOpen && (
                            <div className="absolute z-50 mt-2 w-72 bg-white rounded-lg border border-gray-200 shadow-xl max-h-80 overflow-y-auto right-0">
                                <button
                                    onClick={() => { setSelectedBranch('All'); setIsBranchDropdownOpen(false); }}
                                    className={clsx("w-full px-4 py-3 text-left transition-colors flex items-center justify-between", selectedBranch === 'All' ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50")}
                                >
                                    <span className="font-medium">Toàn bộ hệ thống</span>
                                    {selectedBranch === 'All' && <Check className="w-5 h-5 text-blue-600" />}
                                </button>

                                {branchList.map(branch => (
                                    <button
                                        key={branch.MaCN}
                                        onClick={() => { setSelectedBranch(branch.MaCN); setIsBranchDropdownOpen(false); }}
                                        className={clsx("w-full px-4 py-3 text-left transition-colors flex items-center justify-between border-t border-gray-100", selectedBranch === branch.MaCN ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50")}
                                    >
                                        <div className="truncate">
                                            <div className="font-medium">{branch.TenCN}</div>
                                            <div className="text-xs text-gray-500">{branch.DiaChi}</div>
                                        </div>
                                        {selectedBranch === branch.MaCN && <Check className="w-5 h-5 text-blue-600 ml-2" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search Box */}
                    <div className="relative flex-grow md:w-64">
                        <input
                            type="text"
                            placeholder="Tìm tên sản phẩm..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Quick Filter Buttons (Fixed Categories) */}
            <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar">
                {QUICK_FILTERS.map(filter => (
                    <button
                        key={filter.id}
                        onClick={() => setSelectedCategory(filter.id)}
                        className={clsx(
                            'flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200',
                            selectedCategory === filter.id
                                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-blue-300'
                        )}
                    >
                        {filter.id !== 'All' && <Filter className="w-3.5 h-3.5" />}
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            {loadingProducts ? (
                <div className="flex flex-col justify-center items-center py-20 min-h-[400px]">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                    <span className="text-gray-500 font-medium">Đang tải dữ liệu...</span>
                </div>
            ) : (
                <>
                    {/* Grid Sản Phẩm */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {displayProducts.map(product => (
                            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
                                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {!product.isInStock && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="bg-gray-900 text-white text-sm font-bold px-3 py-1 rounded">Hết hàng</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 flex-grow flex flex-col">
                                    <div className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wider">{product.category}</div>
                                    <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 flex-grow" title={product.name}>
                                        {product.name}
                                    </h3>

                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg font-bold text-red-600">
                                            {product.originalPrice.toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <span className={clsx(
                                            "text-xs font-medium px-2 py-1 rounded",
                                            product.isInStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                        )}>
                                            {product.isInStock
                                                ? `Sẵn sàng: ${product.stock} ${product.description ? `(${product.description.split(': ')[1]})` : ''}`
                                                : 'Tạm hết hàng'}
                                        </span>
                                    </div>

                                    <button
                                        disabled={!product.isInStock}
                                        onClick={() => {
                                            if (!selectedBranch || selectedBranch === 'All') {
                                                alert('Vui lòng chọn một chi nhánh cụ thể để thêm vào giỏ hàng.');
                                                return;
                                            }
                                            addToCart(product, 1, selectedBranch);
                                            alert(`Đã thêm ${product.name} vào giỏ!`);
                                        }}
                                        className={clsx(
                                            "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors",
                                            product.isInStock
                                                ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        )}
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        {product.isInStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {displayProducts.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <div className="text-gray-400 mb-2 text-4xl">📦</div>
                            <p className="text-gray-500">
                                {selectedCategory !== 'All'
                                    ? `Không có sản phẩm thuộc danh mục "${QUICK_FILTERS.find(f => f.id === selectedCategory)?.label}"`
                                    : 'Không tìm thấy sản phẩm nào phù hợp.'}
                            </p>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm font-medium"
                            >
                                <ChevronLeft className="w-4 h-4" /> Trang trước
                            </button>

                            <span className="text-sm font-medium text-gray-700">
                                Trang <span className="text-blue-600 font-bold">{pagination.page}</span> / {pagination.totalPages}
                            </span>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                                disabled={currentPage === pagination.totalPages}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm font-medium"
                            >
                                Trang sau <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}