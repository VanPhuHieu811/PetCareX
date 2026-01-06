import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import PetDetail from './pages/PetDetail';
import ClinicalExam from './pages/ClinicalExam';
import Vaccination from './pages/Vaccination';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex bg-[#f4f7fe] min-h-screen antialiased font-sans">
        <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
        
        <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pet/:id" element={<PetDetail />} />
            <Route path="/exam/:petId" element={<ClinicalExam />} />
            <Route path="/vaccination/:petId" element={<Vaccination />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;