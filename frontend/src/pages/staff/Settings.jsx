import React from 'react';
import StaffLayout from '../../layouts/StaffLayout';
import { useState } from 'react';
import { User, Bell, Shield, LogOut, ChevronRight, Camera, Key, X } from 'lucide-react';

const Settings = () => {
  const [showPassModal, setShowPassModal] = useState(false);
  return (
    <StaffLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Cài đặt hệ thống</h1>
        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Cá nhân hóa trải nghiệm làm việc</p>
      </div>

      <div className="grid grid-cols-12 gap-8 font-sans">
        {/* Cột trái: Menu cài đặt */}
        <div className="col-span-4 space-y-4">
          <SettingsTab icon={User} label="Thông tin cá nhân" active />
          <SettingsTab icon={Bell} label="Thông báo" />
          <SettingsTab icon={Shield} label="Quyền hạn & Bảo mật" />
          <hr className="border-gray-100 my-6" />
          <button className="w-full flex items-center gap-4 p-5 rounded-[24px] text-red-500 hover:bg-red-50 transition-all font-black uppercase text-xs tracking-widest group">
             <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all"><LogOut size={20} /></div>
             Đăng xuất tài khoản
          </button>
        </div>

        {/* Cột phải: Nội dung chi tiết */}
        <div className="col-span-8 bg-white rounded-[40px] border border-gray-100 p-12 shadow-sm">
          <div className="flex items-center gap-8 mb-12">
            <div className="relative">
              <div className="w-32 h-32 rounded-[40px] bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-black border-8 border-white shadow-xl">TH</div>
              <button className="absolute -bottom-2 -right-2 p-3 bg-[#0095FF] text-white rounded-2xl shadow-lg border-4 border-white transition-transform hover:scale-110 active:scale-95"><Camera size={20} /></button>
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-800 tracking-tight">Trần Thị Hoa</h2>
              <p className="text-gray-400 font-bold text-sm italic uppercase tracking-widest mt-1">Lễ tân trưởng • Chi nhánh Quận 1</p>
              <div className="flex gap-3 mt-4">
                 <span className="bg-blue-50 text-blue-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>
                 <span className="bg-gray-50 text-gray-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Key size={12} /> ID: #ST-9920</span>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <section className="space-y-6">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] border-l-4 border-blue-500 pl-4 ml-1">Thông tin cơ bản</h3>
              <div className="grid grid-cols-2 gap-6">
                <InputGroup label="Họ và tên" value="Trần Thị Hoa" />
                <InputGroup label="Email" value="hoatran.petcarex@gmail.com" />
                <InputGroup label="Số điện thoại" value="0901 234 567" />
                <InputGroup label="Ngày vào làm" value="01/10/2023" />
              </div>
            </section>

<div className="space-y-10">
          <section className="space-y-6">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] border-l-4 border-emerald-500 pl-4 ml-1">Bảo mật tài khoản</h3>
            
            {/* Thêm onClick để mở Modal */}
            <div 
              onClick={() => setShowPassModal(true)}
              className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 flex justify-between items-center group cursor-pointer hover:bg-white hover:border-blue-500 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300"
            >
               <div className="flex items-center gap-6">
                 <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all"><Shield size={24} /></div>
                 <div>
                   <p className="font-black text-gray-800 text-base">Đổi mật khẩu định kỳ</p>
                   <p className="text-xs text-gray-400 font-medium italic">Bấm vào đây để cập nhật bảo mật mới</p>
                 </div>
               </div>
               <button className="p-3 bg-white rounded-xl text-gray-300 group-hover:text-[#0095FF] group-hover:translate-x-1 transition-all"><ChevronRight size={24} /></button>
            </div>
          </section>
        </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
               <button className="px-10 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Hủy bỏ</button>
               <button className="px-10 py-4 bg-[#0095FF] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all active:scale-95">LƯU THAY ĐỔI</button>
            </div>
          </div>
        </div>
      </div>
      {showPassModal && (
        <div className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white rounded-[40px] w-full max-w-[450px] shadow-2xl p-10 animate-in zoom-in duration-300">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">Đổi mật khẩu</h2>
                <button onClick={() => setShowPassModal(false)} className="p-2 bg-gray-50 rounded-full hover:text-red-500 transition-colors"><X size={20}/></button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-2">Mật khẩu hiện tại</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-2">Mật khẩu mới</label>
                  <input type="password" placeholder="Tối thiểu 8 ký tự..." className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold outline-none" />
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                <button onClick={() => setShowPassModal(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase text-xs tracking-widest">Hủy bỏ</button>
                <button 
                  onClick={() => setShowPassModal(false)}
                  className="flex-[2] py-4 bg-[#0095FF] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-600 active:scale-95 transition-all"
                >
                  CẬP NHẬT NGAY
                </button>
              </div>
           </div>
        </div>
      )}
    </StaffLayout>
  );
};

const SettingsTab = ({ icon: Icon, label, active }) => (
  <button className={`w-full flex items-center justify-between p-6 rounded-[28px] transition-all group ${active ? 'bg-[#0095FF] text-white shadow-xl shadow-blue-100' : 'bg-white border border-gray-100 text-gray-400 hover:border-blue-200'}`}>
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-white/20 shadow-inner' : 'bg-gray-50 text-gray-400 group-hover:text-[#0095FF]'}`}><Icon size={24} /></div>
      <span className="font-black text-xs uppercase tracking-[0.1em]">{label}</span>
    </div>
    <ChevronRight size={20} className={active ? 'opacity-40' : 'text-gray-200'} />
  </button>
);

const InputGroup = ({ label, value }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{label}</label>
    <input type="text" defaultValue={value} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-700 text-sm outline-none focus:bg-white focus:border-blue-200 transition-all" />
  </div>
);

export default Settings;