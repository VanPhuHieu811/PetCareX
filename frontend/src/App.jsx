import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/staff/Dashboard';
import AppointmentList from './pages/staff/AppointmentList';
import PetSearch from './pages/staff/PetSearch'; // Import mới
import CustomerManagement from './pages/staff/CustomerManagement'; // Import mới
import CreateAppointment from './pages/staff/CreateAppoinment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/staff/dashboard" />} />
        <Route path="/staff">
          <Route path="create-appointment" element={<CreateAppointment />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<AppointmentList />} />
          <Route path="search" element={<PetSearch />} /> {/* Đã kết nối */}
          <Route path="customers" element={<CustomerManagement />} /> {/* Đã kết nối */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;