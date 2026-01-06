import { useCart } from '../context/CartContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export default function Cart() {
    const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

    const handleCheckout = () => {
        if (items.length === 0) return;
        // TODO: Implement checkout logic
        alert('Tính năng thanh toán đang được phát triển!');
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
            <div className="mb-6">
                <Link
                    to="/products"
                    className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Tiếp tục mua sắm
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
            </div>

            {items.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Giỏ hàng trống</h2>
                    <p className="text-gray-500 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                    <Link
                        to="/products"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Mua sắm ngay
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => {
                            const price = item.product.salePrice || item.product.originalPrice;
                            return (
                                <div
                                    key={item.product.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                                >
                                    <div className="flex gap-4">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0">
                                            <img
                                                src={item.product.image || 'https://via.placeholder.com/150'}
                                                alt={item.product.name}
                                                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                                            <p className="text-sm text-gray-500 mb-2">{item.product.category}</p>

                                            <div className="flex items-center gap-4 mt-4">
                                                {/* Price */}
                                                <div className="flex items-center gap-2">
                                                    {item.product.salePrice ? (
                                                        <>
                                                            <span className="text-lg font-bold text-blue-600">
                                                                {item.product.salePrice.toLocaleString('vi-VN')}đ
                                                            </span>
                                                            <span className="text-sm text-gray-400 line-through">
                                                                {item.product.originalPrice.toLocaleString('vi-VN')}đ
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-lg font-bold text-blue-600">
                                                            {item.product.originalPrice.toLocaleString('vi-VN')}đ
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex flex-col items-end justify-between">
                                            <button
                                                onClick={() => removeFromCart(item.product.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Xóa sản phẩm"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>

                                            <div className="flex items-center gap-3 border border-gray-200 rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-12 text-center font-medium text-gray-900">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                    disabled={!item.product.isInStock}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="text-right mt-2">
                                                <div className="text-sm text-gray-500">Thành tiền</div>
                                                <div className="text-lg font-bold text-blue-600">
                                                    {(price * item.quantity).toLocaleString('vi-VN')}đ
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính ({items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm)</span>
                                    <span>{getTotalPrice().toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Phí vận chuyển</span>
                                    <span>Miễn phí</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                                        <span className="text-xl font-bold text-blue-600">
                                            {getTotalPrice().toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-3"
                            >
                                Thanh toán
                            </button>

                            <button
                                onClick={clearCart}
                                className="w-full py-2 text-gray-600 hover:text-red-600 transition-colors text-sm"
                            >
                                Xóa tất cả
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

