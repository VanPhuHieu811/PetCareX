import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, Plus, Edit, X, Save, Trash2, Cat, PackagePlus } from 'lucide-react';
import { formatDate } from '../../components/formatter';
import { formatVND } from '../../components/formatter';
import PageNumber from '../../components/PageNumber';
import '../../styles/Inventory.css';

const BASEURL = "http://localhost:3000/api/v1"

function productForm(product, currentProduct, setCurrentProduct) {
	return (
		<button key={product.MaSP}
			className={currentProduct.MaSP === product.MaSP ?
				"bg-blue-50 product-info" : "product-info"}
			onClick={() => setCurrentProduct({
				MaSP: product.MaSP,
				TenSP: product.TenSP,
				TenLoaiSP: product.TenLoaiSP,
				GiaBan: product.GiaBan,
				DonViTinh: product.DonViTinh,
				SoLuongTonKho: 0,
				TrangThai: 0
			})}
		>
			<Cat size={30} className="text-gray-400 mx-auto" />
			<div className="product-info-details">
				<h3 className="text-lg font-medium text-gray-800">{product.MaSP} - {product.TenSP}</h3>
				<p className="text-sm text-gray-600">Loại: {product.TenLoaiSP}</p>
				<p className="text-sm text-gray-600">Giá bán: {formatVND(product.GiaBan)} / {product.DonViTinh}</p>
			</div>
		</button>
	)
}

export default function Inventory() {
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const [currentAllPage, setCurrentAllPage] = useState(1);
	const [totalAllPages, setTotalAllPages] = useState(1);
	// State quản lý Modal
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSelectAmountOpen, setIsSelectAmountOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [currentProduct, setCurrentProduct] = useState({
		MaSP: '',
		TenSP: '',
		TenLoaiSP: '',
		GiaBan: 0,
		DonViTinh: '',
		SoLuongTonKho: 0,
		TrangThai: 0,
	});

	// Lấy dữ liệu branch của người dùng
	const [branchID, setBranchID] = useState("");
	const [products, setProducts] = useState([]); // product trong chi nhánh
	const [deletedProducts, setDeletedProducts] = useState([]); // tất cả product nhánh có TrangThai = 1)
	useEffect(() => {
		async function fetchStaffBranch() {
			try {
				const token = localStorage.getItem('petcare_token');
				const res = await fetch(`${BASEURL}/branches/staff-branch`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				});
				if (!res.ok)
					throw new Error(`Failed to fetch staff branch: ${res.status} ${res.statusText}`);
				const data = await res.json();
				if (data.length > 0) {
					setBranchID(data[0].MaCN);
				} else {
					console.error('No branch found for the staff member.');
				}
			} catch (error) {
				console.error('Error fetching staff branch:', error);
			}
		}
		fetchStaffBranch();

		async function fetchCountTotalPages() { // TotalAllPages (15)
			try {
				const res = await fetch(`${BASEURL}/products/countall`);
				if (!res.ok)
					throw new Error(`Failed to fetch total product count: ${res.status} ${res.statusText}`);
				const data = await res.json();
				const totalProducts = data.totalProducts || 0;
				const pages = Math.ceil(totalProducts / 15);
				setTotalAllPages(pages);
			} catch (error) {
				console.error('Error fetching total product count:', error);
			}
		}
		fetchCountTotalPages();
	}, []);

	useEffect(() => {
		const fetchBranchProducts = async () => { // currentPage (20)
			if (!branchID) return;
			try {
				// update lại page và limit khi tạo chuyển trang hoặc lọc
				const res = await fetch(`${BASEURL}/products/branch?branchId=${branchID}&page=${currentPage}&limit=20`);
				if (!res.ok)
					throw new Error(`Failed to fetch branch products: ${res.status} ${res.statusText}`);
				const data = await res.json(); 
				setProducts(data.filter(p => p.TrangThai === false)); // Lọc những sản phẩm chưa bị xóa
				setDeletedProducts(data.filter(p => p.TrangThai === true)); // Bao gồm cả sản phẩm bị xóa (TrangThai = true)
			} catch (error) {
				console.error('Error fetching branch products:', error);
			}
		};
		fetchBranchProducts();

		const fetchCountBranchTotalPages = async () => { // TotalAllPages (20)
			if (!branchID) return;
			try {
				const res = await fetch(`${BASEURL}/products/countbranch?branchId=${branchID}`);
				if (!res.ok)
					throw new Error(`Failed to fetch branch product count: ${res.status} ${res.statusText}`);
				const data = await res.json();
				const totalProducts = data.totalProducts || 0;
				const pages = Math.ceil(totalProducts / 20);
				setTotalPages(pages);
			} catch (error) {
				console.error('Error fetching branch product count:', error);
			}
		};
		fetchCountBranchTotalPages();
	}, [branchID]);

	const filteredProducts = products.filter(p =>
		p.TenSP.toLowerCase().includes(searchTerm.toLowerCase()) ||
		p.MaSP.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Mở modal để thêm sản phẩm mới
	const [allProducts, setAllProducts] = useState([]); // product petcareX
	const handleAddNew = async () => { // currentAllPage (15)
		try {
			setIsModalOpen(true);
			setCurrentProduct({
				MaSP: '',
				TenSP: '',
				TenLoaiSP: '',
				GiaBan: 0,
				DonViTinh: '',
				SoLuongTonKho: 0
			});

			const res = await fetch(`${BASEURL}/products?page=${currentAllPage}&limit=15`);
			if (!res.ok)
				throw new Error(`Failed to fetch all products: ${res.status} ${res.statusText}`);
			const data = await res.json();
			setAllProducts(data.data?.data || []);
		}
		catch (error) {
			console.error('Error fetching all products:', error);
		}
	};

	// Xử lý chọn sản phẩm để thêm mới từ danh sách
	const handleSelectProduct = async () => {
		if (!currentProduct.MaSP) {
			alert("Vui lòng chọn sản phẩm để nhập hàng!");
			return;
		}

		if(deletedProducts.find(p => p.MaSP === currentProduct.MaSP && p.TrangThai === true)) {
			try {
				console.log("Đang khôi phục sản phẩm đã xóa trước đó...");
				// Đổi trạng thái sản phẩm của chi nhánh qua 0 (đang hoạt động)
				await fetch(`${BASEURL}/products/branch/recover`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						branchId: branchID,
						productId: currentProduct.MaSP
					})
				});
				alert("Sản phẩm đã bị xóa trước đó, khôi phục lại sản phẩm!");
			}
			catch (error) {
				alert("Lỗi khi khôi phục sản phẩm về chi nhánh");
				console.error('Error recovering product to branch:', error);
			}
			setIsModalOpen(false);
			return;
		}

		if (products.find(p => p.MaSP === currentProduct.MaSP)) {
			alert("Sản phẩm đã có tại chi nhánh này rồi");
			return;
		}

		setIsModalOpen(false);
		setIsSelectAmountOpen(true);
	}

	// Xử lý thêm sản phẩm mới
	const handleSave = async () => {
		if (currentProduct.SoLuongTonKho <= 0) {
			alert("Vui lòng nhập số lượng lớn hơn 0");
			return;
		}

		try {
			const res = await fetch(`${BASEURL}/products/branch`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					branchId: branchID,
					productId: currentProduct.MaSP,
					tonKho: currentProduct.SoLuongTonKho
				})
			});
			if (!res.ok) {
				alert("Lỗi khi thêm sản phẩm vào chi nhánh");
				return;
			}
			// Cập nhật lại danh sách sản phẩm sau khi thêm
			setProducts([...products, currentProduct]);
			setIsSelectAmountOpen(false);
			alert("Thêm sản phẩm vào chi nhánh thành công!");
		}
		catch (error) {
			console.error('Error adding product to branch:', error);
		}
	};

	// Mở modal để chỉnh sửa
	const [addedStock, setAddedStock] = useState(0);
	const handleEdit = (product) => {
		setAddedStock(0);
		setCurrentProduct(product);
		setIsEditing(true);
	};

	const handleAddingStock = async () => { // Cần fix!!!!!
		if (addedStock <= 0) {
			alert("Vui lòng nhập số lượng lớn hơn 0");
			return;
		}
		try {
			const res = await fetch(`${BASEURL}/products/branch/stock`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					branchId: branchID,
					productId: currentProduct.MaSP,
					quantity: currentProduct.SoLuongTonKho + addedStock
				})
			});
			if (!res.ok) {
				alert("Lỗi khi cập nhật số lượng sản phẩm trong chi nhánh");
				return;
			}
			// Cập nhật lại danh sách sản phẩm sau khi thêm
			setProducts(products.map(p =>
				p.MaSP === currentProduct.MaSP
					? { ...p, SoLuongTonKho: p.SoLuongTonKho + addedStock }
					: p
			));
			alert("Cập nhật số lượng sản phẩm trong chi nhánh thành công!");
			setIsEditing(false);
		}
		catch (error) {
			console.error('Error updating product stock in branch:', error);
		}
	};

	// Xóa sản phẩm khỏi chi nhánh
	const handleDelete = async (maSP) => {
		try {
			const res = await fetch(`${BASEURL}/products/branch`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					branchId: branchID,
					productId: maSP
				})
			});
			if (!res.ok) {
				const errorData = await res.json().catch(() => null);
				console.error('Delete error:', res.status, errorData);
				alert("Sản phẩm đã xuất hiện trong đơn hàng khác, không thể xóa!");
				return;
			}
			// Cập nhật lại danh sách sản phẩm sau khi xóa
			setProducts(products.filter(p => p.MaSP !== maSP));
			alert("Xóa sản phẩm khỏi chi nhánh thành công!");
		}
		catch (error) {
			console.error('Error deleting product from branch:', error);
		}
	};

	// Đổi trang danh sách tất cả sản phẩm trong popup
	const handlePageChange = async (page) => { // 15
		if (page < 1 || page > totalAllPages) return;
		try {
			setCurrentAllPage(page);
			const res = await fetch(`${BASEURL}/products?page=${page}&limit=15`);
			if (!res.ok)
				throw new Error(`Failed to fetch all products: ${res.status} ${res.statusText}`);
			const data = await res.json();
			setAllProducts(data.data?.data || []);
		}
		catch (error) {
			console.error('Error fetching all products:', error);
		}
	};

	// Đổi trang danh sách tất cả sản phẩm chi nhánh
	const handleBranchPageChange = async (page) => { // 20
		if (page < 1 || page > totalPages) return;
		try {
			setCurrentPage(page);
			const res = await fetch(`${BASEURL}/products/branch?branchId=${branchID}&page=${page}&limit=20`);
			if (!res.ok)
				throw new Error(`Failed to fetch branch products: ${res.status} ${res.statusText}`);
			const data = await res.json();
			setProducts(data);
		}
		catch (error) {
			console.error('Error fetching branch products:', error);
		}
	};

	if (!Array.isArray(products) || products.length === 0) {
		return (
			<p className="text-center font-medium text-[20px] text-blue-500"> Đang tải dữ liệu sản phẩm... </p>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-800">Quản lý Kho hàng</h1>
					<p className="text-gray-500">Theo dõi tồn kho, nhập hàng và điều chỉnh</p>
				</div>
				<button
					onClick={() => handleAddNew()}
					className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
				>
					<Plus size={18} />
					<span>Nhập hàng mới</span>
				</button>
			</div>

			{/* Search and Filter */}
			<div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
					<input
						type="text"
						placeholder="Tìm kiếm sản phẩm theo tên hoặc mã..."
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<div className="flex items-center space-x-2 text-sm text-gray-600">
					<span className="w-3 h-3 bg-red-100 border border-red-500 rounded-full block"></span>
					<span>Sắp hết hàng (&lt;10)</span>
				</div>
			</div>

			{/* Product Table */}
			<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
				<table className="w-full text-left">
					<thead className="bg-gray-50 border-b border-gray-200">
						<tr>
							<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã SP</th>
							<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên Sản Phẩm</th>
							<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Loại</th>
							<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Giá Bán</th>
							<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Đơn vị</th>
							<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Tồn Kho</th>
							<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Thao tác</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{filteredProducts.map((product) => (
							<tr key={product.MaSP} className="hover:bg-gray-50 transition-colors">
								<td className="px-6 py-4 text-sm font-medium text-gray-900">{product.MaSP}</td>
								<td className="px-6 py-4 text-sm text-gray-800">{product.TenSP}</td>
								<td className="px-6 py-4 text-sm text-gray-600">
									<span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{product.TenLoaiSP}</span>
								</td>
								<td className="px-6 py-4 text-sm text-gray-800 text-right">
									{formatVND(product.GiaBan)}
								</td>
								<td className="px-6 py-4 text-sm text-gray-800 text-center">{product.DonViTinh}</td>
								<td className="px-6 py-4 text-sm text-center">
									<div className={`flex items-center justify-center space-x-2 ${product.SoLuongTonKho < 10 ? 'text-red-600 font-bold' : 'text-gray-800'}`}>
										{product.SoLuongTonKho < 10 && <AlertTriangle size={14} />}
										<span>{product.SoLuongTonKho}</span>
									</div>
								</td>
								<td className="cursor-pointer px-6 py-4 text-sm text-center flex justify-center space-x-3">
									<button
										onClick={() => handleEdit(product)}
										className="cursor-pointer text-gray-500 hover:text-blue-600 transition-colors p-1"
										title="Điều chỉnh kho"
									>
										<Edit size={16} />
									</button>
									<button
										onClick={() => handleDelete(product.MaSP)}
										className="cursor-pointer text-gray-500 hover:text-red-600 transition-colors p-1"
										title="Xóa sản phẩm"
									>
										<Trash2 size={16} />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<PageNumber
					currentPage={currentPage} 
					totalPages={totalPages} 
					onPageChange={handleBranchPageChange}
				/>
				{filteredProducts.length === 0 && (
					<div className="p-8 text-center text-gray-500">
						Không tìm thấy sản phẩm nào.
					</div>
				)}
			</div>

			{/* Popup lựa sản phẩm thêm vào */}
			{(isModalOpen && products.length > 0) && (
				<div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
						<div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
							<h2 className="text-white font-bold text-lg">
								Nhập hàng mới
							</h2>
							<button onClick={() => setIsModalOpen(false)} className="cursor-pointer text-blue-100 hover:text-white">
								<X size={20} />
							</button>
						</div>

						<div className="product-add-list p-6 space-y-4">
							<PageNumber currentPage={currentAllPage} totalPages={totalAllPages} onPageChange={handlePageChange} />

							{Array.isArray(allProducts) && allProducts.length > 0 ? (
								allProducts.map(product => (
									productForm(product, currentProduct, setCurrentProduct)
								))
							) : (
								<p className="text-center text-gray-500">Đang tải danh sách sản phẩm...</p>
							)}

							<PageNumber currentPage={currentAllPage} totalPages={totalAllPages} onPageChange={handlePageChange} />

							<div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-100">
								<button
									onClick={() => setIsModalOpen(false)}
									className="cursor-pointer px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
								>
									Hủy bỏ
								</button>
								<button
									onClick={handleSelectProduct}
									className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2"
								>
									<Save size={16} />
									<span>Thêm mới</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Popup thêm số lượng kho */}
			{isSelectAmountOpen && !isModalOpen && (
				<div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
						<div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
							<h2 className="text-white font-bold text-lg">
								Nhập số lượng thêm vào kho
							</h2>
							<button onClick={() => setIsSelectAmountOpen(false)} className="cursor-pointer text-blue-100 hover:text-white">
								<X size={20} />
							</button>
						</div>

						<input
							type="number"
							min="1"
							className="w-[90%] border border-gray-300 rounded-lg p-3 my-4 outline-none focus:ring-2 focus:ring-blue-500"
							style={{ margin: '20px auto', display: 'block' }}
							placeholder="Nhập số lượng tồn kho"
							value={currentProduct.SoLuongTonKho}
							onChange={(e) => setcurrentProduct({ ...currentProduct, SoLuongTonKho: parseInt(e.target.value) })}
						/>

						<div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-100">
							<button
								onClick={() => setIsSelectAmountOpen(false)}
								className="cursor-pointer px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
							>
								Hủy bỏ
							</button>
							<button
								onClick={() => handleSave()}
								className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2"
							>
								<Save size={16} />
								<span>Thêm mới</span>
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Popup chỉnh sửa số lượng kho */}
			{isEditing && (
				<div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
						<div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
							<h2 className="text-white font-bold text-lg">
								Bổ sung sản phẩm vào kho hàng
							</h2>
							<button onClick={() => setIsEditing(false)} className="cursor-pointer text-blue-100 hover:text-white">
								<X size={20} />
							</button>
						</div>

						<input
							type="number"
							min="1"
							className="w-[90%] border border-gray-300 rounded-lg p-3 my-4 outline-none focus:ring-2 focus:ring-blue-500"
							style={{ margin: '20px auto', display: 'block' }}
							placeholder="Nhập số thêm"
							value={addedStock}
							onChange={(e) => setAddedStock(parseInt(e.target.value))}
						/>

						<div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-100">
							<button
								onClick={() => setIsEditing(false)}
								className="cursor-pointer px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
							>
								Hủy bỏ
							</button>
							<button
								onClick={() => handleAddingStock()}
								className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2"
							>
								<PackagePlus size={16} />
								<span>Bổ sung</span>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};