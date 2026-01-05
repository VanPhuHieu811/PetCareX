import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 1. Context & Auth
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// 2. Public Pages
import Login from './pages/Login';
import Register from './pages/Register';

// 3. Layouts & Components
import Layout from './components/Layout';

// 4. Feature Pages (Manager & Staff)
import Dashboard from './pages/Dashboard';
import Vaccination from './pages/Vaccination';
import Inventory from './pages/Inventory';
import Employees from './pages/Employees';
import Pets from './pages/Pets';
import Customers from './pages/Customers';

// --- Component tạm cho Khách hàng (Bạn có thể tách ra file riêng sau) ---
const CustomerHome = () => {
  return (
    <div className="p-8">
        <h1 className="text-2xl font-bold text-blue-600">Xin chào Khách hàng!</h1>
        <p className="mt-2">Đây là trang dành riêng cho khách hàng (Xem lịch sử thú cưng, đặt lịch...)</p>
    </div>
  );
};

function App() {
    return (
        // Bọc toàn bộ ứng dụng trong AuthProvider để quản lý trạng thái đăng nhập
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* =========================================================
                        A. PUBLIC ROUTES (Ai cũng vào được)
                       ========================================================= */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Redirect trang chủ về login */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* =========================================================
                        B. MANAGER ROUTES (Chỉ Quản lý - Full Quyền)
                       ========================================================= */}
                    <Route element={<ProtectedRoute allowedRoles={['MANAGER']} />}>
                        <Route path="/manager" element={<Layout />}>
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="employees" element={<Employees />} />
                            <Route path="inventory" element={<Inventory />} />
                            <Route path="vaccination" element={<Vaccination />} />
                            <Route path="pets" element={<Pets />} />
                            <Route path="customers" element={<Customers />} />
                        </Route>
                    </Route>

                    {/* =========================================================
                        C. STAFF ROUTES (Nhân viên & Quản lý đều vào được)
                        Lưu ý: Staff bị hạn chế, không xem được Dashboard doanh thu
                       ========================================================= */}
                    <Route element={<ProtectedRoute allowedRoles={['MANAGER', 'STAFF']} />}>
                        <Route path="/staff" element={<Layout />}>
                            {/* Mặc định vào staff sẽ nhảy tới trang Thú cưng */}
                            <Route index element={<Navigate to="pets" replace />} />
                            
                            <Route path="pets" element={<Pets />} />
                            <Route path="vaccination" element={<Vaccination />} />
                            <Route path="inventory" element={<Inventory />} /> {/* Staff được xem kho để bán hàng */}
                            <Route path="customers" element={<Customers />} /> {/* Staff cần tra cứu khách hàng */}
                            
                            {/* Staff KHÔNG CÓ quyền vào: Dashboard, Employees */}
                        </Route>
                    </Route>

                    {/* =========================================================
                        D. CUSTOMER ROUTES (Dành cho khách hàng đăng ký online)
                       ========================================================= */}
                    <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
                        <Route path="/customer">
                            {/* Bạn có thể tạo Layout riêng cho Customer nếu muốn */}
                            <Route index element={<Navigate to="home" replace />} />
                            <Route path="home" element={<CustomerHome />} />
                            {/* Sau này thêm: <Route path="history" element={<MyPetHistory />} /> */}
                        </Route>
                    </Route>

                    {/* =========================================================
                        E. CATCH ALL (Trang 404 hoặc Redirect)
                       ========================================================= */}
                    <Route path="*" element={<Navigate to="/login" replace />} />

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;