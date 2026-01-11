import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, UserPlus, PawPrint, Calendar, 
  Clock, Stethoscope, User, Plus, Check, Loader2, ChevronDown, X, Package 
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
  
  // --- STATES MỚI CHO GÓI TIÊM ---
  const [packagesList, setPackagesList] = useState([]); 
  const [selectedPackageId, setSelectedPackageId] = useState('');

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

  // --- 2. KIỂM TRA QUYỀN TRUY CẬP (GIỮ NGUYÊN) ---
  if (authLoading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const [fetchedBranchId, setFetchedBranchId] = useState('');

  useEffect(() => {
    const fetchStaffProfile = async () => {
      try {
        const res = await staffApi.getMyProfile();
        if (res.success && res.data) {
          const realID = res.data.MaCN || res.data.branchID || res.data.maCN;
          if (realID) setFetchedBranchId(realID);
        }
      } catch (error) { console.error("Lỗi lấy thông tin chi nhánh:", error); }
    };
    fetchStaffProfile();
  }, []);
  
  const branchID = fetchedBranchId || user.MaCN || user.branchID || 'CN001';

  // --- 3. CÁC USE EFFECT LOAD DỮ LIỆU (GIỮ NGUYÊN PHẦN CŨ) ---

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const res = await receptionAPI.getPetSpecies();
        if (res.success) setSpeciesList(res.data);
      } catch (error) { console.error("Lỗi lấy loài:", error); }
    };
    fetchSpecies();
  }, []);

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

  // --- USE EFFECT MỚI: LOAD GÓI TIÊM ---
  useEffect(() => {
    if (selectedService === 'Gói tiêm' && packagesList.length === 0) {
      const fetchPackages = async () => {
        try {
          const res = await receptionAPI.getAllPackages();
          const data = Array.isArray(res) ? res : (res.data || []);
          setPackagesList(data);
        } catch (error) { console.error("Lỗi lấy gói tiêm:", error); }
      };
      fetchPackages();
    }
  }, [selectedService]);

  // Tìm kiếm khách hàng (GIỮ NGUYÊN LOGIC BẠN ĐÃ DUYỆT)
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.trim().length >= 2 && !customerInfo) {
        try {
          const res = await receptionAPI.getCustomerDetails(searchTerm);
          if (res.data && res.data.length > 0) {
            setRawSearchResult(res.data);
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

  const handleSelectCustomer = (customer) => {
    const customerID = customer.mand
    setCustomerInfo({ ...customer, __id: customerID });
    setSearchTerm(customer.HoTen); 
    setShowSuggestions(false);
    
    const selectedID = (customerID || '').toUpperCase().trim();
    
    const customerPets = rawSearchResult
        .filter(row => {
            const rowMaKH = (row.mand || '').toUpperCase().trim();
            const rowMaND = (row.mand || '').toUpperCase().trim();
            return (rowMaKH === selectedID || rowMaND === selectedID) && row.MaTC;
        })
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

  // Lấy bác sĩ rảnh (GIỮ NGUYÊN)
  useEffect(() => {
    const fetchDoctors = async () => {
      if (branchID && bookingDate && bookingTime) {
        try {
          const docs = await receptionAPI.getAvailableDoctors(branchID, bookingDate, bookingTime);
          const doctorList = Array.isArray(docs) ? docs : (docs.data || []);
          setAvailableDoctors(doctorList);
          
          if (selectedService !== 'Khám bệnh' && doctorList.length > 0) {
            setSelectedDoctor(doctorList[0]);
          }
        } catch (error) { console.error(error); }
      }
    };
    fetchDoctors();
  }, [bookingDate, bookingTime, branchID, selectedService]);

  // --- 4. XỬ LÝ NGHIỆP VỤ ---

  // Thêm Thú Cưng (GIỮ NGUYÊN)
  const handleConfirmAddPet = async () => {
    const customerID = customerInfo?.mand || customerInfo?.makh;

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
            gender: "Đực",
            breedId: selectedBreedId, 
            weight: 0 
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

  // --- XÁC NHẬN ĐẶT LỊCH (SỬA LOGIC GÓI TIÊM) ---
  const handleConfirmBooking = async () => {
    // 1. Validate dữ liệu cơ bản
    const customerID = customerInfo?.MaND || customerInfo?.maND || customerInfo?.mand || customerInfo?.makh;
    if (!customerID || !selectedPet?.id) return alert("Thiếu thông tin khách hàng hoặc thú cưng!");
    if (!bookingDate || !bookingTime) return alert("Chưa chọn thời gian khám!");

    // 2. Validate Gói tiêm (MỚI)
    if (selectedService === 'Gói tiêm' && !selectedPackageId) {
        return alert("Vui lòng chọn Gói tiêm cụ thể!");
    }

    const isoDateTime = `${bookingDate}T${bookingTime}:00`;
    setIsCreating(true);

    try {
      let resultAppointment;
      
      // LOGIC A: ĐẶT LỊCH KHÁM
      if (selectedService === 'Khám bệnh') {
        const payload = {
            maKH: customerID,
            maCN: branchID,
            maDV: 'DV01',
            hinhThucDat: 'Tại quầy',
            bacSiPhuTrach: selectedDoctor?.MaNV || null,
            maTC: selectedPet.id,
            ngayKham: isoDateTime 
        };
        resultAppointment = await receptionAPI.createExamAppointment(payload);
      } 
      // LOGIC B: ĐẶT LỊCH TIÊM (LẺ & GÓI)
      else {
        const payload = {
            maKH: customerID,
            maCN: branchID,
            maDV: 'DV02', 
            hinhThucDat: 'Tại quầy',
            bacSiPhuTrach: selectedDoctor?.MaNV || null,
            maTC: selectedPet.id,
            ngayTiem: isoDateTime,
            maDK: null // Lần đầu tạo chưa có mã ĐK
        };
        resultAppointment = await receptionAPI.createVaccineAppointment(payload);
      }

      // XỬ LÝ KẾT QUẢ
      const maPhieuDV = resultAppointment.MaPhieuDV || resultAppointment.data?.MaPhieuDV || resultAppointment.maPhieuDV;

      if (maPhieuDV) {
        // LOGIC MỚI: NẾU LÀ GÓI TIÊM -> GỌI API ĐĂNG KÝ GÓI
        if (selectedService === 'Gói tiêm') {
            try {
                await receptionAPI.registerPackage({
                    MaKH: customerID,
                    MaGoiTP: selectedPackageId,
                    MaPhieuDV: maPhieuDV
                });
                alert(`Tạo lịch tiêm và Đăng ký gói thành công! (Mã phiếu: ${maPhieuDV})`);
            } catch (pkgError) {
                console.error(pkgError);
                // Vẫn thông báo thành công phần tạo lịch, nhưng báo lỗi phần gói
                alert(`Tạo lịch thành công (Phiếu: ${maPhieuDV}), nhưng lỗi đăng ký gói: ${pkgError.message}`);
            }
        } else {
            alert(`Đặt lịch thành công! (Mã phiếu: ${maPhieuDV})`);
        }
        
        navigate('/staff/appointments');
      } else {
        alert("Lỗi: Server không trả về mã phiếu. " + JSON.stringify(resultAppointment));
      }

    } catch (err) {
      console.error(err);
      alert("Lỗi hệ thống: " + err.message);
    } finally { setIsCreating(false); }
  };

  // Helper tính tiền hiển thị
  const calculateTotal = () => {
    if (selectedService === 'Gói tiêm' && selectedPackageId) {
        const pkg = packagesList.find(p => p.MaGoiTP === selectedPackageId);
        return pkg?.GiaTien ? `${pkg.GiaTien.toLocaleString()}đ` : '---';
    }
    return '150.000đ';
  };

  // UI Helper
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
          
          {/* BƯỚC 1: TÌM KHÁCH & CHỌN PET (GIỮ NGUYÊN UI) */}
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

                    {/* FORM THÊM PET GIỮ NGUYÊN */}
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

          {/* BƯỚC 2: LỊCH HẸN & BÁC SĨ (THÊM PHẦN GÓI TIÊM VÀO ĐÂY) */}
          <div className={`bg-white rounded-[32px] border p-8 ${!selectedPet ? 'opacity-30 grayscale pointer-events-none' : ''}`}>
             <h3 className="font-bold text-gray-800 mb-8 flex items-center gap-2"><Calendar size={20} className="text-blue-500" /> 2. Chi tiết lịch hẹn</h3>
             <div className="space-y-8">
               <div className="grid grid-cols-3 gap-4">
                 <ServiceType icon={Stethoscope} label="Khám bệnh" active={selectedService === 'Khám bệnh'} onClick={() => {setSelectedService('Khám bệnh'); setSelectedDoctor(null); setSelectedPackageId('');}} />
                 <ServiceType icon={Clock} label="Tiêm phòng" active={selectedService === 'Tiêm phòng'} onClick={() => {setSelectedService('Tiêm phòng'); setSelectedDoctor(null); setSelectedPackageId('');}} />
                 {/* SỬA ICON VÀ CLICK HANDLER CHO GÓI TIÊM */}
                 <ServiceType icon={Package} label="Gói tiêm" active={selectedService === 'Gói tiêm'} onClick={() => {setSelectedService('Gói tiêm'); setSelectedDoctor(null);}} />
               </div>

               {/* --- UI CHỌN GÓI TIÊM (CHỈ HIỆN KHI CHỌN DỊCH VỤ NÀY) --- */}
               {selectedService === 'Gói tiêm' && (
                    <div className="animate-in fade-in slide-in-from-top-2 bg-purple-50 p-6 rounded-2xl border border-purple-100">
                        <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-3 block">Chọn gói vắc-xin muốn đăng ký</label>
                        <div className="relative">
                            <select 
                                value={selectedPackageId} 
                                onChange={(e) => setSelectedPackageId(e.target.value)}
                                className="w-full p-4 bg-white rounded-xl border border-purple-200 text-sm font-bold text-purple-900 outline-none appearance-none cursor-pointer hover:border-purple-300 transition-all"
                            >
                                <option value="">-- Vui lòng chọn gói --</option>
                                {packagesList.map(pkg => (
                                    <option key={pkg.MaGoiTP} value={pkg.MaGoiTP}>
                                        {pkg.TenGoiTP} - {pkg.GiaTien ? pkg.GiaTien.toLocaleString() + 'đ' : 'Liên hệ'}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300" size={20}/>
                        </div>
                    </div>
               )}

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
                 
                 {/* HIỂN THỊ TÊN GÓI NẾU CÓ */}
                 {selectedService === 'Gói tiêm' && selectedPackageId && (
                    <SummaryRow 
                        label="Gói chọn" 
                        value={packagesList.find(p => p.MaGoiTP === selectedPackageId)?.TenGoiTP} 
                        highlight 
                    />
                 )}

                 <SummaryRow label="Bác sĩ" value={selectedDoctor?.HoTen || '---'} />
                 <SummaryRow label="Thời gian" value={bookingDate ? `${bookingTime} - ${bookingDate}` : '---'} />
              </div>
              
              {/* TÍNH TIỀN ĐỘNG */}
              <div className="mt-6 flex justify-between items-center">
                  <span className="text-xs font-black text-gray-400 uppercase">Tạm tính</span>
                  <span className="text-2xl font-black text-blue-600">
                      {calculateTotal()}
                  </span>
              </div>

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