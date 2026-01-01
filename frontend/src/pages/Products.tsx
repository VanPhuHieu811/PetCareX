import { useState } from 'react';
import { products } from '../data/mockDatabase';
import { Search, ShoppingCart, Filter } from 'lucide-react';
import clsx from 'clsx';

export default function Products() {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['All', ...new Set(products.map(p => p.category))];

    const filteredProducts = products.filter(product => {
        const matchCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Sản phẩm cho thú cưng</h1>
                    <p className="text-gray-500 mt-1">Chăm sóc người bạn nhỏ với những sản phẩm tốt nhất</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:w-64">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <button className="md:hidden p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Filter className="h-5 w-5 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Tabs / Filter Groups */}
            <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={clsx(
                            'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                            selectedCategory === category
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                        )}
                    >
                        {category === 'All' ? 'Tất cả' : category}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col">
                        <div className="relative aspect-square bg-gray-100 overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {product.discountPercentage > 0 && (
                                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    -{product.discountPercentage}%
                                </div>
                            )}
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

                            <div className="flex items-center gap-2 mb-4">
                                {product.salePrice ? (
                                    <>
                                        <span className="text-lg font-bold text-red-600">
                                            {product.salePrice.toLocaleString('vi-VN')}đ
                                        </span>
                                        <span className="text-sm text-gray-400 line-through">
                                            {product.originalPrice.toLocaleString('vi-VN')}đ
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-lg font-bold text-gray-900">
                                        {product.originalPrice.toLocaleString('vi-VN')}đ
                                    </span>
                                )}
                            </div>

                            <button
                                disabled={!product.isInStock}
                                onClick={() => alert(`Đã thêm ${product.name} vào giỏ!`)}
                                className={clsx(
                                    "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors",
                                    product.isInStock
                                        ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                )}
                            >
                                <ShoppingCart className="w-4 h-4" />
                                {product.isInStock ? 'Thêm vào giỏ' : 'Tạm hết hàng'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                    <div className="text-gray-400 mb-2 text-6xl">🔍</div>
                    <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào phù hợp.</p>
                </div>
            )}
        </div>
    );
}
