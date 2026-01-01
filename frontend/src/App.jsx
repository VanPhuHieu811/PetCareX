import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import các trang đã thiết kế
import Dashboard from './pages/staff/Dashboard';
import AppointmentList from './pages/staff/AppointmentList';
import PetSearch from './pages/staff/PetSearch';
import CustomerManagement from './pages/staff/CustomerManagement';
import CreateAppointment from './pages/staff/CreateAppointment';
import PetPOS from './pages/staff/PetPOS';

function App() {
  return (
    <Router>
      <Routes>
        {/* Mặc định khi vào trang web sẽ chuyển hướng thẳng tới Dashboard của nhân viên */}
        <Route path="/" element={<Navigate to="/staff/dashboard" />} />

        {/* Nhóm các đường dẫn dành cho nhân viên (Staff) */}
        <Route path="/staff">
          {/* Tổng quan - Thống kê nhanh */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Lịch hẹn - Quản lý, đổi lịch, hủy lịch */}
          <Route path="appointments" element={<AppointmentList />} />

          {/* Quy trình đặt lịch trực tiếp tại quầy */}
          <Route path="create-appointment" element={<CreateAppointment />} />

          {/* Tra cứu - Tìm hồ sơ thú cưng/chủ nuôi */}
          <Route path="search" element={<PetSearch />} />

          {/* Khách hàng - Danh sách hội viên VIP/Thân thiết */}
          <Route path="customers" element={<CustomerManagement />} />

          {/* Phân hệ bán hàng: POS (Chọn sản phẩm, in hóa đơn) */}
          <Route path="pos" element={<PetPOS />} />

          {/* Các trang đang phát triển (Tạm thời trỏ về Dashboard) */}
          <Route path="pets" element={<PetSearch />} />
          <Route path="invoices" element={<PetPOS />} />
          <Route path="settings" element={<Dashboard />} />
        </Route>

        {/* Trang lỗi 404 (Nếu người dùng nhập sai địa chỉ) */}
        <Route path="*" element={<Navigate to="/staff/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;