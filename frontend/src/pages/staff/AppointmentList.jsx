import React, { useState } from 'react';
import { 
  Plus, Search, Calendar, ChevronDown, 
  MoreVertical, RotateCcw, Edit2, Trash2, X, User, PawPrint
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 1. Component thẻ trạng thái
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
        {count}
      </div>
      <span className="font-semibold text-gray-600 text-sm tracking-tight">{label}</span>
    </div>
  );
};

const AppointmentList = () => {
  const [showReschedule, setShowReschedule] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const navigate = useNavigate();

  const appointments = [
    { 
      id: 1, time: '09:00', day: 'Th 3', pet: 'Lucky', service: 'Khám bệnh', 
      owner: 'Nguyễn Văn An', phone: '0901234567', doctor: 'BS. Nguyễn Minh Tuấn',
      note: '"Khám định kỳ"', status: 'Đã đặt', color: 'blue' 
    },
    { 
      id: 2, time: '10:30', day: 'Th 3', pet: 'Bông', service: 'Tiêm phòng', 
      owner: 'Trần Thị Bình', phone: '0912345678', doctor: 'BS. Nguyễn Minh Tuấn',
      note: '"Tiêm phòng dại lần 2"', status: 'Đã đặt', color: 'emerald' 
    },
    { 
      id: 3, time: '14:00', day: 'Th 3', pet: 'Tom', service: 'Spa & Grooming', 
      owner: 'Lê Hoàng Cường', phone: '0923456789', doctor: '',
      note: '', status: 'Đang thực hiện', color: 'orange' 
    }
  ];

  const handleAction = (type, appt) => {
    setSelectedAppt(appt);
    setOpenMenuId(null);
    if (type === 'reschedule') setShowReschedule(true);
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Quản lý lịch hẹn</h1>
          <p className="text-sm text-gray-400 font-medium">Theo dõi lịch trình chi nhánh</p>
        </div>
        <button
          onClick={() => navigate('/staff/create-appointment')}
          className="bg-[#0095FF] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 shadow-md transition-all active:scale-95 text-sm"
        >
          <Plus size={18} />
          Tạo lịch hẹn
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ngày:</span>
            <div className="relative">
              <input
                type="date"
                defaultValue="2026-01-01"
                className="pl-3 pr-2 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Trạng thái:</span>
            <div className="relative">
              <select className="pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none appearance-none min-w-[140px]">
                <option>Tất cả</option>
                <option>Đã đặt</option>
                <option>Đang thực hiện</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          <div className="flex-1 relative min-w-[250px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm nhanh..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatusCard count={2} label="Đã đặt" color="blue" />
        <StatusCard count={1} label="Đang thực hiện" color="orange" />
        <StatusCard count={0} label="Hoàn thành" color="emerald" />
        <StatusCard count={0} label="Đã hủy" color="red" />
      </div>

      {/* Appointment List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="p-5 border-b border-gray-50 bg-gray-50/10">
          <h3 className="text-base font-bold text-gray-800">
            Danh sách lịch hẹn hôm nay ({appointments.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-50">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="p-5 flex items-center justify-between hover:bg-blue-50/10 transition-all group"
            >
              <div className="flex items-center gap-8">
                <div className="text-center w-16">
                  <p className="text-xl font-bold text-[#0095FF]">{appt.time}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {appt.day}
                  </p>
                </div>

                <div
                  className={`w-1 h-12 rounded-full ${
                    appt.color === 'blue'
                      ? 'bg-blue-500'
                      : appt.color === 'emerald'
                      ? 'bg-emerald-500'
                      : 'bg-orange-400'
                  }`}
                />

                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                    <PawPrint size={22} className="text-gray-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-gray-800">{appt.pet}</h4>
                      <span className="bg-gray-100 px-2 py-0.5 rounded-lg text-[9px] font-bold text-gray-500 uppercase">
                        {appt.service}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 mt-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                        <User size={12} /> {appt.owner}
                      </div>
                      <div className="text-xs text-gray-400 font-medium">{appt.phone}</div>
                      {appt.doctor && (
                        <div className="text-xs text-blue-500 font-semibold">{appt.doctor}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span
                  className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase ${
                    appt.status === 'Đang thực hiện'
                      ? 'bg-orange-50 text-orange-500'
                      : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  {appt.status}
                </span>
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === appt.id ? null : appt.id)
                    }
                    className="p-2 text-gray-300 hover:text-gray-600 transition-colors"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {openMenuId === appt.id && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 shadow-xl rounded-xl z-50 py-1">
                      <button
                        onClick={() => handleAction('reschedule', appt)}
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
          ))}
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
