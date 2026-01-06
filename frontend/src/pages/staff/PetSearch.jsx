import React, { useState } from 'react';
import { Search, PawPrint, User, Activity, Calendar, Hash } from 'lucide-react';

const PetSearch = () => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [searchQuery, setSearchQuery] = useState('Nguyễn Văn An');

  const petResults = [
    { id: 1, name: 'Lucky', breed: 'Golden Retriever', type: 'Chó', owner: 'Nguyễn Văn An', age: '3 tuổi', weight: '25kg', gender: 'Đực', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=100' },
    { id: 2, name: 'Miu', breed: 'British Shorthair', type: 'Mèo', owner: 'Nguyễn Văn An', age: '2 tuổi', weight: '4.5kg', gender: 'Cái', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100' },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tra cứu thú cưng</h1>
        <p className="text-sm text-gray-400 font-medium">Tìm kiếm thông tin thú cưng và xác định khách hàng mới/cũ</p>
      </div>

      {/* Thanh tìm kiếm chính */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nhập tên thú cưng hoặc tên chủ nuôi..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10"
          />
        </div>
        <button className="bg-[#0095FF] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-all">
          <Search size={18} /> Tìm kiếm
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Cột danh sách kết quả */}
        <div className="col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit">
          <div className="p-4 border-b border-gray-50 bg-gray-50/30">
            <h3 className="font-bold text-sm text-gray-700">Kết quả (2)</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {petResults.map((pet) => (
              <div 
                key={pet.id}
                onClick={() => setSelectedPet(pet)}
                className={`p-4 flex items-center gap-4 cursor-pointer transition-all ${selectedPet?.id === pet.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}
              >
                <img src={pet.image} alt={pet.name} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <p className="font-bold text-gray-800 text-sm">{pet.name}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{pet.type} • {pet.breed}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cột chi tiết */}
        <div className="col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[450px] flex items-center justify-center relative">
          {selectedPet ? (
            <div className="w-full p-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-start mb-8">
                <div className="flex gap-6">
                  <img src={selectedPet.image} alt="" className="w-24 h-24 rounded-3xl object-cover border-4 border-blue-50 shadow-sm" />
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">{selectedPet.name}</h2>
                    <p className="text-blue-500 font-bold mt-1 uppercase tracking-wider text-xs">{selectedPet.breed}</p>
                    <div className="flex gap-2 mt-3">
                      <span className="bg-gray-100 px-3 py-1 rounded-lg text-[10px] font-bold text-gray-500 flex items-center gap-1">
                        <User size={12} /> Chủ nuôi: {selectedPet.owner}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-100">Chỉnh sửa hồ sơ</button>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-8">
                <DetailBox label="Tuổi" value={selectedPet.age} icon={Calendar} color="blue" />
                <DetailBox label="Cân nặng" value={selectedPet.weight} icon={Activity} color="emerald" />
                <DetailBox label="Giới tính" value={selectedPet.gender} icon={PawPrint} color="orange" />
                <DetailBox label="Mã số" value="#PET0012" icon={Hash} color="purple" />
              </div>

              <div className="border-t border-gray-50 pt-6">
                <h4 className="font-bold text-gray-800 mb-4">Lịch sử khám bệnh gần đây</h4>
                <div className="bg-gray-50 rounded-xl p-4 text-center border border-dashed border-gray-200">
                  <p className="text-xs text-gray-400 font-medium italic">Chưa có dữ liệu khám bệnh trong 30 ngày qua</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-gray-50 p-6 rounded-full inline-block mb-4">
                <PawPrint size={48} className="text-gray-200" />
              </div>
              <p className="text-gray-400 font-bold text-sm">Chọn một thú cưng để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const DetailBox = ({ label, value, icon: Icon, color }) => (
  <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-2xl">
    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-center gap-2">
      <Icon size={14} className={`text-${color}-500`} />
      <span className="text-sm font-bold text-gray-700">{value}</span>
    </div>
  </div>
);

export default PetSearch;