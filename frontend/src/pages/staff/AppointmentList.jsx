import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, ChevronDown, MoreVertical, 
  RotateCcw, Edit2, Trash2, X, User, PawPrint, Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import receptionAPI from '../../api/receptionAPI';

// 1. ĐỊNH NGHĨA STATUS CARD (Phải nằm ngoài hoặc trước khi gọi trong AppointmentList)
const StatusCard = ({ count, label, color }) => {
  const styles = {
    blue: 'text-blue-500 bg-blue-50 border-blue-100',
    orange: 'text-orange-500 bg-orange-50 border-orange-100',
    emerald: 'text-emerald-500 bg-emerald-50 border-emerald-100',
    red: 'text-red-500 bg-red-50 border-red-100'
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border bg-white shadow-sm transition-transform hover:scale-[1.02]">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${styles[color]}`}>
        {count || 0}
      </div>
      <span className="font-semibold text-gray-600 text-sm tracking-tight">{label}</span>
    </div>
  );
};

const AppointmentList = () => {
  const navigate = useNavigate();
  
  // --- STATES DỮ LIỆU TỪ API ---
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ DangCho: 0, DaThanhToan: 0, HoanThanh: 0, DaHuy: 0 });
  const [loading, setLoading] = useState(false);

  // --- STATES BỘ LỌC ---
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]); 
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');

  // States UI
  const [showReschedule, setShowReschedule] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedAppt, setSelectedAppt] = useState(null);

  // Hàm lấy dữ liệu từ API
  const fetchData = async () => {
    setLoading(true);
    try {
      // Gọi API với các tham số lọc
      const response = await receptionAPI.getAppointmentBoard(filterDate, filterStatus, searchTerm);
      
      // Dữ liệu trả về từ service gồm stats và appointments
      console.log(response.appointments)
      setStats(response.stats); 
      setAppointments(response.appointments); 
    } catch (error) {
      console.error("Lỗi khi tải lịch hẹn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterDate, filterStatus, searchTerm]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Quản lý lịch hẹn</h1>
          <p className="text-sm text-gray-400 font-medium">Theo dõi lịch trình chi nhánh</p>
        </div>
        <button
          onClick={() => navigate('/staff/create-appointment')}
          className="bg-[#0095FF] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 shadow-md transition-all active:scale-95 text-sm"
        >
          <Plus size={18} /> Tạo lịch hẹn
        </button>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ngày:</span>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="pl-3 pr-2 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Trạng thái:</span>
            <div className="relative">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none appearance-none min-w-[140px]"
              >
                <option value="Tất cả">Tất cả</option>
                <option value="Đang chờ">Đang chờ</option>
                <option value="Đang thanh toán">Đang thanh toán</option>
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Hủy">Đã hủy</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="flex-1 relative min-w-[250px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Tìm theo tên khách hoặc thú cưng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Thống kê từ dữ liệu stats của Backend */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatusCard count={stats.DangCho} label="Đang chờ" color="blue" />
        <StatusCard count={stats.DaThanhToan} label="Đang thanh toán" color="orange" />
        <StatusCard count={stats.HoanThanh} label="Hoàn thành" color="emerald" />
        <StatusCard count={stats.DaHuy} label="Đã hủy" color="red" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6 min-h-[400px] relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
             <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        )}

        <div className="p-5 border-b border-gray-50 bg-gray-50/10">
          <h3 className="text-base font-bold text-gray-800">
            Danh sách lịch hẹn ({appointments.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-50">
          {appointments.length > 0 ? appointments.map((appt) => (
            <div key={appt.MaPhieuDV} className="p-5 flex items-center justify-between hover:bg-blue-50/10 transition-all group">
              <div className="flex items-center gap-8">
                <div className="text-center w-16">
                  <p className="text-xl font-bold text-[#0095FF]">{formatTime(appt.NgayDatDV)}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">HÔM NAY</p>
                </div>

                <div className={`w-1 h-12 rounded-full ${appt.TrangThai === 'Hoàn thành' ? 'bg-emerald-500' : 'bg-blue-500'}`} />

                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                    <PawPrint size={22} className="text-gray-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-gray-800">{appt.TenThuCung}</h4>
                      <span className="bg-gray-100 px-2 py-0.5 rounded-lg text-[9px] font-bold text-gray-500 uppercase">
                        {appt.TenDV}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 mt-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                        <User size={12} /> {appt.TenKH}
                      </div>
                      <div className="text-xs text-gray-400 font-medium">{appt.SdtKH}</div>
                      {appt.TenBS && (
                        <div className="text-xs text-blue-500 font-semibold">BS. {appt.TenBS}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase ${
                  appt.TrangThai === 'Hủy' ? 'bg-red-50 text-red-500' : 
                  appt.TrangThai === 'Hoàn thành' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-600'
                }`}>
                  {appt.TrangThai}
                </span>
                <div className="relative">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === appt.MaPhieuDV ? null : appt.MaPhieuDV)}
                    className="p-2 text-gray-300 hover:text-gray-600"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {/* Menu Action giữ nguyên logic UI của bạn */}
                  {openMenuId === appt.MaPhieuDV && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 shadow-xl rounded-xl z-[100] py-1">
                    <button
                      onClick={() => {
                        setSelectedAppt({
                          ...appt, 
                          pet: appt.TenThuCung, // Map lại tên để Modal hiển thị đúng
                          owner: appt.TenKH,
                          time: formatTime(appt.NgayDatDV)
                        });
                        setShowReschedule(true);
                        setOpenMenuId(null);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-[#0095FF]"
                    >
                      <RotateCcw size={14} /> Đổi lịch hẹn
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50">
                      <Edit2 size={14} /> Chỉnh sửa
                    </button>
                    <hr className="my-1 border-gray-50" />
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50">
                      <Trash2 size={14} /> Hủy lịch
                    </button>
                  </div>
                )}
                </div>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center text-gray-400 text-sm font-medium">
              Không có lịch hẹn nào phù hợp với bộ lọc.
            </div>
          )}
        </div>
      </div>

      {/* Modal Đổi lịch */}
      {showReschedule && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[380px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-50 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Đổi lịch hẹn</h3>
                <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">
                  {selectedAppt?.pet} - {selectedAppt?.owner}
                </p>
              </div>
              <button
                onClick={() => setShowReschedule(false)}
                className="text-gray-400 hover:text-gray-800 p-1 bg-gray-50 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">
                  Lịch hẹn hiện tại
                </p>
                <p className="font-bold text-gray-700 text-sm">
                  Thứ Ba, 31/12/2024 lúc {selectedAppt?.time}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">
                    Ngày mới
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500/10 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">
                    Giờ mới
                  </label>
                  <input
                    type="time"
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500/10 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50/50 flex gap-3 border-t border-gray-50">
              <button
                onClick={() => setShowReschedule(false)}
                className="flex-1 py-3 bg-white border border-gray-200 rounded-xl font-bold text-xs text-gray-500 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button className="flex-[1.5] py-3 bg-[#0095FF] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-600 shadow-md">
                <RotateCcw size={14} /> Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentList;
