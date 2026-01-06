import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- 1. CONTEXT & AUTH ---
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// --- 2. LAYOUTS ---
import MainLayout from './layouts/Layout';      // Layout cho Manager (Admin)
import StaffLayout from './layouts/StaffLayout';   // Layout riêng cho Staff

// --- 3. PUBLIC PAGES ---
import Login from './pages/Login';
import Register from './pages/Register';

// --- 4. MANAGER PAGES ---
import ManagerDashboard from './pages/Dashboard'; 
import Employees from './pages/Employees';
import Inventory from './pages/Inventory';
import Vaccination from './pages/Vaccination';
import Pets from './pages/Pets';
import ManagerCustomers from './pages/Customers';

// --- 5. STAFF PAGES ---
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

          {/* ================== A. PUBLIC ================== */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ================== B. MANAGER ================== */}
          {/* Chỉ tài khoản role = "Quản lý" mới vào được khu /manager */}
          <Route element={<ProtectedRoute allowedRoles={['Quản lý']} />}>
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

          {/* ================== C. STAFF ================== */}
          {/* Khu /staff dùng chung cho 2 loại:
              - "Tiếp tân"
              - "Bán hàng"
              (tuỳ bạn, có thể cho "Quản lý" vào khu này luôn nếu muốn) */}
          <Route element={<ProtectedRoute allowedRoles={['Tiếp tân', 'Bán hàng']} />}>
            <Route path="/staff" element={<StaffLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />

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

          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
