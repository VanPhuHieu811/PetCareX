import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Calendar, User, Menu, X, Home, PawPrint, Package } from 'lucide-react';
import { useState, useMemo } from 'react'; // Nhớ import useMemo
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { getTotalItems } = useCart();
    const { user } = useAuth();

    // ===============================================
    // LOGIC ĐỒNG BỘ AVATAR VỚI PROFILE
    // ===============================================
    const { displayName, avatarUrl } = useMemo(() => {
        const u = user as any;
        // 1. Lấy tên hiển thị
        const name = u?.HoTen || u?.name || "Khách hàng";
        
        // 2. Xử lý Avatar: Nếu không có ảnh thật -> Dùng ui-avatars
        let src = u?.Avatar;
        if (!src) {
            // Tham số background=random sẽ tạo màu ngẫu nhiên dựa trên tên
            // Đảm bảo logic này giống hệt bên file Profile.tsx
            src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=150`;
        }

        return { displayName: name, avatarUrl: src };
    }, [user]);
    // ===============================================

    const navigation = [
        { name: 'Trang chủ', href: '/customer/home', icon: Home },
        { name: 'Sản phẩm', href: '/customer/products', icon: Package },
        { name: 'Đặt lịch', href: '/customer/booking', icon: Calendar },
        { name: 'Hồ sơ cá nhân', href: '/customer/profile', icon: User },
    ];

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/customer/home" className="flex-shrink-0 flex items-center gap-2">
                            <div className="bg-blue-600 p-1.5 rounded-lg">
                                <PawPrint className="h-6 w-6 text-white" />
                            </div>
                            <span className="font-bold text-xl text-blue-900">PetCareX</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-8">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={clsx(
                                        'inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200',
                                        isActive
                                            ? 'text-blue-600'
                                            : 'text-gray-500 hover:text-blue-600'
                                    )}
                                >
                                    <Icon className="w-4 h-4 mr-2" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Info & Cart */}
                    <div className="flex items-center">
                        <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200 ml-4">
                            {/* Cart Icon */}
                            <Link
                                to="/customer/cart"
                                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                title="Giỏ hàng"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {getTotalItems() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {getTotalItems() > 9 ? '9+' : getTotalItems()}
                                    </span>
                                )}
                            </Link>

                            {/* Link User Info */}
                            <Link 
                                to="/customer/profile" 
                                className="flex items-center gap-2 hover:bg-gray-50 py-1 px-2 rounded-full transition-all group"
                                title="Trang cá nhân"
                            >
                                {/* Luôn luôn hiển thị thẻ IMG vì avatarUrl luôn có giá trị */}
                                <img 
                                    src={avatarUrl} 
                                    alt="Avatar" 
                                    className="h-9 w-9 rounded-full object-cover border border-gray-200"
                                />
                                
                                <span className="text-sm font-medium text-gray-700 max-w-[150px] truncate group-hover:text-blue-700">
                                    {displayName}
                                </span>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            >
                                {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={clsx('sm:hidden', isOpen ? 'block' : 'hidden')}>
                <div className="pt-2 pb-3 space-y-1">
                    {/* User Info in Mobile Menu Header */}
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                        {/* Mobile Avatar */}
                        <img 
                            src={avatarUrl} 
                            alt="Avatar" 
                            className="h-10 w-10 rounded-full object-cover border border-gray-200"
                        />
                        <div>
                            <div className="font-medium text-gray-800">{displayName}</div>
                            <Link to="/customer/profile" className="text-xs text-blue-600 hover:underline" onClick={() => setIsOpen(false)}>
                                Xem hồ sơ
                            </Link>
                        </div>
                    </div>

                    {/* Cart Link in Mobile */}
                    <Link
                        to="/customer/cart"
                        className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                        onClick={() => setIsOpen(false)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <ShoppingCart className="w-5 h-5 mr-3" />
                                <span className="text-base font-medium">Giỏ hàng</span>
                            </div>
                            {getTotalItems() > 0 && (
                                <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {getTotalItems() > 9 ? '9+' : getTotalItems()}
                                </span>
                            )}
                        </div>
                    </Link>

                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={clsx(
                                'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
                                location.pathname === item.href
                                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                            )}
                            onClick={() => setIsOpen(false)}
                        >
                            <div className="flex items-center">
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.name}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}