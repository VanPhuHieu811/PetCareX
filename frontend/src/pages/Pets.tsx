import React, { useState } from 'react';
import { MOCK_PETS } from '../services/mockData';
import { Search, FileText, Syringe, Clock } from 'lucide-react';

const Pets: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPets = MOCK_PETS.filter(p => 
    p.TenTC.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.TenChu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.MaKH.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
       <div>
          <h1 className="text-2xl font-bold text-gray-800">Hồ sơ Thú cưng</h1>
          <p className="text-gray-500">Tra cứu lịch sử khám và tình trạng tiêm chủng</p>
        </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative max-w-xl mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Nhập tên thú cưng, tên chủ hoặc mã khách hàng..." 
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {searchTerm && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPets.map(pet => (
              <div key={pet.MaTC} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{pet.TenTC}</h3>
                    <p className="text-sm text-gray-600">{pet.Loai} • {pet.Giong}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Chủ: {pet.TenChu}</p>
                    <p className="text-xs text-gray-500">{pet.MaKH}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border border-gray-100">
                    <h4 className="text-sm font-semibold text-blue-600 flex items-center mb-2">
                      <Clock size={16} className="mr-2" /> Lịch sử khám gần nhất
                    </h4>
                    {pet.LichSuKham.length > 0 ? (
                      <ul className="space-y-2">
                        {pet.LichSuKham.map((ls, idx) => (
                          <li key={idx} className="text-sm border-l-2 border-gray-200 pl-3">
                            <span className="text-gray-500 text-xs block">{ls.NgayKham}</span>
                            <span className="text-gray-800 font-medium">{ls.ChuanDoan}</span>
                            <span className="text-gray-400 text-xs block">BS. {ls.BacSi}</span>
                          </li>
                        ))}
                      </ul>
                    ) : <p className="text-sm text-gray-500">Chưa có lịch sử khám.</p>}
                  </div>

                  <div className="bg-white p-4 rounded border border-gray-100">
                    <h4 className="text-sm font-semibold text-green-600 flex items-center mb-2">
                      <Syringe size={16} className="mr-2" /> Tình trạng tiêm chủng
                    </h4>
                    <p className="text-sm text-gray-800">{pet.TinhTrangTiem || 'Chưa có thông tin'}</p>
                  </div>
                </div>
              </div>
            ))}
            {filteredPets.length === 0 && (
              <div className="col-span-2 text-center py-10 text-gray-500">
                Không tìm thấy thú cưng nào phù hợp.
              </div>
            )}
          </div>
        )}

        {!searchTerm && (
           <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
             <FileText size={48} className="mx-auto text-gray-300 mb-4" />
             <p className="text-gray-500">Nhập từ khóa để bắt đầu tra cứu hồ sơ bệnh án.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default Pets;