import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Search,
  Users,
  PawPrint,
  ShoppingCart,
  FileText,
  Settings,
  Bell,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import staffApi from "../api/staffApi"; 

// Thành phần từng mục trên Sidebar
const SidebarItem = ({ icon: Icon, label, path }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-200 ${
        isActive
          ? "bg-[#0095FF] text-white shadow-lg shadow-blue-100"
          : "text-gray-500 hover:bg-gray-50"
      }`}
    >
      <Icon size={20} />
      <span className="font-semibold text-[14px]">{label}</span>
    </Link>
  );
};

// Thành phần từng dòng thông báo trong Dropdown
const NotiItem = ({ title, desc, time, active }) => (
  <div
    className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
      active ? "bg-blue-50/30" : ""
    }`}
  >
    <div className="flex justify-between items-start mb-1">
      <h5 className="font-bold text-xs text-gray-800">{title}</h5>
      <span className="text-[9px] text-gray-400 font-medium">{time}</span>
    </div>
    <p className="text-[11px] text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

const StaffLayout = () => {
  const [showNoti, setShowNoti] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  
  // State lưu thông tin đầy đủ lấy từ API
  const [fullProfile, setFullProfile] = useState(null); 

  const { user } = useAuth(); // User này chỉ là bản lưu tạm lúc Login

  // 2. GỌI API LẤY INFO ĐẦY ĐỦ (Giống bên Settings)
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await staffApi.getMyProfile();
        if (res.success) {
          setFullProfile(res.data);
        }
      } catch (error) {
        console.error("Không tải được thông tin layout:", error);
      }
    };
    
    // Gọi ngay khi component mount
    fetchProfileData();
  }, []);

  // 3. XÁC ĐỊNH DỮ LIỆU HIỂN THỊ (Ưu tiên API > Context User)
  const activeUser = fullProfile || user; 

  const role = activeUser?.role || user?.role; 
  
  // Tên hiển thị
  const displayName = activeUser?.HoTen || activeUser?.name || "Nhân viên";
  
  // Chi nhánh hiển thị (Ưu tiên TenCN lấy từ API)
  const displayBranch = 
    activeUser?.TenCN || 
    activeUser?.TenChiNhanh || 
    activeUser?.BranchName || 
    (activeUser?.MaCN ? `Chi nhánh ${activeUser.MaCN}` : "Chi nhánh hệ thống");

  // Label hiển thị vai trò
  const roleLabel =
    role === "SALES" || role === "Bán hàng"
      ? "Bán hàng"
      : role === "RECEPTIONIST" || role === "Tiếp tân"
      ? "Tiếp tân"
      : "Nhân viên";

  // Nhóm menu theo role
  const receptionistMenu = [
    { icon: LayoutDashboard, label: "Tổng quan", path: "/staff/dashboard" },
    { icon: Calendar, label: "Lịch hẹn", path: "/staff/appointments" },
    { icon: Search, label: "Tra cứu thú cưng", path: "/staff/search" },
    { icon: Users, label: "Khách hàng", path: "/staff/customers" },
    { icon: PawPrint, label: "Thú cưng", path: "/staff/pets" },
  ];

  const salesMenu = [
    { icon: ShoppingCart, label: "Bán hàng", path: "/staff/pos" },
    { icon: FileText, label: "Hóa đơn", path: "/staff/invoices" },
  ];

  const commonMenu = [
    { icon: Settings, label: "Cài đặt", path: "/staff/settings" },
  ];

  let sidebarMenus = [];

  if (role === "Bán hàng" || role === "SALES") {
    sidebarMenus = [...salesMenu, ...commonMenu];
  } else if (role === "Tiếp tân" || role === "RECEPTIONIST") {
    sidebarMenus = [...receptionistMenu, ...commonMenu];
  } else {
    sidebarMenus = [...receptionistMenu, ...salesMenu, ...commonMenu];
  }

  // Cập nhật ngày tháng
  useEffect(() => {
    const date = new Date();
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const formattedDate = date.toLocaleDateString("vi-VN", options);
    setCurrentDate(
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
    );
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC] overflow-x-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col py-6 fixed h-full z-20">
        <div className="flex items-center gap-3 px-6 mb-10">
          <div className="bg-[#0095FF] p-2 rounded-xl text-white shadow-sm">
            <PawPrint size={22} fill="currentColor" />
          </div>
          <span className="text-2xl font-bold text-[#1E293B] tracking-tight">
            PetCareX
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {sidebarMenus.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
            />
          ))}
        </nav>

        {/* --- Thông tin nhân viên dưới Sidebar --- */}
        <div className="mt-auto border-t border-gray-100 pt-6 px-4">
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center font-bold text-blue-600 border-2 border-white">
              {displayName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm text-gray-800 truncate" title={displayName}>
                {displayName}
              </p>
              <p className="text-[11px] text-gray-400 font-medium truncate" title={displayBranch}>
                {roleLabel} • {displayBranch}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[260px] flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30 w-full">
          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng, thú cưng, lịch hẹn..."
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[11px] text-gray-500 font-bold bg-gray-50 px-4 py-2 rounded-xl uppercase tracking-wider">
              <Calendar size={16} /> {currentDate}
            </div>

            <div className="relative">
              <div
                onClick={() => setShowNoti(!showNoti)}
                className={`relative cursor-pointer p-2.5 rounded-xl transition-colors ${
                  showNoti
                    ? "bg-blue-50 text-blue-500"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  3
                </span>
              </div>

              {showNoti && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNoti(false)}
                  ></div>
                  <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                      <h4 className="font-bold text-sm text-gray-800">
                        Thông báo gần đây
                      </h4>
                      <button
                        onClick={() => setShowNoti(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      <NotiItem
                        title="Lịch hẹn mới"
                        desc="Lucky - Nguyễn Văn An vừa đặt lịch lúc 10:30 hôm nay."
                        time="5 phút trước"
                        active
                      />
                      <NotiItem
                        title="Thanh toán thành công"
                        desc="Hóa đơn #HD0123 đã được nhân viên thu ngân xác nhận."
                        time="12 phút trước"
                      />
                      <NotiItem
                        title="Nhắc nhở tiêm phòng"
                        desc="Thú cưng 'Bông' có lịch tiêm nhắc lại vào ngày mai."
                        time="1 giờ trước"
                      />
                    </div>
                    <div className="p-3 bg-gray-50/50 text-center border-t border-gray-50">
                      <button className="text-[11px] font-bold text-blue-500 hover:text-blue-700">
                        Xem tất cả thông báo
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Chi nhánh + Tên nhân viên hiển thị */}
            <div className="text-emerald-600 text-xs font-bold flex items-center gap-2 whitespace-nowrap">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shrink-0"></span>
              <span>{displayName}</span>
              <span className="text-gray-400">•</span>
              <span>{displayBranch}</span>
            </div>
          </div>
        </header>

        <div className="p-10 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StaffLayout;