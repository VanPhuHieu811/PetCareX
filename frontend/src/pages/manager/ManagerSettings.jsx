import React, { useState } from "react";
import {
  User,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Camera,
  Key,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ManagerSettings = () => {
  const [showPassModal, setShowPassModal] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">
          Cài đặt hệ thống
        </h1>
        <p className="md:text-sm text-gray-400 font-semibold mt-2">
          Cá nhân hóa trải nghiệm làm việc
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Cột trái: Menu cài đặt */}
        <div className="lg:col-span-4 space-y-4">
          <SettingsTab icon={User} label="Thông tin cá nhân" active />

          <hr className="border-gray-100 my-6" />

          <button
            onClick={handleLogout}
            className="cursor-pointer border-[1px] bg-white w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-[20px] group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
              <LogOut size={18} />
            </div>
            <span>Đăng xuất tài khoản</span>
          </button>
        </div>

        {/* Cột phải: Nội dung chi tiết */}
        <div className="lg:col-span-8 bg-white rounded-[28px] border border-gray-100 p-6 md:p-8 shadow-sm">
          {/* Thông tin nhân viên */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 mb-8">
            <div className="relative">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-[24px] bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-black border-4 md:border-8 border-white shadow-lg">
                TH
              </div>
              <button className="absolute -bottom-2 -right-2 p-2.5 md:p-3 bg-[#0095FF] text-white rounded-2xl shadow-md border-2 md:border-4 border-white transition-transform hover:scale-110 active:scale-95">
                <Camera size={18} />
              </button>
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-black text-gray-800">
                Trần Thị Hoa
              </h2>
              <p className="text-gray-400 font-semibold md:text-sm mt-2">
                Lễ tân trưởng • Chi nhánh Quận 1
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                <span className="bg-blue-50 text-blue-500 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.18em]">
                  Active
                </span>
                <span className="bg-gray-50 text-gray-400 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.18em] flex items-center gap-2">
                  <Key size={12} /> ID: #ST-9920
                </span>
              </div>
            </div>
          </div>

          {/* Nội dung chính */}
          <div className="space-y-8">
            {/* Thông tin cơ bản */}
            <section className="space-y-4">
              <h3 className="text-[20px] font-bold border-l-4 border-blue-500 pl-3">
                Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <InputGroup label="Họ và tên" value="Trần Thị Hoa" />
                <InputGroup label="Email" value="hoatran.petcarex@gmail.com" />
                <InputGroup label="Số điện thoại" value="0901 234 567" />
                <InputGroup label="Ngày vào làm" value="01/10/2023" />
              </div>
            </section>

            {/* Bảo mật tài khoản */}
            <section className="space-y-4">
              <h3 className="text-[20px] font-bold border-l-4 border-blue-500 pl-3">
                Bảo mật tài khoản
              </h3>

              <div
                onClick={() => setShowPassModal(true)}
                className="bg-gray-50 p-6 md:p-7 rounded-3xl border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 group cursor-pointer hover:bg-white hover:border-blue-500 hover:shadow-lg hover:shadow-blue-50/60 transition-all duration-300"
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <Shield size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm md:text-base">
                      Đổi mật khẩu định kỳ
                    </p>
                    <p className="text-[16px] text-gray-500 mt-1">
                      Bấm vào đây để cập nhật bảo mật mới
                    </p>
                  </div>
                </div>
                <button className="self-end md:self-auto p-2.5 bg-white rounded-xl text-gray-300 group-hover:text-[#0095FF] group-hover:translate-x-1 transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </section>

            {/* Nút lưu / hủy */}
            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 md:gap-4">
              <button className="cursor-pointer px-6 md:px-8 py-3 bg-gray-100 text-gray-400 rounded-2xl font-bold text-[16px] transition-all hover:bg-gray-200">
                Hủy bỏ
              </button>
              <button className="cursor-pointer px-6 md:px-8 py-3 bg-[#0095FF] text-white rounded-2xl font-bold text-[16px] hover:bg-blue-600 active:scale-95 transition-all">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal đổi mật khẩu */}
      {showPassModal && (
        <div className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[28px] md:rounded-[32px] w-full max-w-[420px] shadow-2xl p-6 md:p-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">
                Đổi mật khẩu
              </h2>
              <button
                onClick={() => setShowPassModal(false)}
                className="p-2 bg-gray-50 rounded-full hover:text-red-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 md:space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block ml-1">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block ml-1">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  placeholder="Tối thiểu 8 ký tự..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 font-bold outline-none text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 mt-8">
              <button
                onClick={() => setShowPassModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-2xl font-bold uppercase text-[11px] tracking-[0.18em]"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => setShowPassModal(false)}
                className="flex-[1.4] py-3 bg-[#0095FF] text-white rounded-2xl font-bold uppercase text-[11px] tracking-[0.18em] shadow-lg shadow-blue-100 hover:bg-blue-600 active:scale-95 transition-all"
              >
                Cập nhật ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SettingsTab = ({ icon: Icon, label, active }) => (
  <button
    className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all group ${
      active
        ? "bg-[#0095FF] text-white"
        : "cursor-pointer bg-white border border-gray-200 text-gray-500 hover:border-blue-500"
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          active
            ? "bg-white/15"
            : "bg-gray-50 text-gray-400 group-hover:text-[#0095FF]"
        }`}
      >
        <Icon size={20} />
      </div>
      <span className="font-medium text-[16px]">
        {label}
      </span>
    </div>
    <ChevronRight
      size={18}
      className={active ? "" : "text-gray-500"}
    />
  </button>
);

const InputGroup = ({ label, value }) => (
  <div className="space-y-2">
    <label className="text-[16px] font-medium ml-1">
      {label}
    </label>
    <input
      type="text"
      defaultValue={value}
      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 font-semibold text-gray-700 text-sm outline-none focus:bg-white focus:border-blue-200 transition-all"
    />
  </div>
);

export default ManagerSettings;