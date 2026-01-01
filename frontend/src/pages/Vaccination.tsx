import React, { useState } from 'react';
import { MOCK_VACCINES } from '../services/mockData';
import { Search, Info, Activity, Plus, Edit, X, Save, Trash2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Vacxin } from '../types';

const Vaccination: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State quản lý danh sách vắc-xin (Local state simulation)
  const [vaccines, setVaccines] = useState<Vacxin[]>(MOCK_VACCINES);

  // State cho Modal thêm/sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVacxin, setCurrentVacxin] = useState<Vacxin>({
    MaVacXin: '',
    TenVacXin: '',
    NgaySanXuat: '',
    GiaVacXin: 0,
    TonKho: 0,
    LuotDat: 0
  });

  const filteredVaccines = vaccines.filter(v => 
    v.TenVacXin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.MaVacXin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mở modal để thêm mới
  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentVacxin({
      MaVacXin: '',
      TenVacXin: '',
      NgaySanXuat: '',
      GiaVacXin: 0,
      TonKho: 0,
      LuotDat: 0
    });
    setIsModalOpen(true);
  };

  // Mở modal để chỉnh sửa
  const handleEdit = (vx: Vacxin) => {
    setIsEditing(true);
    setCurrentVacxin({ ...vx });
    setIsModalOpen(true);
  };

  // Xóa vắc-xin
  const handleDelete = (maVacXin: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vắc-xin này không? Hành động này không thể hoàn tác.')) {
      setVaccines(vaccines.filter(v => v.MaVacXin !== maVacXin));
    }
  };

  // Lưu dữ liệu
  const handleSave = () => {
    if (!currentVacxin.MaVacXin || !currentVacxin.TenVacXin) {
      alert("Vui lòng nhập Mã và Tên vắc-xin");
      return;
    }

    if (isEditing) {
      // Cập nhật
      setVaccines(vaccines.map(v => v.MaVacXin === currentVacxin.MaVacXin ? currentVacxin : v));
      alert(`Đã cập nhật vắc-xin ${currentVacxin.MaVacXin}`);
    } else {
      // Thêm mới (Kiểm tra trùng mã)
      if (vaccines.find(v => v.MaVacXin === currentVacxin.MaVacXin)) {
        alert("Mã vắc-xin đã tồn tại!");
        return;
      }
      setVaccines([...vaccines, currentVacxin]);
      alert(`Đã thêm mới vắc-xin ${currentVacxin.TenVacXin}`);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Tiêm phòng</h1>
          <p className="text-gray-500">Tra cứu vắc-xin và thống kê lượt tiêm</p>
        </div>
        
        <div className="flex space-x-3">
            {/* Tab Switcher */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button 
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                    onClick={() => setActiveTab('list')}
                >
                    Danh mục
                </button>
                <button 
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'stats' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                    onClick={() => setActiveTab('stats')}
                >
                    Thống kê
                </button>
            </div>

            {/* Add Button */}
            {activeTab === 'list' && (
                <button 
                    onClick={handleAddNew}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    <span>Thêm Vắc-xin</span>
                </button>
            )}
        </div>
      </div>

      {activeTab === 'list' && (
        <div className="space-y-4">
           <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Tìm vắc-xin theo tên, mã hoặc loại..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Mã VX</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tên Vắc-xin</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Ngày SX</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Giá</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Tồn kho</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Đã tiêm (kỳ này)</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVaccines.map((vx) => (
                  <tr key={vx.MaVacXin} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{vx.MaVacXin}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">{vx.TenVacXin}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{vx.NgaySanXuat}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 text-right">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(vx.GiaVacXin)}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                        <span className={`font-bold ${vx.TonKho < 10 ? 'text-red-500' : 'text-gray-800'}`}>
                            {vx.TonKho}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">
                        {vx.LuotDat}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center flex justify-center space-x-3">
                        <button 
                            onClick={() => handleEdit(vx)}
                            className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                            title="Chỉnh sửa"
                        >
                            <Edit size={16} />
                        </button>
                        <button 
                            onClick={() => handleDelete(vx.MaVacXin)}
                            className="text-gray-500 hover:text-red-600 transition-colors p-1"
                            title="Xóa vắc-xin"
                        >
                            <Trash2 size={16} />
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredVaccines.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    Không tìm thấy vắc-xin nào phù hợp.
                </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Activity className="mr-2 text-blue-600" />
              Top Vắc-xin được đặt nhiều nhất
            </h3>
            <div className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vaccines} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="TenVacXin" width={150} tick={{fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="LuotDat" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={30} name="Số lượt tiêm" />
                  </BarChart>
               </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Info className="mr-2 text-blue-600" />
              Thú cưng đã tiêm trong kỳ
            </h3>
            <div className="overflow-y-auto h-80">
              <table className="w-full">
                <thead className="sticky top-0 bg-white border-b border-gray-100">
                  <tr>
                     <th className="text-left py-2 text-sm text-gray-500">Tên Thú Cưng</th>
                     <th className="text-left py-2 text-sm text-gray-500">Loại</th>
                     <th className="text-right py-2 text-sm text-gray-500">Tình trạng</th>
                  </tr>
                </thead>
                <tbody>
                  {[1,2,3,4,5,6].map((i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                      <td className="py-3 text-sm font-medium">Mimi (KH0{i})</td>
                      <td className="py-3 text-sm text-gray-600">Mèo</td>
                      <td className="py-3 text-sm text-right text-green-600">Hoàn thành</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Popup */}
      {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                  <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                      <h2 className="text-white font-bold text-lg">
                          {isEditing ? 'Cập nhật Vắc-xin' : 'Thêm Vắc-xin mới'}
                      </h2>
                      <button onClick={() => setIsModalOpen(false)} className="text-blue-100 hover:text-white">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Mã Vắc-xin</label>
                              <input 
                                  type="text"
                                  className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none ${isEditing ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'border-gray-300'}`}
                                  value={currentVacxin.MaVacXin}
                                  onChange={(e) => setCurrentVacxin({...currentVacxin, MaVacXin: e.target.value})}
                                  disabled={isEditing}
                                  placeholder="VX..."
                              />
                          </div>
                          <div className="col-span-1">
                               <label className="block text-sm font-medium text-gray-700 mb-1">Ngày Sản Xuất</label>
                              <input 
                                  type="date"
                                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                  value={currentVacxin.NgaySanXuat}
                                  onChange={(e) => setCurrentVacxin({...currentVacxin, NgaySanXuat: e.target.value})}
                              />
                          </div>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tên Vắc-xin</label>
                          <input 
                              type="text"
                              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                              value={currentVacxin.TenVacXin}
                              onChange={(e) => setCurrentVacxin({...currentVacxin, TenVacXin: e.target.value})}
                              placeholder="Nhập tên vắc-xin..."
                          />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Giá nhập/bán (VND)</label>
                              <input 
                                  type="number"
                                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                  value={currentVacxin.GiaVacXin}
                                  onChange={(e) => setCurrentVacxin({...currentVacxin, GiaVacXin: Number(e.target.value)})}
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho hiện tại</label>
                              <input 
                                  type="number"
                                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                  value={currentVacxin.TonKho}
                                  onChange={(e) => setCurrentVacxin({...currentVacxin, TonKho: Number(e.target.value)})}
                              />
                          </div>
                      </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-100">
                      <button 
                          onClick={() => setIsModalOpen(false)}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                      >
                          Hủy bỏ
                      </button>
                      <button 
                          onClick={handleSave}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2"
                      >
                          <Save size={16} />
                          <span>{isEditing ? 'Lưu thay đổi' : 'Thêm mới'}</span>
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Vaccination;