import React, { useState } from 'react';
import StaffLayout from '../../layouts/StaffLayout';
import { 
  ArrowLeft, Search, UserPlus, PawPrint, Calendar, 
  Clock, Stethoscope, MapPin, CheckCircle2, User 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateAppointment = () => {
  const navigate = useNavigate();
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [customerFound, setCustomerFound] = useState(false);
  const [step, setStep] = useState(1); // 1: Thông tin khách, 2: Đặt lịch

  return (
    <StaffLayout>
      {/* Header điều hướng quay lại */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-white rounded-xl border border-gray-100 text-gray-400 hover:text-gray-800 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Tạo lịch khám trực tiếp</h1>
          <p className="text-sm text-gray-400 font-medium">Đặt lịch hẹn cho khách hàng đến trực tiếp</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 font-sans">
        {/* Cột trái: Form nhập liệu */}
        <div className="col-span-8 space-y-6">
          
          {/* PHẦN 1: THÔNG TIN KHÁCH HÀNG */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <User size={18} className="text-blue-500" /> Thông tin khách hàng
              </h3>
              {!isNewCustomer && (
                <button 
                  onClick={() => setIsNewCustomer(true)}
                  className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
                >
                  <UserPlus size={14} /> Khách hàng mới?
                </button>
              )}
            </div>

            {!isNewCustomer ? (
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm theo tên hoặc số điện thoại..." 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                  onChange={(e) => e.target.value === '0901234567' ? setCustomerFound(true) : setCustomerFound(false)}
                />
                {/* Kết quả tìm kiếm mẫu */}
                {customerFound && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-blue-500">A</div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">Nguyễn Văn An</p>
                        <p className="text-[11px] text-gray-500 font-medium">0901 234 567 • Khách hàng VIP</p>
                      </div>
                    </div>
                    <button className="text-[11px] font-bold text-blue-500 bg-white px-3 py-1.5 rounded-lg border border-blue-100">Chọn</button>
                  </div>
                )}
              </div>
            ) : (
              /* FORM KHÁCH HÀNG MỚI */
              <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Họ và tên *</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-medium" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Số điện thoại *</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-medium" />
                  </div>
                </div>
                {/* Thông tin thú cưng mới */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                  <h4 className="text-xs font-bold text-gray-600 flex items-center gap-2">
                    <PawPrint size={14} /> Thông tin thú cưng
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Tên thú cưng" className="bg-white border border-gray-100 rounded-lg px-3 py-2 text-sm" />
                    <select className="bg-white border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500">
                      <option>Loài (Chó, mèo...)</option>
                      <option>Chó</option>
                      <option>Mèo</option>
                    </select>
                  </div>
                </div>
                <button onClick={() => setIsNewCustomer(false)} className="text-[11px] text-gray-400 font-bold hover:text-gray-600">← Quay lại tìm kiếm</button>
              </div>
            )}
          </div>

          {/* PHẦN 2: CHI TIẾT ĐẶT LỊCH */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calendar size={18} className="text-blue-500" /> Chi tiết đặt lịch
            </h3>
            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Chọn dịch vụ</label>
                <div className="grid grid-cols-3 gap-3">
                  <ServiceType icon={Stethoscope} label="Khám bệnh" active />
                  <ServiceType icon={CheckCircle2} label="Tiêm phòng" />
                  <ServiceType icon={PawPrint} label="Gói tiêm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Ngày khám</label>
                  <input type="date" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700" defaultValue="2026-01-01" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Giờ khám</label>
                  <input type="time" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700" defaultValue="09:00" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Bác sĩ</label>
                  <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 appearance-none">
                    <option>BS. Nguyễn Minh Tuấn</option>
                    <option>BS. Trần Thị Bình</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Chi nhánh</label>
                  <div className="w-full bg-gray-100 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-500 flex items-center gap-2 cursor-not-allowed">
                    <MapPin size={14} /> Chi nhánh Quận 1 (Mặc định)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Tóm tắt lịch hẹn */}
        <div className="col-span-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-6">Tóm tắt lịch hẹn</h3>
            
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-50 rounded-2xl">
                <PawPrint size={40} className="text-gray-100 mb-2" />
                <p className="text-xs text-gray-300 font-bold italic">Chưa chọn thú cưng</p>
              </div>

              <div className="space-y-3">
                <SummaryRow label="Dịch vụ" value="Khám bệnh" />
                <SummaryRow label="Thời gian" value="09:00 • 01/01/2026" />
                <SummaryRow label="Bác sĩ" value="BS. Nguyễn Minh Tuấn" />
                <SummaryRow label="Tạm tính" value="150.000đ" />
              </div>

              <button 
                className="w-full py-4 bg-[#0095FF] text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all active:scale-95 disabled:bg-blue-200"
                disabled={!customerFound && !isNewCustomer}
              >
                XÁC NHẬN ĐẶT LỊCH
              </button>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
};

// Component phụ trợ
const ServiceType = ({ icon: Icon, label, active }) => (
  <button className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
    active ? 'bg-blue-50 border-blue-500 text-blue-500 shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200'
  }`}>
    <Icon size={20} />
    <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
  </button>
);

const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-xs">
    <span className="text-gray-400 font-medium">{label}:</span>
    <span className="text-gray-800 font-bold">{value}</span>
  </div>
);

export default CreateAppointment;