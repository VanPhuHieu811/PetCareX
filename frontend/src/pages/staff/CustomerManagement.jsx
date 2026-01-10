import React, { useState, useEffect, useRef } from 'react';
import { UserPlus, Search, Mail, Phone, MoreVertical, Star, Crown, PawPrint, Filter, Loader2 } from 'lucide-react';
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

  // 1. Hàm lấy thống kê (Chạy khi load trang hoặc sau khi thêm mới)
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

  // 2. Hàm gom nhóm dữ liệu khách hàng từ SQL
  const groupCustomerData = (records) => {
    if (!records || records.length === 0) return null;
    const firstRow = records[0];
    return {
      id: firstRow.sdt,
      name: firstRow.HoTen,
      tier: firstRow.DiemLoyalty >= 1000 ? 'VIP' : (firstRow.DiemLoyalty >= 100 ? 'Thân thiết' : 'Cơ bản'),
      phone: firstRow.sdt,
      email: firstRow.Email,
      points: firstRow.DiemLoyalty,
      spent: 'Đang tính toán',
      pets: records.map(row => ({
        name: row.TenTC,
        breed: row.TenGiong
      })).filter(p => p.name !== null)
    };
  };

  // 3. Logic Debounce tìm gợi ý
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        setIsLoading(true);
        try {
          const response = await receptionAPI.getCustomerDetails(searchTerm);
          setSuggestions(response.data || []);
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
  const handleSelectSuggestion = (selectedCustomer) => {
    const mapped = groupCustomerData([selectedCustomer]);
    setCustomers([mapped]);
    setSearchTerm(selectedCustomer.sdt);
    setShowSuggestions(false);
  };

  // 5. Tìm kiếm khi nhấn Enter
  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      if (!searchTerm.trim()) return;
      setIsLoading(true);
      setShowSuggestions(false);
      try {
        const response = await receptionAPI.getCustomerDetails(searchTerm);
        const mapped = groupCustomerData(response.data);
        if (mapped) setCustomers([mapped]);
        else setCustomers([]);
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
      alert("Vui lòng nhập đầy đủ Tên và Số điện thoại");
      return;
    }

    setIsLoading(true);
    try {
      const res = await receptionAPI.addCustomer(newCustomer);
      if (res.success) {
        alert(`Thêm thành công! Mã khách hàng: ${res.data.maND}`);
        setShowAddModal(false);
        setNewCustomer({ name: '', sdt: '', email: '', cccd: '', birthDate: '', gender: 'Nam' });
        fetchStats(); // Cập nhật lại thẻ thống kê
      }
    } catch (error) {
      alert("Lỗi khi thêm: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý khách hàng</h1>
          <p className="text-sm text-gray-400 font-medium">Danh sách và thông tin chi tiết tất cả khách hàng</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#0095FF] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <UserPlus size={20} /> Thêm khách hàng
        </button>
      </div>

      {/* THẺ THỐNG KÊ */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatMiniCard label="VIP" count={stats.VIP} icon={Crown} color="orange" />
        <StatMiniCard label="Thân thiết" count={stats.ThanThiet} icon={Star} color="blue" />
        <StatMiniCard label="Cơ bản" count={stats.CoBan} icon={PawPrint} color="gray" />
      </div>

      {/* BỘ LỌC VÀ Ô TÌM KIẾM */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1" ref={dropdownRef}>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            {isLoading ? <Loader2 className="text-blue-500 animate-spin" size={18} /> : <Search className="text-gray-400" size={18} />}
          </div>
          <input 
            type="text" 
            placeholder="Nhập tên hoặc SĐT để tìm gợi ý..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/5 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch} 
          />

          {/* DROP DOWN GỢI Ý */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[110] overflow-hidden">
              {suggestions.map((item, index) => (
                <div 
                  key={index}
                  onClick={() => handleSelectSuggestion(item)}
                  className="px-6 py-4 hover:bg-blue-50 cursor-pointer flex justify-between items-center transition-colors border-b border-gray-50 last:border-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-sm">
                      {item.HoTen?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{item.HoTen}</p>
                      <p className="text-[11px] text-gray-400 font-medium">{item.sdt} • {item.Email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-lg font-bold">
                    {item.DiemLoyalty} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 bg-white px-4 border border-gray-100 rounded-xl shadow-sm text-sm font-bold text-gray-500 cursor-pointer">
          <Filter size={16} /> Tất cả
        </div>
      </div>

      {/* DANH SÁCH KHÁCH HÀNG */}
      <div className="space-y-6">
        {customers.length > 0 ? (
          customers.map((c) => (
            <div key={c.id} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="flex justify-between items-start">
                <div className="flex gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 font-black text-xl shadow-inner">
                    {c.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-gray-800">{c.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold border ${c.tier === 'VIP' ? 'bg-orange-50 border-orange-200 text-orange-500' : 'bg-blue-50 border-blue-200 text-blue-500'}`}>
                        {c.tier === 'VIP' ? '👑 VIP' : '⭐ ' + c.tier}
                      </span>
                    </div>
                    <div className="flex gap-6 mt-3 text-sm font-medium text-gray-400">
                      <span className="flex items-center gap-2"><Phone size={14} className="text-gray-300" /> {c.phone}</span>
                      <span className="flex items-center gap-2"><Mail size={14} className="text-gray-300" /> {c.email}</span>
                      <span className="flex items-center gap-2"><PawPrint size={14} className="text-gray-300" /> {c.pets?.length || 0} thú cưng</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Điểm tích lũy</p>
                  <h4 className="text-2xl font-black text-blue-500 tracking-tighter">{c.points}</h4>
                  <p className="text-[11px] text-gray-400 font-bold mt-1 uppercase">Đã chi: {c.spent} VNĐ</p>
                </div>

                <button className="absolute right-6 top-6 p-2 text-gray-300 hover:text-gray-600 transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Danh sách thú cưng */}
              <div className="mt-8 pt-6 border-t border-gray-50">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-4">Thú cưng:</p>
                <div className="flex gap-3 flex-wrap">
                  {c.pets && c.pets.map((pet, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <PawPrint size={14} className="text-gray-300" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-700">{pet.name || 'Chưa đặt tên'}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{pet.breed || 'Không rõ giống'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-medium">Nhập thông tin để tìm kiếm khách hàng</p>
          </div>
        )}
      </div>

      {/* MODAL THÊM KHÁCH HÀNG */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl w-full max-w-[600px] shadow-2xl p-8 animate-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Thêm khách hàng mới</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 p-2 hover:bg-gray-50 rounded-full transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <InputGroup label="Họ và tên" placeholder="VD: Nguyễn Văn A" value={newCustomer.name} onChange={(val) => setNewCustomer({...newCustomer, name: val})} />
                </div>
                <InputGroup label="Số điện thoại" placeholder="090 123 4567" value={newCustomer.sdt} onChange={(val) => setNewCustomer({...newCustomer, sdt: val})} />
                <InputGroup label="Email" placeholder="example@email.com" value={newCustomer.email} onChange={(val) => setNewCustomer({...newCustomer, email: val})} />
                
                {/* Ngày sinh */}
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase mb-2 block ml-1">Ngày sinh</label>
                  <input 
                    type="date" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    value={newCustomer.birthDate}
                    onChange={(e) => setNewCustomer({...newCustomer, birthDate: e.target.value})}
                  />
                </div>

                {/* Giới tính */}
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase mb-2 block ml-1">Giới tính</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none"
                    value={newCustomer.gender}
                    onChange={(e) => setNewCustomer({...newCustomer, gender: e.target.value})}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div className="col-span-2">
                    <InputGroup label="CCCD" placeholder="Số căn cước công dân" value={newCustomer.cccd} onChange={(val) => setNewCustomer({...newCustomer, cccd: val})} />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                 <button onClick={() => setShowAddModal(false)} className="flex-1 py-3.5 bg-gray-50 text-gray-500 rounded-xl font-bold hover:bg-gray-100 transition-colors">Hủy bỏ</button>
                 <button 
                  onClick={handleAddCustomer} 
                  disabled={isLoading}
                  className="flex-1 py-3.5 bg-[#0095FF] text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                 >
                   {isLoading && <Loader2 size={18} className="animate-spin" />} Xác nhận thêm
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
  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color === 'orange' ? 'bg-orange-50 text-orange-500' : color === 'blue' ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-400'}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">{label}</p>
      <p className="text-xl font-black text-gray-800 tracking-tighter">{count}</p>
    </div>
  </div>
);

const InputGroup = ({ label, placeholder, value, onChange }) => (
  <div>
    <label className="text-[11px] font-bold text-gray-500 uppercase mb-2 block ml-1">{label}</label>
    <input 
      type="text" 
      placeholder={placeholder} 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/10 focus:outline-none" 
    />
  </div>
);

export default CustomerManagement;