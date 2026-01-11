import React, { useState, useEffect } from "react";
import {
  User, Bell, Shield, LogOut, ChevronRight, Camera, Key, X, Loader2
} from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // Giả sử bạn có context này
import { useNavigate } from "react-router-dom";
import staffApi from "../../api/staffApi"; // Import service mới tạo
import toast, { Toaster } from "react-hot-toast"; // Thư viện thông báo
import { format } from "date-fns"; // Thư viện format ngày (nếu chưa có: npm i date-fns)

const Settings = () => {
  const [showPassModal, setShowPassModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State lưu dữ liệu form
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    HoTen: "",
    SDT: "",
    CCCD: "",
    GioiTinh: "Nam",
    NgaySinh: "",
  });

  const { logout } = useAuth();
  const navigate = useNavigate();

  // 1. Lấy dữ liệu khi vào trang
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await staffApi.getMyProfile();
        
        // Vì client.js của bạn trả về json trực tiếp (handle function)
        // Backend trả về: { success: true, data: {...} }
        if (res.success) {
          const data = res.data;
          setProfile(data);
          
          // Map dữ liệu vào form
          setFormData({
            HoTen: data.HoTen || "",
            SDT: data.SDT || "",
            CCCD: data.CCCD || "",
            GioiTinh: data.GioiTinh || "Nam",
            // Xử lý ngày tháng an toàn
            NgaySinh: data.NgaySinh ? data.NgaySinh.split('T')[0] : "", 
          });
        }
      } catch (error) {
        // client.js ném Error(message), ta lấy message đó hiển thị
        toast.error(error.message || "Không thể tải thông tin cá nhân");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 2. Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. Gửi cập nhật lên Server
  const handleUpdate = async () => {
    try {
      setSaving(true);
      const res = await staffApi.updateMyProfile(formData);
      
      if (res.success) {
        toast.success("Cập nhật hồ sơ thành công!");
        // Cập nhật lại UI hiển thị gốc ngay lập tức
        setProfile({ ...profile, ...formData }); 
      }
    } catch (error) {
      toast.error(error.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  // 4. Xử lý Logout
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // Helper: Lấy 2 chữ cái đầu tên
  const getInitials = (name) => {
    if (!name) return "NV";
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      
      {/* --- HEADER --- */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">
          Cài đặt hệ thống
        </h1>
        <p className="md:text-sm text-gray-400 font-semibold mt-2">
          Cá nhân hóa trải nghiệm làm việc
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* --- LEFT MENU --- */}
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

        {/* --- RIGHT CONTENT --- */}
        <div className="lg:col-span-8 bg-white rounded-[28px] border border-gray-100 p-6 md:p-8 shadow-sm">
          
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 mb-8">
            <div className="relative">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-[24px] bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-black border-4 md:border-8 border-white shadow-lg select-none">
                {getInitials(profile?.HoTen)}
              </div>
              <button className="absolute -bottom-2 -right-2 p-2.5 md:p-3 bg-[#0095FF] text-white rounded-2xl shadow-md border-2 md:border-4 border-white transition-transform hover:scale-110 active:scale-95">
                <Camera size={18} />
              </button>
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-black text-gray-800">
                {profile?.HoTen || "Nhân viên"}
              </h2>
              <p className="text-gray-400 font-semibold md:text-sm mt-2">
                {profile?.TenChucVu || "Chức vụ"} • {profile?.TenCN || "Chi nhánh"}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.18em] ${
                    profile?.TrangThaiTaiKhoan === 'Hoạt động' ? 'bg-blue-50 text-blue-500' : 'bg-red-50 text-red-500'
                }`}>
                  {profile?.TrangThaiTaiKhoan || "Unknown"}
                </span>
                <span className="bg-gray-50 text-gray-400 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.18em] flex items-center gap-2">
                  <Key size={12} /> ID: #{profile?.MaND}
                </span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="space-y-8">
            
            {/* 1. Basic Info */}
            <section className="space-y-4">
              <h3 className="text-[20px] font-bold border-l-4 border-blue-500 pl-3">
                Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <InputGroup 
                    label="Họ và tên" 
                    name="HoTen"
                    value={formData.HoTen} 
                    onChange={handleInputChange}
                />
                <InputGroup 
                    label="Email" 
                    value={profile?.Email || ""} 
                    disabled // Read-only
                />
                <InputGroup 
                    label="Số điện thoại" 
                    name="SDT"
                    value={formData.SDT} 
                    onChange={handleInputChange}
                />
                <InputGroup 
                    label="Ngày vào làm" 
                    value={profile?.NgayVaoLam ? format(new Date(profile.NgayVaoLam), 'dd/MM/yyyy') : ''} 
                    disabled // Read-only
                />
                <InputGroup 
                    label="CCCD" 
                    name="CCCD"
                    value={formData.CCCD} 
                    onChange={handleInputChange}
                />
                <div className="space-y-2">
                  <label className="text-[16px] font-medium ml-1">Giới tính</label>
                  <select
                    name="GioiTinh"
                    value={formData.GioiTinh}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 font-semibold text-gray-700 text-sm outline-none focus:bg-white focus:border-blue-200 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>
            </section>

            {/* 2. Security */}
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

            {/* 3. Action Buttons */}
            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 md:gap-4">
              <button 
                className="cursor-pointer px-6 md:px-8 py-3 bg-gray-100 text-gray-400 rounded-2xl font-bold text-[16px] transition-all hover:bg-gray-200"
                onClick={() => window.location.reload()} // Reset đơn giản
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleUpdate}
                disabled={saving}
                className="cursor-pointer px-6 md:px-8 py-3 bg-[#0095FF] text-white rounded-2xl font-bold text-[16px] hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving && <Loader2 className="animate-spin" size={18} />}
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal đổi mật khẩu */}
      {showPassModal && (
        <PasswordModal onClose={() => setShowPassModal(false)} />
      )}
    </>
  );
};

// --- Sub Components ---

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
    <ChevronRight size={18} className={active ? "" : "text-gray-500"} />
  </button>
);

const InputGroup = ({ label, name, value, onChange, disabled = false }) => (
  <div className="space-y-2">
    <label className="text-[16px] font-medium ml-1">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 font-semibold text-gray-700 text-sm outline-none transition-all ${
          disabled 
            ? 'opacity-60 cursor-not-allowed text-gray-500' 
            : 'focus:bg-white focus:border-blue-200'
      }`}
    />
  </div>
);

// Password Modal (UI only for now)
const PasswordModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
        <div className="bg-white rounded-[28px] md:rounded-[32px] w-full max-w-[420px] shadow-2xl p-6 md:p-8 animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">Đổi mật khẩu</h2>
            <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:text-red-500 transition-colors">
            <X size={18} />
            </button>
        </div>
        <div className="space-y-5 md:space-y-6">
            <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block ml-1">Mật khẩu hiện tại</label>
            <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 font-bold outline-none text-sm" />
            </div>
            <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block ml-1">Mật khẩu mới</label>
            <input type="password" placeholder="Tối thiểu 8 ký tự..." className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 font-bold outline-none text-sm" />
            </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3 mt-8">
            <button onClick={onClose} className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-2xl font-bold uppercase text-[11px] tracking-[0.18em]">Hủy bỏ</button>
            <button onClick={onClose} className="flex-[1.4] py-3 bg-[#0095FF] text-white rounded-2xl font-bold uppercase text-[11px] tracking-[0.18em] shadow-lg shadow-blue-100 hover:bg-blue-600 active:scale-95 transition-all">Cập nhật ngay</button>
        </div>
        </div>
    </div>
);

export default Settings;