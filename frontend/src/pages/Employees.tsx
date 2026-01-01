import React, { useState } from 'react';
import { MOCK_EMPLOYEES, BRANCHES, CURRENT_BRANCH_ID } from '../services/mockData';
import { NhanVien, ChiNhanh } from '../types';
import { Search, UserPlus, ArrowRightLeft, Star, Trash2 } from 'lucide-react';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<NhanVien[]>(MOCK_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Transfer Modal State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<NhanVien | null>(null);
  const [targetBranch, setTargetBranch] = useState<string>('');
  const [transferDate, setTransferDate] = useState<string>('');

  const handleTransferClick = (emp: NhanVien) => {
    setSelectedEmployee(emp);
    setIsTransferModalOpen(true);
  };

  const executeTransfer = () => {
    if (!selectedEmployee || !targetBranch || !transferDate) return;
    
    // In a real app, this sends a POST request to create a 'DieuDong' record
    // and updates the 'NhanVien' status or branch.
    alert(`Đã điều động nhân viên ${selectedEmployee.HoTen} sang chi nhánh ${BRANCHES.find(b => b.MaCN === targetBranch)?.TenCN} từ ngày ${transferDate}.`);
    
    // Optimistic UI update (simulate removing from current branch list)
    setEmployees(employees.filter(e => e.MaNV !== selectedEmployee.MaNV));
    setIsTransferModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Nhân sự</h1>
          <p className="text-gray-500">Danh sách nhân viên, hiệu suất và điều động</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <UserPlus size={18} />
          <span>Thêm nhân viên</span>
        </button>
      </div>

       <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Tìm nhân viên theo tên, mã hoặc chức vụ..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.filter(e => e.HoTen.toLowerCase().includes(searchTerm.toLowerCase())).map(emp => (
          <div key={emp.MaNV} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                  {emp.HoTen.charAt(0)}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  emp.TrangThai === 'DangLamViec' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {emp.TrangThai === 'DangLamViec' ? 'Đang làm việc' : emp.TrangThai}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800">{emp.HoTen}</h3>
              <p className="text-sm text-gray-500 mb-1">{emp.TenChucVu} • {emp.MaNV}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Hiệu suất (đơn/tháng):</span>
                  <span className="font-medium text-gray-800">{emp.HieuSuat?.SoDonHang}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Đánh giá trung bình:</span>
                  <span className="font-medium text-yellow-600 flex items-center">
                    {emp.HieuSuat?.DiemDanhGia} <Star size={12} className="ml-1 fill-current" />
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex space-x-2">
              <button 
                onClick={() => handleTransferClick(emp)}
                className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center justify-center space-x-1"
              >
                <ArrowRightLeft size={16} />
                <span>Điều động</span>
              </button>
              <button className="flex-1 bg-white border border-red-200 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-50 flex items-center justify-center space-x-1">
                 <Trash2 size={16} />
                 <span>Xóa</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Transfer Modal */}
      {isTransferModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Điều động nhân viên</h2>
            <p className="text-sm text-gray-600 mb-6">
              Bạn đang thực hiện điều động <span className="font-bold">{selectedEmployee.HoTen}</span> sang chi nhánh khác.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chi nhánh đến</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={targetBranch}
                  onChange={(e) => setTargetBranch(e.target.value)}
                >
                  <option value="">Chọn chi nhánh...</option>
                  {BRANCHES.filter(b => b.MaCN !== CURRENT_BRANCH_ID).map(b => (
                    <option key={b.MaCN} value={b.MaCN}>{b.TenCN}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu làm việc</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button 
                onClick={() => setIsTransferModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={executeTransfer}
                disabled={!targetBranch || !transferDate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Xác nhận điều động
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;