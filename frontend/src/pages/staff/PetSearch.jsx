import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, PawPrint, User, Activity, Calendar, 
  Hash, Loader2, X, ChevronRight, ClipboardList 
} from 'lucide-react';
import receptionAPI from '../../api/receptionAPI'; 
import { useNavigate } from 'react-router-dom';

const PetSearch = () => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [petResults, setPetResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [examHistory, setExamHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const navigate = useNavigate();

  // --- STATES GỢI Ý ---
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  // 1. Logic Gợi ý tìm kiếm (Debounce 500ms)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        try {
          const response = await receptionAPI.getCustomerDetails(searchQuery);
          // Lọc trùng chủ nuôi để hiển thị trong gợi ý
          const uniqueOwners = Array.from(
            new Map(response.data.map(item => [item.sdt, item])).values()
          );
          setSuggestions(uniqueOwners);
          setShowSuggestions(true);
        } catch (error) {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // 2. Hàm tìm kiếm (Xử lý .trim() MaTC để tránh lỗi 404 và hiển thị đủ pet)
  const handleSearch = async (e, manualQuery = null) => {
    if (e) e.preventDefault();
    const query = manualQuery || searchQuery;
    if (!query.trim()) return;

    setIsLoading(true);
    setShowSuggestions(false);
    try {
      const response = await receptionAPI.getCustomerDetails(query);
      
      // Map từng dòng từ SQL. Mỗi dòng là một thú cưng riêng biệt
      const pets = response.data.map(item => ({
        id: item.MaTC?.toString().trim(), // TRIM để xóa khoảng trắng thừa
        maTC: item.MaTC?.toString().trim(),
        name: item.TenTC || 'Chưa đặt tên',
        breed: item.TenGiong || 'Không rõ giống',
        type: item.TenLoaiTC,
        owner: item.HoTen,
        age: item.NgaySinh ? calculateAge(item.NgaySinh) : 'N/A',
        weight: item.CanNang || '---',
        gender: item.GioiTinh || 'Không rõ',
        image: item.TenLoaiTC === 'Mèo' 
          ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100' 
          : 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=100'
      })).filter(p => p.id); // Chỉ lấy những dòng thực sự có thú cưng

      setPetResults(pets);
      // Tự động chọn thú cưng đầu tiên nếu tìm thấy
      if (pets.length > 0) setSelectedPet(pets[0]);
      else setSelectedPet(null);

    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      setPetResults([]);
      setSelectedPet(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Lấy lịch sử khám từ API phân hệ Tiếp tân
  useEffect(() => {
    const fetchPetHistory = async () => {
      if (!selectedPet?.id) return;
      
      setIsHistoryLoading(true);
      try {
        const response = await receptionAPI.getPetHistory(selectedPet.id);
        if (response.success) {
          setExamHistory(response.data || []);
        }
      } catch (error) {
        console.error("Lỗi lấy lịch sử bệnh án:", error);
        setExamHistory([]);
      } finally {
        setIsHistoryLoading(false);
      }
    };
    fetchPetHistory();
  }, [selectedPet]);

  const calculateAge = (birthDate) => {
    const years = new Date().getFullYear() - new Date(birthDate).getFullYear();
    return years > 0 ? `${years} tuổi` : 'Dưới 1 tuổi';
  };

  // Đóng gợi ý khi click ra ngoài
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">Tra cứu hồ sơ thú cưng</h1>
        <p className="text-sm text-gray-400 font-medium italic mt-1">Tìm kiếm thông tin định danh và bệnh án lịch sử</p>
      </div>

      {/* THANH TÌM KIẾM CÓ GỢI Ý */}
      <div className="relative mb-8" ref={dropdownRef}>
        <form onSubmit={handleSearch} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex gap-4 transition-all focus-within:shadow-md focus-within:border-blue-100">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập tên bé, số điện thoại hoặc tên chủ nuôi..." 
              className="w-full pl-14 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-0 outline-none placeholder:text-gray-300"
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="bg-[#0095FF] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-3 shadow-lg shadow-blue-100 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />} Tìm kiếm
          </button>
        </form>

        {/* DROPDOWN GỢI Ý */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-3xl shadow-2xl z-[100] overflow-hidden animate-in slide-in-from-top-2">
            {suggestions.map((owner, idx) => (
              <div 
                key={idx} 
                onClick={() => { setSearchQuery(owner.sdt); handleSearch(null, owner.sdt); }} 
                className="px-8 py-5 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b border-gray-50 last:border-none transition-colors"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-inner"><User size={22} /></div>
                  <div>
                    <p className="text-base font-bold text-gray-800">{owner.HoTen}</p>
                    <p className="text-xs text-gray-400 font-medium">SĐT: {owner.sdt}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-200" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* DANH SÁCH KẾT QUẢ (SẼ HIỆN TẤT CẢ PET CỦA CHỦ) */}
        <div className="col-span-4 bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden h-fit">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <h3 className="font-black text-xs text-gray-500 uppercase tracking-widest">Kết quả ({petResults.length})</h3>
            <PawPrint size={16} className="text-gray-300" />
          </div>
          <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto custom-scrollbar">
            {petResults.map((pet) => (
              <div 
                key={pet.id} 
                onClick={() => setSelectedPet(pet)} 
                className={`p-6 flex items-center gap-5 cursor-pointer transition-all ${selectedPet?.id === pet.id ? 'bg-blue-50/50 border-l-8 border-blue-500' : 'hover:bg-gray-50'}`}
              >
                <img src={pet.image} alt="" className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                <div>
                  <p className="font-black text-gray-800 text-sm">{pet.name}</p>
                  <p className="text-[11px] text-gray-400 font-bold uppercase mt-1">{pet.type} • {pet.breed}</p>
                </div>
              </div>
            ))}
            {petResults.length === 0 && !isLoading && (
              <div className="p-12 text-center text-gray-300 text-xs italic font-medium">Nhập thông tin để tìm kiếm</div>
            )}
          </div>
        </div>

        {/* CHI TIẾT & BỆNH ÁN */}
        <div className="col-span-8 bg-white rounded-[40px] border border-gray-100 shadow-sm min-h-[500px] relative overflow-hidden">
          {selectedPet ? (
            <div className="w-full p-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-start mb-10">
                <div className="flex gap-8">
                  <img src={selectedPet.image} alt="" className="w-32 h-32 rounded-[40px] object-cover border-8 border-blue-50 shadow-xl" />
                  <div className="pt-2">
                    <h2 className="text-4xl font-black text-gray-800 tracking-tighter">{selectedPet.name}</h2>
                    <p className="text-[#0095FF] font-black mt-2 uppercase tracking-widest text-xs">{selectedPet.breed}</p>
                    <div className="mt-4">
                      <span className="bg-gray-50 px-4 py-2 rounded-xl text-[11px] font-black text-gray-400 flex items-center gap-2 w-fit border border-gray-100">
                        <User size={14} className="text-gray-300" /> Chủ nuôi: <span className="text-gray-700">{selectedPet.owner}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => navigate('/staff/create-appointment',{ 
                    state: { petData: selectedPet } 
                  })}
                 className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all active:scale-95">Tạo lịch khám</button>
              </div>

              <div className="grid grid-cols-4 gap-6 mb-10">
                <DetailBox label="Tuổi" value={selectedPet.age} icon={Calendar} color="blue" />
                <DetailBox label="Cân nặng" value={selectedPet.weight} icon={Activity} color="emerald" />
                <DetailBox label="Giới tính" value={selectedPet.gender} icon={PawPrint} color="orange" />
                <DetailBox label="Mã số hồ sơ" value={`${selectedPet.id}`} icon={Hash} color="purple" />
              </div>

              {/* LỊCH SỬ KHÁM BỆNH */}
              <div className="border-t border-gray-100 pt-8">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-black text-gray-800 text-lg flex items-center gap-2">
                    <ClipboardList size={22} className="text-blue-500" /> Lịch sử khám bệnh gần đây
                  </h4>
                </div>

                {isHistoryLoading ? (
                  <div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
                ) : examHistory.length > 0 ? (
                  <div className="space-y-4">
                    {examHistory.map((exam, idx) => (
                      <div key={idx} className="bg-gray-50/50 p-5 rounded-[24px] border border-gray-100 flex justify-between items-center hover:bg-white transition-all hover:shadow-md hover:border-blue-100 group">
                        <div className="flex items-center gap-5">
                          <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all"><Activity size={18}/></div>
                          <div>
                            <p className="text-sm font-black text-gray-800">{exam.TenDV || 'Dịch vụ nội khoa'}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">{new Date(exam.NgayLap).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-sm">{exam.KetLuan || 'Hoàn thành'}</span>
                          {exam.TenBS && <p className="text-[9px] text-gray-400 mt-2 font-black italic tracking-widest uppercase">BS. {exam.TenBS}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-[32px] p-12 text-center border-2 border-dashed border-gray-200">
                    <PawPrint size={40} className="mx-auto text-gray-200 mb-3 opacity-50" />
                    <p className="text-xs text-gray-400 font-black uppercase tracking-widest italic">Chưa có dữ liệu bệnh án ghi nhận</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-center">
               <div className="bg-gray-50 p-10 rounded-[50px] mb-6">
                 <PawPrint size={64} className="text-gray-200" />
               </div>
               <p className="text-gray-400 font-black uppercase text-sm tracking-[0.2em]">Chọn một thú cưng để xem chi tiết bệnh án</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailBox = ({ label, value, icon: Icon, color }) => (
  <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-[28px] transition-all hover:bg-white hover:shadow-inner">
    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.15em] mb-2 ml-1">{label}</p>
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-xl bg-white text-${color}-500 shadow-sm`}><Icon size={16} /></div>
      <span className="text-sm font-black text-gray-700 tracking-tight">{value}</span>
    </div>
  </div>
);

export default PetSearch;