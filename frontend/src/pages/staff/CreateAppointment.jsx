import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, UserPlus, PawPrint, Calendar, 
  Clock, Stethoscope, User, Plus, Check, Loader2, ChevronDown, X 
} from 'lucide-react';
import receptionAPI from '../../api/receptionAPI';
import { useAuth } from '../../context/AuthContext'; 
import staffApi from '../../api/staffApi';

const CreateAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. Lấy user và trạng thái loading từ AuthContext
  const { user, loading: authLoading } = useAuth(); 
  const dropdownRef = useRef(null);

  // --- STATES DỮ LIỆU ---
  const [customerInfo, setCustomerInfo] = useState(null); 
  const [petList, setPetList] = useState([]); 
  const [availableDoctors, setAvailableDoctors] = useState([]);
  
  // --- STATES GỢI Ý (SEARCH) ---
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [rawSearchResult, setRawSearchResult] = useState([]); 

  // --- STATES DANH MỤC ĐỘNG (LOÀI & GIỐNG) ---
  const [speciesList, setSpeciesList] = useState([]); 
  const [breedsList, setBreedsList] = useState([]);

  // --- STATES FORM ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPet, setSelectedPet] = useState(location.state?.petData || null);
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [selectedService, setSelectedService] = useState('Khám bệnh');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  // Form thêm thú cưng
  const [newPetName, setNewPetName] = useState('');
  const [newPetAge, setNewPetAge] = useState('');
  const [selectedSpeciesId, setSelectedSpeciesId] = useState('');
  const [selectedBreedId, setSelectedBreedId] = useState('');

  const [isCreating, setIsCreating] = useState(false);

  // --- 2. KIỂM TRA QUYỀN TRUY CẬP ---
  // Nếu Auth đang tải -> Hiện Loading để tránh lỗi user null
  if (authLoading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;
  }

  // Nếu tải xong mà không có user -> Đá về login
  if (!user) {
    navigate('/login');
    return null;
  }

  // Lấy chi nhánh an toàn (Fallback CN001 nếu thiếu dữ liệu để test)
const [fetchedBranchId, setFetchedBranchId] = useState('');

  // Gọi API lấy profile để có MaCN chuẩn nhất
  useEffect(() => {
    const fetchStaffProfile = async () => {
      try {
        const res = await staffApi.getMyProfile();
        if (res.success && res.data) {
          // Lấy MaCN từ dữ liệu trả về (kiểm tra các trường hợp tên biến)
          const realID = res.data.MaCN || res.data.branchID || res.data.maCN;
          if (realID) setFetchedBranchId(realID);
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin chi nhánh:", error);
      }
    };
    fetchStaffProfile();
  }, []);
  // Logic: Ưu tiên lấy từ API (fetchedBranchId), nếu chưa load xong thì lấy từ User Context, cuối cùng là fallback
  const branchID = fetchedBranchId || user.MaCN || user.branchID || 'CN001';

  // --- 3. CÁC USE EFFECT LOAD DỮ LIỆU ---

  // Load danh sách LOÀI (Chó, Mèo...)
  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const res = await receptionAPI.getPetSpecies();
        if (res.success) setSpeciesList(res.data);
      } catch (error) { console.error("Lỗi lấy loài:", error); }
    };
    fetchSpecies();
  }, []);

  // Load danh sách GIỐNG khi chọn Loài
  useEffect(() => {
    const fetchBreeds = async () => {
      if (selectedSpeciesId) {
        setBreedsList([]); 
        try {
          const res = await receptionAPI.getBreeds(selectedSpeciesId);
          if (res.success) setBreedsList(res.data);
        } catch (error) { console.error("Lỗi lấy giống:", error); }
      }
    };
    fetchBreeds();
  }, [selectedSpeciesId]);

  // Tìm kiếm khách hàng (SỬA LỖI DROPDOWN 1 NGƯỜI)
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.trim().length >= 2 && !customerInfo) {
        try {
          const res = await receptionAPI.getCustomerDetails(searchTerm);
          if (res.data && res.data.length > 0) {
            setRawSearchResult(res.data);
            
            // LOGIC SỬA LỖI: Dùng MaND (hoặc SĐT) làm khóa để Map không gộp nhầm
            const uniqueCustomers = Array.from(
                new Map(res.data.map(item => {
                    const key = item.MaND || item.maND || item.makh || item.sdt;
                    return [key, item];
                })).values()
            );
            setSuggestions(uniqueCustomers);
            setShowSuggestions(true);
          } else {
            setSuggestions([]); setShowSuggestions(false);
          }
        } catch (error) { setSuggestions([]); }
      } else {
        setSuggestions([]); setShowSuggestions(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, customerInfo]);

  // Chọn khách hàng từ gợi ý
  const handleSelectCustomer = (customer) => {
    const customerID = customer.MaKH || customer.maKH || customer.MaND || customer.maND || customer.makh;
    setCustomerInfo({ ...customer, __id: customerID });
    setSearchTerm(customer.HoTen); 
    setShowSuggestions(false);
    
    // Lấy ID chuẩn để lọc danh sách pet

    
    const customerPets = rawSearchResult
    .filter(row =>
      (row.MaKH === customerID || row.maKH === customerID ||
       row.MaND === customerID || row.maND === customerID) && row.MaTC
    )
    .map(item => ({
      id: item.MaTC?.trim(),
      name: item.TenTC,
      breed: item.TenGiong,
      species: item.TenLoaiTC
    }));

  const uniquePets = Array.from(new Map(customerPets.map(p => [p.id, p])).values());
  setPetList(uniquePets);
};

  const handleResetCustomer = () => {
    setCustomerInfo(null);
    setSearchTerm('');
    setPetList([]);
    setSelectedPet(null);
    setRawSearchResult([]);
  };

  // Lấy bác sĩ rảnh (SỬA LỖI DANH SÁCH TRỐNG)
  useEffect(() => {
    const fetchDoctors = async () => {
      // Chỉ gọi khi có đủ 3 tham số
      if (branchID && bookingDate && bookingTime) {
        try {
          const docs = await receptionAPI.getAvailableDoctors(branchID, bookingDate, bookingTime);
          const doctorList = Array.isArray(docs) ? docs : (docs.data || []);
          setAvailableDoctors(doctorList);
          
          // Tự chọn bác sĩ đầu tiên nếu không phải khám bệnh
          if (selectedService !== 'Khám bệnh' && doctorList.length > 0) {
            setSelectedDoctor(doctorList[0]);
          }
        } catch (error) { console.error(error); }
      }
    };
    fetchDoctors();
  }, [bookingDate, bookingTime, branchID, selectedService]);

  // --- 4. XỬ LÝ NGHIỆP VỤ ---

  // Thêm Thú Cưng (SỬA LỖI MaKH NULL & CanNang)
  const handleConfirmAddPet = async () => {
    // Lấy ID khách hàng từ biến thể (do SQL/API trả về có thể khác nhau)
    const customerID =
      customerInfo?.MaKH ||
      customerInfo?.maKH ||
      customerInfo?.MaND ||
      customerInfo?.maND ||
      customerInfo?.makh;

    if (!customerID) {
        alert("Lỗi: Không xác định được Mã Khách Hàng. Vui lòng tìm kiếm lại!");
        return;
    }
    if (!newPetName || !selectedBreedId) {
        alert("Vui lòng nhập tên và chọn giống!");
        return;
    }

    setIsCreating(true);
    try {
        const payload = {
            maKH: customerID,
            name: newPetName,
            gender: "Đực", // Có thể mở rộng UI chọn giới tính
            breedId: selectedBreedId, // Gửi MaGiong xuống DB
            weight: 0 // Đã xóa cột CanNang ở Backend, gửi 0 cho an toàn
        };
        
        const res = await receptionAPI.addPet(payload);
        if (res.success) {
            const breedName = breedsList.find(b => b.MaGiong === selectedBreedId)?.TenGiong;
            const newPet = { 
                id: res.data.maTC, 
                name: newPetName, 
                breed: breedName,
                species: speciesList.find(s => s.MaLoaiTC === selectedSpeciesId)?.TenLoaiTC
            };
            setPetList([...petList, newPet]);
            setSelectedPet(newPet);
            setShowAddPetForm(false);
            alert("Thêm thú cưng thành công!");
        }
    } catch (err) { 
        alert("Lỗi thêm thú cưng: " + err.message); 
    } finally { setIsCreating(false); }
  };

  // Xác nhận Đặt Lịch
  const handleConfirmBooking = async () => {
    const customerID = customerInfo?.MaND || customerInfo?.maND || customerInfo?.makh;
    
    let serviceCode = 'DV001'; 
    let type = 'KhamBenh';
    if (selectedService === 'Tiêm phòng') { serviceCode = 'DV002'; type = 'TiemPhong'; }
    if (selectedService === 'Gói tiêm') { serviceCode = 'DV003'; type = 'TiemPhong'; }

    const payload = {
        maCN: branchID,
        maKH: customerID,
        maTC: selectedPet.id,
        maBS: selectedDoctor?.MaNV || null,
        maDV: serviceCode,
        ngayHen: `${bookingDate} ${bookingTime}`,
        loaiDichVu: type,
        isPackage: selectedService === 'Gói tiêm',
        maGoiTP: selectedService === 'Gói tiêm' ? 'GTP01' : null 
    };

    setIsCreating(true);
    try {
        const res = await receptionAPI.createAppointment(payload);
        if (res.success) {
            alert("Đặt lịch thành công! Mã phiếu: " + (res.data?.maPhieuDV || res.maPhieuDV));
            navigate('/staff/appointments');
        }
    } catch (error) { alert("Lỗi đặt lịch: " + error.message); } 
    finally { setIsCreating(false); }
  };

  // UI Helper: Đóng dropdown
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-xl border border-gray-100 text-gray-400 hover:text-gray-800 shadow-sm"><ArrowLeft size={20} /></button>
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight">Tạo lịch khám trực tiếp</h1>
          <p className="text-sm text-gray-400 font-medium italic">
             Chi nhánh hiện tại: <span className="font-bold text-blue-600">{branchID}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* CỘT TRÁI */}
        <div className="col-span-8 space-y-6">
          
          {/* BƯỚC 1: TÌM KHÁCH & CHỌN PET */}
          <div className={`bg-white rounded-[32px] border p-8 ${selectedPet ? 'border-emerald-200 bg-emerald-50/10' : 'border-gray-100'}`}>
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-6">
               <User size={20} className="text-blue-500" /> 1. Xác định đối tượng
            </h3>
            
            {!selectedPet ? (
              <div className="space-y-6">
                <div className="relative" ref={dropdownRef}>
                   <div className="relative">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input 
                         type="text" placeholder="Tìm SĐT hoặc Tên khách hàng..." 
                         className="w-full pl-12 pr-10 py-3.5 bg-gray-50 rounded-xl font-bold outline-none border border-gray-200 focus:border-blue-500 transition-all"
                         value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={!!customerInfo} 
                       />
                       {customerInfo && <button onClick={handleResetCustomer} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"><X size={18} /></button>}
                   </div>

                   {/* SUGGESTION DROPDOWN */}
                   {showSuggestions && suggestions.length > 0 && (
                       <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 max-h-[300px] overflow-y-auto">
                           {suggestions.map((cus, idx) => (
                               <div key={idx} onClick={() => handleSelectCustomer(cus)} className="px-6 py-4 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none flex justify-between items-center">
                                   <div><p className="text-sm font-bold text-gray-800">{cus.HoTen}</p><p className="text-xs text-gray-400">{cus.sdt}</p></div>
                                   <div className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded">{cus.MaND || cus.maND || 'KH...'}</div>
                               </div>
                           ))}
                       </div>
                   )}
                </div>
                
                {customerInfo && (
                  <div className="animate-in slide-in-from-top-2">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Danh sách thú cưng:</p>
                    <div className="grid grid-cols-3 gap-4">
                      {petList.map(pet => (
                        <button key={pet.id} onClick={() => setSelectedPet(pet)} className="p-4 border-2 rounded-2xl hover:border-blue-500 transition-all flex flex-col items-center gap-2 bg-white">
                          <PawPrint size={24} className="text-gray-300" />
                          <span className="text-sm font-bold text-gray-700">{pet.name}</span>
                          <span className="text-[10px] text-gray-400 uppercase">{pet.breed}</span>
                        </button>
                      ))}
                      <button onClick={() => setShowAddPetForm(true)} className="border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-all min-h-[100px]">
                        <Plus size={20} /> <span className="text-[10px] font-black uppercase mt-1">THÊM MỚI</span>
                      </button>
                    </div>

                    {/* FORM THÊM THÚ CƯNG (Dynamic Data) */}
                    {showAddPetForm && (
                        <div className="mt-6 p-6 bg-gray-50 rounded-3xl border border-gray-200 animate-in zoom-in">
                            <h4 className="text-xs font-black text-blue-500 uppercase mb-4">Nhập thông tin bé mới</h4>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <input type="text" placeholder="Tên thú cưng" className="p-3 rounded-xl border border-gray-200 text-sm font-bold outline-none" value={newPetName} onChange={(e)=>setNewPetName(e.target.value)}/>
                                
                                <div className="relative">
                                    <select value={selectedSpeciesId} onChange={(e)=>setSelectedSpeciesId(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 text-sm font-bold outline-none appearance-none bg-white">
                                        <option value="">-- Chọn loài --</option>
                                        {speciesList.map(s => <option key={s.MaLoaiTC} value={s.MaLoaiTC}>{s.TenLoaiTC}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                                </div>

                                <div className="relative col-span-2">
                                    <select value={selectedBreedId} onChange={(e)=>setSelectedBreedId(e.target.value)} disabled={!selectedSpeciesId} className="w-full p-3 rounded-xl border border-gray-200 text-sm font-bold outline-none appearance-none bg-white disabled:bg-gray-100">
                                        <option value="">-- Chọn giống --</option>
                                        {breedsList.map(b => <option key={b.MaGiong} value={b.MaGiong}>{b.TenGiong}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={()=>setShowAddPetForm(false)} className="flex-1 py-3 bg-gray-200 text-gray-600 rounded-xl font-bold text-xs uppercase hover:bg-gray-300">Hủy</button>
                                <button onClick={handleConfirmAddPet} disabled={isCreating} className="flex-[2] py-3 bg-blue-500 text-white rounded-xl font-bold text-xs uppercase hover:bg-blue-600 transition-all flex justify-center items-center gap-2">
                                    {isCreating ? <Loader2 className="animate-spin" size={16}/> : 'Lưu hồ sơ mới'}
                                </button>
                            </div>
                        </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-emerald-100">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500"><Check /></div>
                   <div>
                     <p className="font-black text-gray-800 text-lg">{selectedPet.name}</p>
                     <p className="text-xs text-gray-400 font-bold uppercase">{selectedPet.breed} • {customerInfo?.HoTen}</p>
                   </div>
                </div>
                <button onClick={() => {setSelectedPet(null); setShowAddPetForm(false);}} className="text-xs font-bold text-blue-500 hover:underline">Thay đổi</button>
              </div>
            )}
          </div>

          {/* BƯỚC 2: LỊCH HẸN & BÁC SĨ */}
          <div className={`bg-white rounded-[32px] border p-8 ${!selectedPet ? 'opacity-30 grayscale pointer-events-none' : ''}`}>
             <h3 className="font-bold text-gray-800 mb-8 flex items-center gap-2"><Calendar size={20} className="text-blue-500" /> 2. Chi tiết lịch hẹn</h3>
             <div className="space-y-8">
               <div className="grid grid-cols-3 gap-4">
                 <ServiceType icon={Stethoscope} label="Khám bệnh" active={selectedService === 'Khám bệnh'} onClick={() => {setSelectedService('Khám bệnh'); setSelectedDoctor(null);}} />
                 <ServiceType icon={Clock} label="Tiêm phòng" active={selectedService === 'Tiêm phòng'} onClick={() => {setSelectedService('Tiêm phòng'); setSelectedDoctor(null);}} />
                 <ServiceType icon={Plus} label="Gói tiêm" active={selectedService === 'Gói tiêm'} onClick={() => {setSelectedService('Gói tiêm'); setSelectedDoctor(null);}} />
               </div>
               <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày khám</label><input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full bg-gray-50 p-4 rounded-xl font-bold outline-none border border-gray-100 focus:border-blue-500" /></div>
                 <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Giờ khám</label><input type="time" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} className="w-full bg-gray-50 p-4 rounded-xl font-bold outline-none border border-gray-100 focus:border-blue-500" /></div>
               </div>
               {bookingDate && bookingTime && (
                 <div className="space-y-4 animate-in fade-in duration-500">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bác sĩ khả dụng:</p>
                    <div className="grid grid-cols-3 gap-4">
                       {availableDoctors.length > 0 ? availableDoctors.map(doc => (
                         <button key={doc.MaNV} onClick={() => setSelectedDoctor(doc)} className={`p-4 border-2 rounded-[24px] transition-all flex flex-col items-center gap-2 ${selectedDoctor?.MaNV === doc.MaNV ? 'border-blue-500 bg-blue-50' : 'border-gray-50 hover:border-blue-200'}`}>
                           <div className="w-10 h-10 bg-white rounded-full border shadow-sm flex items-center justify-center font-bold text-blue-500">{doc.HoTen.charAt(0)}</div>
                           <p className="text-xs font-black text-center">{doc.HoTen}</p>
                         </button>
                       )) : <p className="col-span-3 text-center text-xs text-red-400 italic bg-red-50 p-3 rounded-xl">Không có bác sĩ nào rảnh vào khung giờ này.</p>}
                    </div>
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* CỘT PHẢI */}
        <div className="col-span-4">
           <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 sticky top-24">
              <h3 className="font-bold text-gray-800 text-xl mb-8 tracking-tight">Tóm tắt đơn</h3>
              <div className="space-y-6 border-b border-gray-100 pb-8">
                 <SummaryRow label="Khách hàng" value={customerInfo?.HoTen || '---'} />
                 <SummaryRow label="Thú cưng" value={selectedPet?.name || '---'} />
                 <SummaryRow label="Dịch vụ" value={selectedService} highlight />
                 <SummaryRow label="Bác sĩ" value={selectedDoctor?.HoTen || '---'} />
                 <SummaryRow label="Thời gian" value={bookingDate ? `${bookingTime} - ${bookingDate}` : '---'} />
              </div>
              <div className="mt-6 flex justify-between items-center"><span className="text-xs font-black text-gray-400 uppercase">Tạm tính</span><span className="text-2xl font-black text-blue-600">150.000đ</span></div>
              <button onClick={handleConfirmBooking} disabled={!selectedPet || !selectedDoctor || !bookingDate || isCreating} className="w-full py-4 bg-[#0095FF] text-white rounded-xl font-black mt-6 shadow-lg shadow-blue-100 hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none transition-all flex items-center justify-center gap-2">
                {isCreating && <Loader2 className="animate-spin" size={20} />} XÁC NHẬN ĐẶT LỊCH
              </button>
           </div>
        </div>
      </div>
    </>
  );
};

const ServiceType = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`p-6 rounded-[24px] border-2 flex flex-col items-center gap-3 transition-all ${active ? 'bg-blue-50 border-blue-500 text-blue-500 shadow-md' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200'}`}>
    <Icon size={28} />
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const SummaryRow = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{label}</span>
    <span className={`font-bold text-right ${highlight ? 'text-blue-500' : 'text-gray-700'}`}>{value}</span>
  </div>
);

export default CreateAppointment;