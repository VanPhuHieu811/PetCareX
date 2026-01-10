import React, { useState, useEffect, useRef } from 'react';
import { Search, PawPrint, User, Activity, Calendar, Hash, Loader2, X, ChevronRight } from 'lucide-react';
import receptionAPI from '../../api/receptionAPI'; 
import * as petAPI from '../../api/petAPI'; 

const PetSearch = () => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [petResults, setPetResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [examHistory, setExamHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // --- STATES GỢI Ý ---
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  // 1. Logic gợi ý khi gõ (Debounce 500ms)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        try {
          const response = await receptionAPI.getCustomerDetails(searchQuery);
          // Lọc trùng chủ nuôi để hiện trong danh sách gợi ý
          const uniqueOwners = Array.from(
            new Map(response.data.map(item => [item.sdt, item])).values()
          );
          setSuggestions(uniqueOwners);
          setShowSuggestions(true);
        } catch (error) { setSuggestions([]); }
      } else { setShowSuggestions(false); }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // 2. Tìm kiếm và hiển thị TOÀN BỘ thú cưng
  const handleSearch = async (e, manualQuery = null) => {
    if (e) e.preventDefault();
    const query = manualQuery || searchQuery;
    if (!query.trim()) return;

    setIsLoading(true);
    setShowSuggestions(false);
    try {
      const response = await receptionAPI.getCustomerDetails(query);
      
      // Map từng dòng (mỗi dòng là một pet riêng biệt) từ SQL trả về
      const pets = response.data.map(item => ({
        id: item.MaTC, // Quan trọng: Trùng với MaTC trong SQL để hết lỗi undefined
        name: item.TenTC || 'Chưa đặt tên',
        breed: item.TenGiong || 'Không rõ giống',
        type: item.TenLoaiTC,
        owner: item.HoTen,
        age: item.NgaySinh ? calculateAge(item.NgaySinh) : 'N/A',
        weight: item.CanNang || 'Đang cập nhật',
        gender: item.GioiTinh || 'Không rõ',
        image: item.TenLoaiTC === 'Mèo' 
          ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100' 
          : 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=100'
      })).filter(p => p.id); // Chỉ lấy những dòng có thú cưng

      setPetResults(pets);
      if (pets.length > 0) setSelectedPet(pets[0]);
    } catch (error) {
      setPetResults([]);
      setSelectedPet(null);
    } finally { setIsLoading(false); }
  };

  const calculateAge = (birthDate) => {
    const years = new Date().getFullYear() - new Date(birthDate).getFullYear();
    return years > 0 ? `${years} tuổi` : 'Dưới 1 tuổi';
  };

  // Đóng gợi ý khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tra cứu thú cưng</h1>
        <p className="text-sm text-gray-400 font-medium">Tìm kiếm thông tin và lịch sử bệnh án thú cưng</p>
      </div>

      {/* SEARCH BAR CÓ GỢI Ý */}
      <div className="relative mb-6" ref={dropdownRef}>
        <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập tên pet hoặc SĐT chủ..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none"
            />
          </div>
          <button type="submit" disabled={isLoading} className="bg-[#0095FF] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2">
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />} Tìm kiếm
          </button>
        </form>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] overflow-hidden">
            {suggestions.map((owner, idx) => (
              <div key={idx} onClick={() => { setSearchQuery(owner.sdt); handleSearch(null, owner.sdt); }} className="px-6 py-4 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b last:border-none">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500"><User size={20} /></div>
                  <div><p className="text-sm font-bold text-gray-800">{owner.HoTen}</p><p className="text-[11px] text-gray-400">{owner.sdt}</p></div>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* KẾT QUẢ DANH SÁCH (SẼ HIỆN NHIỀU PET) */}
        <div className="col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit">
          <div className="p-4 border-b bg-gray-50/30">
            <h3 className="font-bold text-sm text-gray-700">Kết quả tìm thấy ({petResults.length})</h3>
          </div>
          <div className="divide-y max-h-[500px] overflow-y-auto">
            {petResults.map((pet) => (
              <div key={pet.id} onClick={() => setSelectedPet(pet)} className={`p-4 flex items-center gap-4 cursor-pointer ${selectedPet?.id === pet.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}>
                <img src={pet.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <p className="font-bold text-gray-800 text-sm">{pet.name}</p>
                  <p className="text-[11px] text-gray-400 font-medium">{pet.type} • {pet.breed}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHI TIẾT THÚ CƯNG */}
        <div className="col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[450px] relative">
          {selectedPet ? (
            <div className="w-full p-8 animate-in fade-in duration-300">
              <div className="flex justify-between items-start mb-8">
                <div className="flex gap-6">
                  <img src={selectedPet.image} alt="" className="w-24 h-24 rounded-3xl object-cover border-4 border-blue-50 shadow-sm" />
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">{selectedPet.name}</h2>
                    <p className="text-blue-500 font-bold mt-1 uppercase text-xs">{selectedPet.breed}</p>
                    <div className="mt-3">
                      <span className="bg-gray-100 px-3 py-1 rounded-lg text-[10px] font-bold text-gray-500 flex items-center gap-1 w-fit"><User size={12} /> Chủ nuôi: {selectedPet.owner}</span>
                    </div>
                  </div>
                </div>
                <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors">Chỉnh sửa hồ sơ</button>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-8">
                <DetailBox label="Tuổi" value={selectedPet.age} icon={Calendar} color="blue" />
                <DetailBox label="Cân nặng" value={selectedPet.weight} icon={Activity} color="emerald" />
                <DetailBox label="Giới tính" value={selectedPet.gender} icon={PawPrint} color="orange" />
                <DetailBox label="Mã số" value={`${selectedPet.id}`} icon={Hash} color="purple" />
              </div>

              <div className="border-t pt-6">
                <h4 className="font-bold text-gray-800 mb-4">Lịch sử khám bệnh gần đây</h4>
                {/* Logic render lịch sử khám bệnh giữ nguyên */}
              </div>
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-gray-400">
               <PawPrint size={48} className="mb-2 opacity-10" />
               <p className="font-bold text-sm">Chọn một thú cưng từ danh sách bên trái</p>
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