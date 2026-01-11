import React, { useState, useEffect, useRef } from 'react';
import { 
  UserPlus, Search, Mail, Phone, MoreVertical, Star, Crown, 
  PawPrint, Filter, Loader2, ChevronRight, Calendar, User, Hash 
} from 'lucide-react';
import receptionAPI from '../../api/receptionAPI';

const CustomerManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [customers, setCustomers] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); 
  const [stats, setStats] = useState({ VIP: 0, ThanThiet: 0, CoBan: 0 });

  // --- STATE CHO THÊM KHÁCH HÀNG MỚI ---
  const [newCustomer, setNewCustomer] = useState({ 
    name: '', sdt: '', email: '', cccd: '', birthDate: '', gender: 'Nam' 
  });

  // --- STATES CHO TÍNH NĂNG GỢI Ý ---
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  // 1. Hàm lấy thống kê từ Database
  const fetchStats = async () => {
    try {
      const res = await receptionAPI.getCustomerStats();
      if (res.success) setStats(res.data);
    } catch (error) {
      console.error("Lỗi lấy thống kê:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // 2. HÀM QUAN TRỌNG: Gom nhóm thú cưng theo từng khách hàng
  const processCustomerResults = (records) => {
    if (!records || records.length === 0) return [];
    const customerMap = new Map();

    records.forEach(row => {
      if (!customerMap.has(row.sdt)) {
        customerMap.set(row.sdt, {
          id: row.sdt,
          name: row.HoTen,
          tier: row.DiemLoyalty >= 1000 ? 'VIP' : (row.DiemLoyalty >= 100 ? 'Thân thiết' : 'Cơ bản'),
          phone: row.sdt,
          email: row.Email,
          points: row.DiemLoyalty,
          spent: 'Đang tính toán',
          pets: [] 
        });
      }
      if (row.TenTC) {
        customerMap.get(row.sdt).pets.push({
          name: row.TenTC,
          breed: row.TenGiong
        });
      }
    });
    return Array.from(customerMap.values());
  };

  // 3. Logic Gợi ý tìm kiếm (Debounce 500ms)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        setIsLoading(true);
        try {
          const response = await receptionAPI.getCustomerDetails(searchTerm);
          // Lọc unique cho dropdown gợi ý
          const uniqueOnes = Array.from(
            new Map(response.data.map(item => [item.sdt, item])).values()
          );
          setSuggestions(uniqueOnes);
          setShowSuggestions(true);
        } catch (error) {
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // 4. Chọn từ gợi ý
  const handleSelectSuggestion = (item) => {
    setSearchTerm(item.sdt);
    handleSearch({ key: 'Enter', target: { value: item.sdt } }); // Giả lập nhấn Enter
    setShowSuggestions(false);
  };

  // 5. Tìm kiếm chính thức (Enter)
  const handleSearch = async (e) => {
    const value = e.key === 'Enter' ? (e.target.value || searchTerm) : null;
    if (e.key === 'Enter') {
      if (!searchTerm.trim()) return;
      setIsLoading(true);
      setShowSuggestions(false);
      try {
        const response = await receptionAPI.getCustomerDetails(searchTerm);
        const processed = processCustomerResults(response.data);
        setCustomers(processed);
      } catch (error) {
        setCustomers([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 6. Xử lý Thêm khách hàng mới
  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.sdt) {
      alert("Vui lòng nhập Tên và Số điện thoại!");
      return;
    }
    setIsLoading(true);
    try {
      const res = await receptionAPI.addCustomer(newCustomer);
      if (res.success) {
        alert(`Thêm thành công! Mã khách hàng: ${res.data.maND}`);
        setShowAddModal(false);
        setNewCustomer({ name: '', sdt: '', email: '', cccd: '', birthDate: '', gender: 'Nam' });
        fetchStats(); 
      }
    } catch (error) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Quản lý khách hàng</h1>
          <p className="text-sm text-gray-400 font-medium">Danh sách và thông tin chi tiết hội viên chi nhánh</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#0095FF] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <UserPlus size={20} /> Thêm khách hàng
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatMiniCard label="VIP" count={stats.VIP} icon={Crown} color="orange" />
        <StatMiniCard label="Thân thiết" count={stats.ThanThiet} icon={Star} color="blue" />
        <StatMiniCard label="Cơ bản" count={stats.CoBan} icon={PawPrint} color="gray" />
      </div>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-1" ref={dropdownRef}>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            {isLoading ? <Loader2 className="text-blue-500 animate-spin" size={18} /> : <Search className="text-gray-400" size={18} />}
          </div>
          <input 
            type="text" 
            placeholder="Tìm theo tên hoặc SĐT khách hàng..." 
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch} 
          />

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[110] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {suggestions.map((item, index) => (
                <div key={index} onClick={() => handleSelectSuggestion(item)} className="px-6 py-4 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b border-gray-50 last:border-none">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 font-bold">{item.HoTen?.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{item.HoTen}</p>
                      <p className="text-[11px] text-gray-400">{item.sdt}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 bg-white px-6 border border-gray-100 rounded-2xl shadow-sm text-sm font-bold text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors">
          <Filter size={16} /> Bộ lọc
        </div>
      </div>

      <div className="space-y-6">
        {customers.length > 0 ? customers.map((c) => (
          <div key={c.id} className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all relative group">
            <div className="flex justify-between items-start">
              <div className="flex gap-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-2xl shadow-inner italic">
                  {c.name?.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-800">{c.name}</h3>
                    <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border ${c.tier === 'VIP' ? 'bg-orange-50 border-orange-200 text-orange-500' : 'bg-blue-50 border-blue-200 text-blue-500'}`}>
                      {c.tier === 'VIP' ? '👑 VIP' : '⭐ ' + c.tier}
                    </span>
                  </div>
                  <div className="flex gap-6 mt-3 text-sm font-medium text-gray-400">
                    <span className="flex items-center gap-2"><Phone size={14} /> {c.phone}</span>
                    <span className="flex items-center gap-2"><Mail size={14} /> {c.email}</span>
                    <span className="flex items-center gap-2"><PawPrint size={14} /> {c.pets?.length || 0} thú cưng</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Điểm tích lũy</p>
                <h4 className="text-3xl font-black text-blue-500 tracking-tighter">{c.points.toLocaleString()}</h4>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50">
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <PawPrint size={12} /> Danh sách thú cưng:
              </p>
              <div className="flex gap-3 flex-wrap">
                {c.pets.length > 0 ? c.pets.map((pet, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2.5 flex items-center gap-3 hover:bg-white hover:border-blue-200 transition-all cursor-default group/pet">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm group-hover/pet:text-blue-500 transition-colors">
                      <PawPrint size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-700">{pet.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{pet.breed}</p>
                    </div>
                  </div>
                )) : <p className="text-xs text-gray-300 italic">Chủ nuôi chưa đăng ký thú cưng</p>}
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-24 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100">
            <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
               <Search size={32} className="text-gray-200" />
            </div>
            <p className="text-gray-400 font-bold">Nhập thông tin và nhấn Enter để xem chi tiết khách hàng</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-[40px] w-full max-w-[650px] shadow-2xl p-10 animate-in zoom-in duration-300">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
                  <div className="p-3 bg-blue-50 rounded-2xl text-blue-500"><UserPlus size={24}/></div>
                  Thêm khách hàng mới
                </h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-300 hover:text-gray-600 p-2 bg-gray-50 rounded-full transition-colors"><X size={24} /></button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <InputGroup label="Họ và tên khách hàng" placeholder="VD: Nguyễn Văn A" value={newCustomer.name} onChange={(v) => setNewCustomer({...newCustomer, name: v})} icon={User} />
                </div>
                <InputGroup label="Số điện thoại" placeholder="090..." value={newCustomer.sdt} onChange={(v) => setNewCustomer({...newCustomer, sdt: v})} icon={Phone} />
                <InputGroup label="Email liên hệ" placeholder="example@email.com" value={newCustomer.email} onChange={(v) => setNewCustomer({...newCustomer, email: v})} icon={Mail} />
                
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Ngày sinh</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="date" className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none" value={newCustomer.birthDate} onChange={(e) => setNewCustomer({...newCustomer, birthDate: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Giới tính</label>
                  <select className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none appearance-none" value={newCustomer.gender} onChange={(e) => setNewCustomer({...newCustomer, gender: e.target.value})}>
                    <option value="Nam">Nam</option><option value="Nữ">Nữ</option><option value="Khác">Khác</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <InputGroup label="Số CCCD / Định danh" placeholder="Nhập 12 số CCCD" value={newCustomer.cccd} onChange={(v) => setNewCustomer({...newCustomer, cccd: v})} icon={Hash} />
                </div>
              </div>

              <div className="flex gap-4 mt-12">
                 <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all">Hủy bỏ</button>
                 <button onClick={handleAddCustomer} disabled={isLoading} className="flex-[2] py-4 bg-[#0095FF] text-white rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
                   {isLoading ? <Loader2 size={20} className="animate-spin" /> : <UserPlus size={20}/>} Xác nhận thêm khách hàng
                 </button>
              </div>
           </div>
        </div>
      )}
    </>
  );
};

// COMPONENT PHỤ
const StatMiniCard = ({ label, count, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02] cursor-default">
    <div className={`p-4 rounded-2xl ${color === 'orange' ? 'bg-orange-50 text-orange-500 shadow-orange-100' : color === 'blue' ? 'bg-blue-50 text-blue-500 shadow-blue-100' : 'bg-gray-50 text-gray-400'} shadow-lg`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-gray-800 tracking-tighter">{count?.toLocaleString() || 0}</p>
    </div>
  </div>
);

const InputGroup = ({ label, placeholder, value, onChange, icon: Icon }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      <input type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-gray-300" />
    </div>
  </div>
);

export default CustomerManagement;