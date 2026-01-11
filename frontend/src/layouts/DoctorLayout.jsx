import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
    PawPrint, 
    LogOut, 
    LayoutDashboard, 
    Settings, 
    ChevronLeft, 
    ChevronRight,
    Stethoscope
} from 'lucide-react';
import staffApi from '../api/staffApi';

// --- SIDEBAR COMPONENT ---
const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    // 1. Cấu hình Menu (Đã xóa Lịch làm việc & Đổi Icon)
    const menuItems = [
        { 
            name: 'Dashboard', 
            icon: LayoutDashboard, // Icon Dashboard
            path: '/doctor/dashboard' 
        },
        { 
            name: 'Cài đặt', 
            icon: Settings, // Icon Cài đặt
            path: '/doctor/settings' 
        },
    ];

    const navigate = useNavigate();
    const location = useLocation();

    // State lưu thông tin bác sĩ
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // Helper: Tạo Avatar từ tên (VD: Nguyen Van A -> NA)
    const getInitials = (name) => {
        if (!name) return "BS";
        const names = name.trim().split(" ");
        if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    };

    // Gọi API lấy thông tin Profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await staffApi.getMyProfile();
                if (res.success) {
                    setDoctorInfo(res.data);
                }
            } catch (error) {
                console.error("Lỗi lấy thông tin bác sĩ:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className={`transition-all duration-300 bg-[#3b71ca] min-h-screen text-white flex flex-col fixed left-0 top-0 shadow-lg z-50 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className={`p-6 ${isCollapsed ? 'px-4' : ''}`}>
                {/* --- LOGO SECTION --- */}
                <div className="flex items-center gap-3 mb-10 overflow-hidden whitespace-nowrap">
                    <div className="bg-[#0095FF] p-2 rounded-xl text-white shadow-sm flex-shrink-0">
                        <PawPrint size={22} fill="currentColor" />
                    </div>
                    {!isCollapsed && (
                        <div className="transition-opacity duration-300">
                            <h2 className="font-bold text-xl leading-tight text-white"> PetCareX </h2>
                            <p className="text-[10px] text-blue-100 uppercase tracking-widest opacity-80">
                                Doctor Portal
                            </p>
                        </div>
                    )}
                </div>

                {/* --- MENU NAVIGATION --- */}
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon; // Lấy component Icon
                        const isActive = location.pathname === item.path;

                        return (
                            <div
                                key={item.name}
                                onClick={() => navigate(item.path)}
                                className={`flex items-center rounded-xl cursor-pointer transition-all h-12 group
                                ${isCollapsed ? 'justify-center' : 'px-4 gap-4'}
                                ${isActive
                                    ? 'bg-white text-[#3b71ca] font-bold shadow-md'
                                    : 'text-blue-50 hover:bg-white/10 hover:text-white'
                                }`}
                                title={isCollapsed ? item.name : ''}
                            >
                                {/* Render Icon */}
                                <span className="shrink-0">
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                </span>

                                {!isCollapsed && (
                                    <span className="text-sm transition-opacity duration-300">
                                        {item.name}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* --- FOOTER USER INFO --- */}
            <div className="mt-auto p-4 space-y-3">
                <div
                    className={`bg-white/10 backdrop-blur-md rounded-2xl flex items-center border border-white/10 overflow-hidden transition-all ${isCollapsed ? 'p-2 justify-center' : 'p-3 gap-3'
                        }`}
                >
                    {/* Avatar Initials */}
                    <div className="w-9 h-9 bg-white text-[#3b71ca] rounded-full flex items-center justify-center text-xs font-black shrink-0 shadow-sm border-2 border-white/20">
                        {loading ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#3b71ca]"></div> : getInitials(doctorInfo?.HoTen)}
                    </div>
                    
                    {!isCollapsed && (
                        <div className="overflow-hidden transition-opacity duration-300 min-w-0">
                            <p className="text-xs font-bold truncate text-white">
                                {loading ? "Đang tải..." : (doctorInfo?.HoTen || "Bác sĩ")}
                            </p>
                            <div className="flex items-center gap-1 text-[10px] opacity-80 text-blue-100 uppercase">
                                <Stethoscope size={10} />
                                <span className="truncate">{loading ? "..." : (doctorInfo?.TenChucVu || "Bác sĩ thú y")}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Nút Đăng xuất */}
                <button
                    onClick={handleLogout}
                    className={`w-full font-bold cursor-pointer text-sm py-2.5 flex items-center gap-2 transition-all hover:bg-red-500/20 hover:text-red-100 rounded-xl text-blue-100/70
                    ${isCollapsed ? 'justify-center' : 'px-4'}`}
                    title="Đăng xuất"
                > 
                   <LogOut size={18} />
                   {!isCollapsed && <span>Đăng xuất</span>}
                </button>

                {/* Nút Thu gọn Sidebar */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full cursor-pointer opacity-50 hover:opacity-100 transition-opacity flex justify-center items-center py-1 text-white"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <div className="flex items-center text-xs font-bold uppercase tracking-widest gap-1"><ChevronLeft size={16}/> Thu gọn</div>}
                </button>
            </div>
        </div>
    );
};

// --- MAIN LAYOUT ---
const DoctorLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex bg-[#f4f7fe] min-h-screen antialiased font-sans">
            <Sidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            <div
                className={`flex-1 transition-all duration-300 flex flex-col ${isCollapsed ? 'ml-20' : 'ml-64'}`}
            >
                <Outlet />
            </div>
        </div>
    );
};

export default DoctorLayout;