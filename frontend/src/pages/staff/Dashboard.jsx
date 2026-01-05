import React from 'react';
import StaffLayout from '../../layouts/StaffLayout';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { Plus, Search, RefreshCcw, Calendar, Users, PawPrint, DollarSign, MoreVertical } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <StaffLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#1E293B] flex items-center gap-3">
          Xin chào, Hoa! 👋
        </h1>
        <p className="text-gray-400 mt-2 font-medium">Đây là tổng quan hoạt động của chi nhánh hôm nay</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => navigate('/staff/create-appointment')}
            className="bg-[#0095FF] p-8 rounded-[32px] text-white shadow-lg shadow-blue-100 cursor-pointer hover:bg-blue-600 transition-all text-center flex flex-col items-center justify-center"
          >
            <div className="bg-white/20 p-2 rounded-lg mb-4"><Plus size={28} /></div>
            <h4 className="font-bold text-lg">Tạo lịch khám</h4>
            <p className="text-sm text-white/80 mt-1 font-medium">Đặt lịch khám trực tiếp</p>
          </div>
        <ActionSmallCard onClick={() => navigate('/staff/search')} icon={Search} title="Tra cứu thú cưng" subtitle="Tìm kiếm thông tin" />
        <ActionSmallCard onClick={() => navigate('/staff/appointments')} icon={RefreshCcw} title="Đổi lịch hẹn" subtitle="Thay đổi thời gian" />
        <ActionSmallCard onClick={() => navigate('/staff/appointments')} icon={Calendar} title="Lịch làm việc" subtitle="Xem lịch hôm nay" />
      </div>

      {/* Stats - Fix lại màu sắc theo đúng ảnh image_932a32.png */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        {/* Thẻ Lịch hẹn - Xanh dương đậm */}
        <div className="bg-gradient-to-br from-[#0095FF] to-[#54B6FF] p-8 rounded-[32px] text-white shadow-md relative overflow-hidden group h-40 flex flex-col justify-center">
          <div className="relative z-10">
            <p className="text-sm font-medium text-white/80">Lịch hẹn hôm nay</p>
            <h2 className="text-5xl font-bold mt-2 tracking-tighter">12</h2>
            <p className="text-sm mt-2 font-medium">3 đang chờ</p>
          </div>
          <div className="absolute top-8 right-8 bg-white/20 p-2 rounded-xl">
             <Calendar size={28} />
          </div>
        </div>
        
        <StatCard title="Khách hàng mới" value="5" sub="Tháng này: 42" trend="12% so với hôm qua" icon={Users} color="blue" />
        <StatCard title="Thú cưng khám" value="28" sub="Tuần này" trend="8% so với hôm qua" icon={PawPrint} color="cyan" />
        
        {/* Thẻ Doanh thu - Xanh lá */}
        <div className="bg-[#34B564] p-8 rounded-[32px] text-white shadow-lg shadow-emerald-100 relative overflow-hidden group h-40 flex flex-col justify-center">
          <div className="relative z-10">
            <p className="text-sm font-medium text-white/80">Doanh thu</p>
            <h2 className="text-5xl font-bold mt-2 tracking-tighter">15.2M</h2>
            <p className="text-sm mt-2 font-bold uppercase tracking-wider">VNĐ hôm nay</p>
          </div>
          <div className="absolute top-8 right-8 bg-white/20 p-2 rounded-xl">
             <DollarSign size={28} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold text-gray-800">Lịch hẹn hôm nay</h3>
            <Link 
            to="/staff/appointments" 
            className="text-[12px] font-bold text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
            >
            Xem tất cả →
            </Link>
          </div>
          <div className="space-y-10">
            <AppointmentItem time="09:00" pet="Lucky" service="Khám bệnh" owner="Nguyễn Văn An" breed="Golden Retriever" status="Đã đặt" color="#0095FF" />
            <AppointmentItem time="10:30" pet="Bông" service="Tiêm phòng" owner="Trần Thị Bình" breed="Poodle" status="Đã đặt" color="#22C55E" />
            <AppointmentItem time="14:00" pet="Tom" service="Spa & Grooming" owner="Lê Hoàng Cường" breed="Persian" status="Đang thực hiện" color="#A855F7" active />
          </div>
        </div>

        <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-10">Khách hàng gần đây</h3>
          <div className="space-y-10">
            <CustomerItem name="Nguyễn Văn An" tier="VIP" phone="0901234567" pets="2" points="245" color="blue" initials="N" />
            <CustomerItem name="Trần Thị Bình" tier="Thân thiết" phone="0912345678" pets="1" points="120" color="cyan" initials="T" />
            <CustomerItem name="Lê Hoàng Cường" tier="Cơ bản" phone="0923456789" pets="1" points="35" color="gray" initials="L" />
            <CustomerItem name="Phạm Thị Dung" tier="Thân thiết" phone="0934567890" pets="1" points="89" color="cyan" initials="P" />
          </div>
        </div>
      </div>
    </StaffLayout>
  );
};

// Component phụ
const ActionSmallCard = ({ icon: Icon, title, subtitle, onClick }) => (
  <div 
    onClick={onClick} // QUAN TRỌNG: Gắn onClick vào thẻ div thật ở đây
    className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center hover:border-blue-100 transition-all cursor-pointer group active:scale-95"
  >
    <div className="text-blue-500 mb-2 group-hover:scale-110 transition-transform">
      <Icon size={20} />
    </div>
    <h4 className="font-bold text-gray-800 text-sm">{title}</h4>
    <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{subtitle}</p>
  </div>
);

const StatCard = ({ title, value, sub, trend, icon: Icon, color }) => (
  <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group h-40 flex flex-col justify-center">
    <div className="relative z-10">
      <p className="text-sm font-medium text-gray-400">{title}</p>
      <h2 className="text-4xl font-bold mt-2 text-gray-800 tracking-tighter">{value}</h2>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-lg">↑ {trend}</span>
      </div>
    </div>
    <div className={`absolute top-8 right-8 p-3 rounded-2xl ${color === 'blue' ? 'bg-blue-50 text-blue-500' : 'bg-cyan-50 text-cyan-500'}`}>
      <Icon size={28} />
    </div>
  </div>
);

const AppointmentItem = ({ time, pet, service, owner, breed, status, color, active }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-8">
      <span className="text-[#0095FF] font-bold text-lg w-14">{time}</span>
      <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: color }} />
      <div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-gray-800 text-lg">{pet}</span>
          <span className="text-[11px] bg-gray-100 px-3 py-1 rounded-xl font-bold text-gray-500">{service}</span>
        </div>
        <div className="text-sm text-gray-400 mt-1 font-medium flex items-center gap-4">
          <span className="flex items-center gap-1.5"><Users size={14} /> {owner}</span>
          <span className="flex items-center gap-1.5"><PawPrint size={14} /> {breed}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <span className={`text-[12px] px-5 py-2 rounded-xl font-bold ${
        active ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'
      }`}>
        {status}
      </span>
      <button className="text-gray-300 hover:text-gray-600"><MoreVertical size={20} /></button>
    </div>
  </div>
);

const CustomerItem = ({ name, tier, phone, pets, points, color, initials }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg ${
        color === 'blue' ? 'bg-blue-50 text-blue-500' : 
        color === 'cyan' ? 'bg-cyan-50 text-cyan-500' : 'bg-gray-100 text-gray-500'
      }`}>
        {initials}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-800 text-[15px]">{name}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold border ${
            tier === 'VIP' ? 'bg-orange-50 border-orange-200 text-orange-500' : 
            tier === 'Thân thiết' ? 'bg-blue-50 border-blue-200 text-blue-500' : 'bg-gray-50 border-gray-200 text-gray-500'
          }`}>
            {tier === 'VIP' ? '👑 VIP' : tier === 'Thân thiết' ? '⭐ Thân thiết' : '👤 ' + tier}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1 font-medium">{phone} • {pets} thú cưng</p>
      </div>
    </div>
    <span className="text-blue-500 text-sm font-bold">{points} điểm</span>
  </div>
);

export default Dashboard;