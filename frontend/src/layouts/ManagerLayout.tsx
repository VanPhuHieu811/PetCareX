import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
	LayoutDashboard,
	Syringe,
	Package,
	Dog,
	Users,
	UserCircle,
	LogOut,
	PawPrint
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
	<NavLink
		to={to}
		className={({ isActive }) =>
			`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
				? 'bg-blue-50 text-blue-600 font-medium'
				: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
			}`
		}
	>
		<Icon size={20} />
		<span>{label}</span>
	</NavLink>
);

const Layout: React.FC = () => {
	const navigate = useNavigate();
	const { logout } = useAuth();

	const handleLogout = () => {
		logout();
		navigate('/login', { replace: true });
	};

	return (
		<div className="flex h-screen bg-white">
			{/* Sidebar */}
			<aside className="w-64 border-r border-gray-200 flex flex-col fixed h-full bg-white z-10">
				<div className="p-6 border-b border-gray-100 flex items-center space-x-2">
					<div className="bg-[#0095FF] p-2 rounded-xl text-white shadow-sm">
						<PawPrint size={22} fill="currentColor" />
					</div>
					<span className="text-xl font-bold text-gray-800 tracking-tight">PetCareX</span>
				</div>

				<nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
					<SidebarItem to="/manager/dashboard" icon={LayoutDashboard} label="Tổng quan & Doanh thu" />
					<SidebarItem to="/manager/vaccination" icon={Syringe} label="Tiêm phòng" />
					<SidebarItem to="/manager/inventory" icon={Package} label="Kho hàng & Sản phẩm" />
					<SidebarItem to="/manager/pets" icon={Dog} label="Hồ sơ Thú cưng" />
					<SidebarItem to="/manager/employees" icon={Users} label="Nhân sự" />
					<SidebarItem to="/manager/customers" icon={UserCircle} label="Khách hàng" />
				</nav>

				<div className="p-4 border-t border-gray-100">
					<button type="button" onClick={handleLogout} className="cursor-pointer flex items-center space-x-3 text-gray-500 hover:text-red-600 w-full px-4 py-2 transition-colors">
						<LogOut size={20} />
						<span>Đăng xuất</span>
					</button>
				</div>
			</aside>

			{/* Main Content */}
			<main className="flex-1 ml-64 bg-gray-50 min-h-screen">
				<div className="p-8 max-w-7xl mx-auto">
					<Outlet />
				</div>
			</main>
		</div>
	);
};

export default Layout;