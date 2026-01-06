import React from 'react';
import { currentUser } from '../../services/mockData';

// Nhận isCollapsed và setIsCollapsed thông qua props
const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    { name: 'Dashboard', icon: '⊞', active: true },
    { name: 'Thú cưng', icon: '🐾', active: false },
    { name: 'Lịch hẹn', icon: '📅', active: false },
    { name: 'Cài đặt', icon: '⚙', active: false },
  ];

  return (
    <div className={`transition-all duration-300 bg-[#3b71ca] min-h-screen text-white flex flex-col fixed left-0 top-0 shadow-lg z-50 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`p-6 ${isCollapsed ? 'px-4' : ''}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 overflow-hidden whitespace-nowrap">
          <div className="bg-white/20 p-2 rounded-xl text-2xl shrink-0">🐾</div>
          {!isCollapsed && (
            <div className="transition-opacity duration-300">
              <h2 className="font-bold text-xl leading-tight text-white">VetCare</h2>
              <p className="text-[10px] text-blue-100 uppercase tracking-widest opacity-80">Quản lý phòng khám</p>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <div 
              key={item.name} 
              className={`flex items-center rounded-xl cursor-pointer transition-all h-12 ${isCollapsed ? 'justify-center' : 'px-4 gap-4'} ${item.active ? 'bg-white text-[#3b71ca] font-bold shadow-md' : 'text-blue-50 hover:bg-white/10'}`}
              title={isCollapsed ? item.name : ''}
            >
              <span className="text-xl shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="text-sm transition-opacity duration-300">{item.name}</span>}
            </div>
          ))}
        </nav>
      </div>

      {/* Profile & Toggle Button */}
      <div className="mt-auto p-4">
        <div className={`bg-white/10 backdrop-blur-md rounded-2xl flex items-center border border-white/10 overflow-hidden transition-all ${isCollapsed ? 'p-2 justify-center' : 'p-4 gap-3'}`}>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shrink-0 shadow-sm">
            {currentUser.avatar}
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden transition-opacity duration-300">
              <p className="text-xs font-bold truncate text-white">{currentUser.hoTen}</p>
              <p className="text-[10px] opacity-70 truncate text-blue-100">{currentUser.chucVu}</p>
            </div>
          )}
        </div>

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} // Gọi hàm từ props để thay đổi trạng thái ở App.jsx
          className="w-full text-center text-[10px] mt-4 opacity-50 hover:opacity-100 transition-opacity flex justify-center items-center font-bold tracking-tighter"
        >
          {isCollapsed ? '❯' : '❮ THU GỌN'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;