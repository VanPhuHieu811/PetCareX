import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- 1. CONTEXT & AUTH ---
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// --- 2. LAYOUTS ---
import MainLayout from './layouts/Layout';      // Layout cho Manager (Admin)
import StaffLayout from './layouts/StaffLayout';   // Layout riêng cho Staff (Lấy từ hình 2 của bạn)

// --- 3. PUBLIC PAGES ---
import Login from './pages/Login';
import Register from './pages/Register';

// --- 4. MANAGER PAGES (Các file cũ nằm ngoài thư mục staff) ---
// Giả sử các file này nằm ở src/pages/
import ManagerDashboard from './pages/Dashboard'; 
import Employees from './pages/Employees';
import Inventory from './pages/Inventory';
import Vaccination from './pages/Vaccination';
import Pets from './pages/Pets';
import ManagerCustomers from './pages/Customers'; // Khách hàng (View quản lý)

// --- 5. STAFF / RECEPTIONIST PAGES (Các file trong hình 2: src/pages/staff/) ---
import StaffDashboard from './pages/staff/Dashboard'; 
import AppointmentList from './pages/staff/AppointmentList';
import CreateAppointment from './pages/staff/CreateAppointment';
import CustomerManagement from './pages/staff/CustomerManagement';
import PetSearch from './pages/staff/PetSearch';
import PetPOS from './pages/staff/PetPOS';
import Invoices from './pages/staff/Invoices';
import Settings from './pages/staff/Settings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* =========================================================
              A. PUBLIC ROUTES
             ========================================================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* =========================================================
              B. MANAGER ROUTES (Dành cho Quản lý)
              Sử dụng: MainLayout (Sidebar Admin)
             ========================================================= */}
          <Route element={<ProtectedRoute allowedRoles={['MANAGER']} />}>
            <Route path="/manager" element={<MainLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              
              <Route path="dashboard" element={<ManagerDashboard />} />
              <Route path="employees" element={<Employees />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="vaccination" element={<Vaccination />} />
              <Route path="pets" element={<Pets />} />
              <Route path="customers" element={<ManagerCustomers />} />
            </Route>
          </Route>

          {/* =========================================================
              C. STAFF / RECEPTIONIST ROUTES (Dành cho Tiếp tân)
              Sử dụng: StaffLayout (Sidebar Lễ tân - File trong hình 2)
             ========================================================= */}
          <Route element={<ProtectedRoute allowedRoles={['RECEPTIONIST']} />}>
            <Route path="/staff" element={<StaffLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />

              {/* Các chức năng lấy từ hình 2 của bạn */}
              <Route path="dashboard" element={<StaffDashboard />} />
              <Route path="appointments" element={<AppointmentList />} />
              <Route path="create-appointment" element={<CreateAppointment />} />
              <Route path="customers" element={<CustomerManagement />} />
              <Route path="search" element={<PetSearch />} />
              <Route path="pets" element={<PetSearch />} />
              <Route path="pos" element={<PetPOS />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="settings" element={<Settings />} />
              
            </Route>
          </Route>

          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;