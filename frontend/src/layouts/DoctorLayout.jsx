import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { currentUser } from '../services/mockDataBS';
import { useNavigate } from 'react-router-dom';
import { PawPrint } from 'lucide-react';

// Sidebar nội bộ, dùng trong layout
const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
	const menuItems = [
		{ name: 'Dashboard', icon: '', path: '/doctor/dashboard' },
		{ name: 'Cài đặt', icon: '', path: '/doctor/settings' },
	];

	const navigate = useNavigate();

	return (
		<div className={`transition-all duration-300 bg-[#3b71ca] min-h-screen text-white flex flex-col fixed left-0 top-0 shadow-lg z-50 ${isCollapsed ? 'w-20' : 'w-64'}`}>
			<div className={`p-6 ${isCollapsed ? 'px-4' : ''}`}>
				<div className="flex items-center gap-3 mb-10 overflow-hidden whitespace-nowrap">
					<div className="bg-[#0095FF] p-2 rounded-xl text-white shadow-sm">
						<PawPrint size={22} fill="currentColor" />
					</div>
					{!isCollapsed && (
						<div className="transition-opacity duration-300">
							<h2 className="font-bold text-xl leading-tight text-white"> PetCareX </h2>
							<p className="text-[10px] text-blue-100 uppercase tracking-widest opacity-80">
								Quản lý phòng khám
							</p>
						</div>
					)}
				</div>

				<nav className="space-y-1">
					{menuItems.map((item) => (
						<div
						key={item.name}
						onClick={() => navigate(item.path)}
						className={`flex items-center rounded-xl cursor-pointer transition-all h-12 
							${isCollapsed ? 'justify-center' : 'px-4 gap-4'}
							${location.pathname === item.path
							? 'bg-white text-[#3b71ca] font-bold shadow-md'
							: 'text-blue-50 hover:bg-white/10'
							}`}
						title={isCollapsed ? item.name : ''}
						>
						<span className="text-xl shrink-0">{item.icon}</span>
						{!isCollapsed && (
							<span className="text-sm transition-opacity duration-300">
							{item.name}
							</span>
						)}
						</div>
					))}
				</nav>

			</div>

			<div className="mt-auto p-4">
				<div
					className={`bg-white/10 backdrop-blur-md rounded-2xl flex items-center border border-white/10 overflow-hidden transition-all ${isCollapsed ? 'p-2 justify-center' : 'p-4 gap-3'
						}`}
				>
					<div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shrink-0 shadow-sm">
						{currentUser.avatar}
					</div>
					{!isCollapsed && (
						<div className="overflow-hidden transition-opacity duration-300">
							<p className="text-xs font-bold truncate text-white">
								{currentUser.hoTen}
							</p>
							<p className="text-[10px] opacity-70 truncate text-blue-100">
								{currentUser.chucVu}
							</p>
						</div>
					)}
				</div>

				<button
					onClick={() => navigate('/login')}
					style={{ width: '100%', margin: '10px auto', color: '#fff' }}
					className='opacity-50 hover:opacity-100 font-bold cursor-pointer'
				> ❮ Đăng xuất</button>

				<button
					onClick={() => setIsCollapsed(!isCollapsed)}
					className="w-full  cursor-pointer text-center opacity-50 hover:opacity-100 transition-opacity flex justify-center items-center font-bold tracking-tighter"
				>
					{isCollapsed ? '❯' : '❮ Thu gọn'}
				</button>
			</div>
		</div>
	);
};

// Layout chính dùng trong App.jsx
const CustomerLayout = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);

	return (
		<div className="flex bg-[#f4f7fe] min-h-screen antialiased font-sans">
			<Sidebar
				isCollapsed={isCollapsed}
				setIsCollapsed={setIsCollapsed}
			/>

			<div
				className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'
					}`}
			>
				<Outlet />
			</div>
		</div>
	);
};

export default CustomerLayout;