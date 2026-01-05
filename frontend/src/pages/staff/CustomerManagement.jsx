import React, { useState } from 'react';
import StaffLayout from '../../layouts/StaffLayout';
import { UserPlus, Search, Mail, Phone, MoreVertical, Star, Crown, PawPrint, Filter } from 'lucide-react';

const CustomerManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const customers = [
    { id: 1, name: 'Nguyễn Văn An', tier: 'VIP', phone: '0901234567', email: 'nguyenvanan@email.com', points: 245, spent: '15.0M', pets: [{name: 'Lucky', breed: 'Golden Retriever'}, {name: 'Miu', breed: 'British Shorthair'}] },
    { id: 2, name: 'Trần Thị Bình', tier: 'Thân thiết', phone: '0912345678', email: 'tranthiminh@email.com', points: 120, spent: '7.5M', pets: [{name: 'Bông', breed: 'Poodle'}] }
  ];

  return (
    <StaffLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý khách hàng</h1>
          <p className="text-sm text-gray-400 font-medium">Danh sách và thông tin chi tiết tất cả khách hàng</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#0095FF] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 shadow-lg shadow-blue-100"
        >
          <UserPlus size={20} /> Thêm khách hàng
        </button>
      </div>

      {/* Thẻ thống kê nhanh */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatMiniCard label="VIP" count="1" icon={Crown} color="orange" />
        <StatMiniCard label="Thân thiết" count="2" icon={Star} color="blue" />
        <StatMiniCard label="Cơ bản" count="1" icon={PawPrint} color="gray" />
      </div>

      {/* Bộ lọc */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Tìm theo tên, SĐT, email..." className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/5 shadow-sm" />
        </div>
        <div className="flex items-center gap-2 bg-white px-4 border border-gray-100 rounded-xl shadow-sm text-sm font-bold text-gray-500 cursor-pointer">
          <Filter size={16} /> Tất cả
        </div>
      </div>

      {/* Danh sách thẻ khách hàng */}
      <div className="space-y-6">
        {customers.map((c) => (
          <div key={c.id} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="flex justify-between items-start">
              <div className="flex gap-6">
                {/* Avatar Initials */}
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 font-black text-xl shadow-inner">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-800">{c.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold border ${c.tier === 'VIP' ? 'bg-orange-50 border-orange-200 text-orange-500' : 'bg-blue-50 border-blue-200 text-blue-500'}`}>
                      {c.tier === 'VIP' ? '👑 VIP' : '⭐ ' + c.tier}
                    </span>
                  </div>
                  <div className="flex gap-6 mt-3 text-sm font-medium text-gray-400">
                    <span className="flex items-center gap-2"><Phone size={14} className="text-gray-300" /> {c.phone}</span>
                    <span className="flex items-center gap-2"><Mail size={14} className="text-gray-300" /> {c.email}</span>
                    <span className="flex items-center gap-2"><PawPrint size={14} className="text-gray-300" /> {c.pets.length} thú cưng</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Điểm tích lũy</p>
                <h4 className="text-2xl font-black text-blue-500 tracking-tighter">{c.points}</h4>
                <p className="text-[11px] text-gray-400 font-bold mt-1 uppercase">Đã chi: {c.spent} VNĐ</p>
              </div>

              <button className="absolute right-6 top-6 p-2 text-gray-300 hover:text-gray-600 transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Danh sách thú cưng của khách */}
            <div className="mt-8 pt-6 border-t border-gray-50">
               <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-4">Thú cưng:</p>
               <div className="flex gap-3">
                 {c.pets.map((pet, idx) => (
                   <div key={idx} className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2 flex items-center gap-3 hover:bg-white transition-all cursor-pointer hover:border-blue-100 shadow-sm">
                     <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <PawPrint size={14} className="text-gray-300" />
                     </div>
                     <div>
                       <p className="text-xs font-bold text-gray-700">{pet.name}</p>
                       <p className="text-[10px] text-gray-400 font-medium">{pet.breed}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL THÊM KHÁCH HÀNG (Demo) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl w-full max-w-[500px] shadow-2xl p-8 animate-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Thêm khách hàng mới</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 p-2"><Star size={20} /></button>
              </div>
              <div className="space-y-4">
                <InputGroup label="Họ và tên" placeholder="VD: Nguyễn Văn A" />
                <InputGroup label="Số điện thoại" placeholder="090 123 4567" />
                <InputGroup label="Email" placeholder="example@email.com" />
              </div>
              <div className="flex gap-3 mt-8">
                 <button onClick={() => setShowAddModal(false)} className="flex-1 py-3.5 bg-gray-50 text-gray-500 rounded-xl font-bold">Hủy bỏ</button>
                 <button className="flex-1 py-3.5 bg-[#0095FF] text-white rounded-xl font-bold shadow-lg shadow-blue-100">Xác nhận thêm</button>
              </div>
           </div>
        </div>
      )}
    </StaffLayout>
  );
};

const StatMiniCard = ({ label, count, icon: Icon, color }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color === 'orange' ? 'bg-orange-50 text-orange-500' : color === 'blue' ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-400'}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">{label}</p>
      <p className="text-xl font-black text-gray-800 tracking-tighter">{count}</p>
    </div>
  </div>
);

const InputGroup = ({ label, placeholder }) => (
  <div>
    <label className="text-[11px] font-bold text-gray-500 uppercase mb-2 block ml-1">{label}</label>
    <input type="text" placeholder={placeholder} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/10 focus:outline-none" />
  </div>
);

export default CustomerManagement;