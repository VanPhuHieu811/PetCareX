import React, { useState } from 'react';
import { 
  ArrowLeft, Search, UserPlus, PawPrint, Calendar, 
  Clock, Stethoscope, MapPin, User, Plus, X, ChevronDown, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateAppointment = () => {
  const navigate = useNavigate();
  
  // States quản lý luồng
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [customerFound, setCustomerFound] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  
  // States lưu trữ thông tin thực tế
  const [confirmedPet, setConfirmedPet] = useState(null); // Lưu thú cưng đã chốt để hiện bảng tóm tắt
  const [selectedService, setSelectedService] = useState('Khám bệnh');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Logic chi tiết thêm mới thú cưng
  const [newPetSpecies, setNewPetSpecies] = useState(''); // 'dog' hoặc 'cat'
  const dogBreeds = ['Golden Retriever', 'Poodle', 'Corgi', 'Husky', 'Phú Quốc', 'Shiba Inu'];
  const catBreeds = ['Mèo Anh lông ngắn', 'Mèo Ba Tư', 'Mèo Munchkin', 'Mèo Xiêm', 'Mèo Mướp'];

  const doctors = [
    { id: 1, name: 'BS. Nguyễn Minh Tuấn', specialty: 'Nội khoa', image: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'BS. Trần Thị Bình', specialty: 'Ngoại khoa', image: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'BS. Lê Văn Nam', specialty: 'Tiêm chủng', image: 'https://i.pravatar.cc/150?u=3' },
  ];

  const existingPets = [
    { id: 101, name: 'Lucky', breed: 'Golden Retriever', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=100' },
    { id: 102, name: 'Miu', breed: 'British Shorthair', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100' }
  ];

  // Hàm xác nhận thêm thú cưng/khách hàng
  const handleConfirmPet = (petData) => {
    setConfirmedPet(petData);
    setShowAddPetForm(false);
    // Tự động gán bác sĩ random nếu là dịch vụ tiêm
    if (selectedService !== 'Khám bệnh') {
      setSelectedDoctor(doctors[Math.floor(Math.random() * doctors.length)]);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-xl border border-gray-100 text-gray-400 hover:text-gray-800 transition-all shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight font-sans">Tạo lịch khám trực tiếp</h1>
          <p className="text-sm text-gray-400 font-medium italic">Đăng ký và đặt lịch cho khách tại quầy</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 font-sans">
        <div className="col-span-8 space-y-6">
          
          {/* PHẦN 1: THÔNG TIN KHÁCH HÀNG & THÚ CƯNG */}
          <div className={`bg-white rounded-[32px] border transition-all duration-300 ${confirmedPet ? 'border-emerald-200 bg-emerald-50/10 shadow-none' : 'border-gray-100 shadow-sm'} p-8`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                <User size={20} className={confirmedPet ? 'text-emerald-500' : 'text-blue-500'} /> 
                1. Thông tin đối tượng {confirmedPet && <Check size={18} className="text-emerald-500" />}
              </h3>
              {!confirmedPet && !isNewCustomer && (
                <button onClick={() => {setIsNewCustomer(true); setCustomerFound(false);}} className="text-xs font-black text-blue-500 hover:text-blue-700 flex items-center gap-1 uppercase tracking-wider">
                  <UserPlus size={14} /> Khách hàng mới?
                </button>
              )}
            </div>

            {!confirmedPet ? (
              <div className="space-y-6">
                {!isNewCustomer ? (
                  <div className="space-y-6">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Tìm SĐT: 0901234567..." 
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                        onChange={(e) => setCustomerFound(e.target.value === '0901234567' || e.target.value.toLocaleLowerCase() === 'nguyễn văn an')} // Giả lập tìm kiếm
                      />
                    </div>
                    {customerFound && (
                      <div className="animate-in slide-in-from-top-4">
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">Chọn thú cưng hoặc bé mới:</p>
                        <div className="grid grid-cols-3 gap-4">
                          {existingPets.map((pet) => (
                            <div 
                              key={pet.id}
                              onClick={() => setSelectedPet(pet)}
                              className={`p-5 rounded-[24px] border-2 transition-all cursor-pointer flex flex-col items-center gap-3 ${
                                selectedPet?.id === pet.id ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-50 bg-white hover:border-blue-200'
                              }`}
                            >
                              <img src={pet.image} alt="" className="w-12 h-12 rounded-2xl object-cover shadow-sm border-2 border-white" />
                              <span className="text-sm font-black text-gray-800">{pet.name}</span>
                            </div>
                          ))}
                          <button onClick={() => setShowAddPetForm(true)} className="p-5 rounded-[24px] border-2 border-dashed border-gray-200 text-gray-400 flex flex-col items-center justify-center gap-2 hover:border-blue-300 transition-all">
                             <Plus size={24} /> <span className="text-[10px] font-black uppercase">Bé mới</span>
                          </button>
                        </div>

                        {/* FORM CHI TIẾT THÊM THÚ CƯNG MỚI CHO KHÁCH CŨ */}
                        {showAddPetForm && (
                          <div className="mt-8 p-8 bg-gray-50 rounded-[32px] border border-gray-100 animate-in zoom-in duration-300">
                             <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-6">
                               <PawPrint size={16} className="text-blue-500" /> Thêm hồ sơ thú cưng mới
                             </h4>
                             <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                   <input type="text" placeholder="Tên thú cưng *" className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold" />
                                   <input type="text" placeholder="Tuổi (VD: 2 tuổi)..." className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold" />
                                </div>
                                <div className="space-y-4">
                                   <div className="grid grid-cols-2 gap-3">
                                      <button onClick={() => setNewPetSpecies('dog')} className={`py-3 rounded-xl border-2 font-black text-[10px] uppercase transition-all ${newPetSpecies === 'dog' ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white text-gray-400'}`}>CHÓ</button>
                                      <button onClick={() => setNewPetSpecies('cat')} className={`py-3 rounded-xl border-2 font-black text-[10px] uppercase transition-all ${newPetSpecies === 'cat' ? 'bg-[#0095FF] border-[#0095FF] text-white' : 'bg-white text-gray-400'}`}>MÈO</button>
                                   </div>
                                   <div className="relative">
                                      <select className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold text-gray-700 outline-none appearance-none cursor-pointer">
                                         <option value="">-- Chọn giống --</option>
                                         {newPetSpecies === 'dog' && dogBreeds.map(b => <option key={b} value={b}>{b}</option>)}
                                         {newPetSpecies === 'cat' && catBreeds.map(b => <option key={b} value={b}>{b}</option>)}
                                      </select>
                                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                   </div>
                                </div>
                             </div>
                             <button 
                               onClick={() => handleConfirmPet({name: 'Bé mới', breed: 'Đang nhập'})}
                               className="mt-6 w-full py-4 bg-[#0095FF] text-white rounded-2xl font-black text-xs uppercase shadow-lg shadow-blue-100"
                             >
                               XÁC NHẬN THÊM MỚI
                             </button>
                          </div>
                        )}

                        {selectedPet && !showAddPetForm && (
                          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                            <button 
                              onClick={() => handleConfirmPet(selectedPet)}
                              className="px-10 py-3.5 bg-[#0095FF] text-white rounded-xl font-black text-xs uppercase shadow-lg shadow-blue-100 active:scale-95 transition-all"
                            >
                              SỬ DỤNG THÔNG TIN NÀY
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* LUỒNG KHÁCH MỚI HOÀN TOÀN */
                  <div className="space-y-6 animate-in fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Họ tên chủ nuôi *" className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold" />
                      <input type="text" placeholder="Số điện thoại *" className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold" />
                    </div>
                    <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 space-y-4">
                      <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-2"><PawPrint size={14} /> Thông tin thú cưng đăng ký mới</h4>
                      <div className="grid grid-cols-3 gap-4">
                         <input type="text" placeholder="Tên thú cưng" className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold col-span-2" />
                         <input type="text" placeholder="Tuổi..." className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <select onChange={(e) => setNewPetSpecies(e.target.value)} className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                           <option value="">-- Chọn loài --</option>
                           <option value="dog">Chó</option>
                           <option value="cat">Mèo</option>
                        </select>
                        <select className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none">
                           <option value="">-- Chọn giống --</option>
                           {newPetSpecies === 'dog' && dogBreeds.map(b => <option key={b} value={b}>{b}</option>)}
                           {newPetSpecies === 'cat' && catBreeds.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <button onClick={() => setIsNewCustomer(false)} className="text-xs text-gray-400 font-bold hover:underline uppercase tracking-widest flex items-center gap-2">← Quay lại</button>
                      <button 
                        onClick={() => handleConfirmPet({name: 'Thú cưng mới', breed: 'Mới'})}
                        className="px-10 py-3.5 bg-[#0095FF] text-white rounded-xl font-black text-xs uppercase shadow-lg shadow-blue-100"
                      >
                        THÊM MỚI & TIẾP TỤC
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* HIỂN THỊ KHI ĐÃ CHỐT THÔNG TIN */
              <div className="flex justify-between items-center bg-emerald-50/50 p-5 rounded-[24px] border border-emerald-100 animate-in zoom-in">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100"><Check size={28} /></div>
                  <div>
                    <p className="text-lg font-black text-gray-800 leading-tight">{confirmedPet.name}</p>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.1em] mt-1">{confirmedPet.breed || 'Chưa xác định'}</p>
                  </div>
                </div>
                <button onClick={() => setConfirmedPet(null)} className="text-[10px] font-black text-blue-500 bg-white border border-blue-100 px-5 py-2.5 rounded-xl uppercase tracking-widest shadow-sm">Thay đổi</button>
              </div>
            )}
          </div>

          {/* PHẦN 2: CHI TIẾT ĐẶT LỊCH */}
          <div className={`bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 transition-all ${!confirmedPet ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
             <h3 className="font-bold text-gray-800 mb-8 flex items-center gap-2 text-lg">
                <Calendar size={20} className="text-blue-500" /> 2. Chi tiết lịch hẹn
             </h3>
             <div className="space-y-10">
               <div className="grid grid-cols-3 gap-4">
                 <ServiceType icon={Stethoscope} label="Khám bệnh" active={selectedService === 'Khám bệnh'} onClick={() => {setSelectedService('Khám bệnh'); setSelectedDoctor(null);}} />
                 <ServiceType icon={Clock} label="Tiêm phòng" active={selectedService === 'Tiêm phòng'} onClick={() => {setSelectedService('Tiêm phòng'); setSelectedDoctor(doctors[0]);}} />
                 <ServiceType icon={Plus} label="Gói tiêm" active={selectedService === 'Gói tiêm'} onClick={() => {setSelectedService('Gói tiêm'); setSelectedDoctor(doctors[1]);}} />
               </div>
               
               <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-3">
                   <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Ngày khám dự kiến</label>
                   <input type="date" onChange={(e) => setBookingDate(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-[20px] px-6 py-4 text-base font-black text-gray-700 focus:ring-8 focus:ring-blue-500/5 transition-all outline-none" />
                 </div>
                 <div className="space-y-3">
                   <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Thời gian (Giờ)</label>
                   <input type="time" onChange={(e) => setBookingTime(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-[20px] px-6 py-4 text-base font-black text-gray-700 focus:ring-8 focus:ring-blue-500/5 transition-all outline-none" />
                 </div>
               </div>

               {/* HIỂN THỊ CHỌN BÁC SĨ */}
               {bookingDate && bookingTime && (
                 <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 space-y-5">
                   <div className="flex justify-between items-center">
                      <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">
                        {selectedService === 'Khám bệnh' ? 'Chọn bác sĩ phụ trách chuyên môn:' : 'Bác sĩ điều phối ngẫu nhiên:'}
                      </p>
                      <span className="text-[10px] bg-blue-50 text-blue-500 px-3 py-1.5 rounded-lg font-black uppercase tracking-wider">{selectedService}</span>
                   </div>
                   
                   {selectedService === 'Khám bệnh' ? (
                     <div className="grid grid-cols-3 gap-5">
                        {doctors.map((doc) => (
                          <div 
                            key={doc.id}
                            onClick={() => setSelectedDoctor(doc)}
                            className={`p-5 rounded-[28px] border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-3 ${
                              selectedDoctor?.id === doc.id ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100' : 'border-gray-50 bg-white hover:border-blue-200'
                            }`}
                          >
                            <img src={doc.image} className="w-16 h-16 rounded-[20px] object-cover border-4 border-white shadow-sm" alt=""/>
                            <div>
                              <p className="text-sm font-black text-gray-800 leading-tight">{doc.name}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{doc.specialty}</p>
                            </div>
                          </div>
                        ))}
                     </div>
                   ) : (
                     <div className="p-6 bg-blue-50 border border-blue-100 rounded-[24px] flex items-center gap-5 border-dashed">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm border border-blue-100"><User size={24} /></div>
                        <p className="text-sm font-bold text-blue-800 italic">Hệ thống đã tự động gán <span className="underline">{selectedDoctor?.name}</span> cho lịch tiêm của thú cưng.</p>
                     </div>
                   )}
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* CỘT PHẢI: TÓM TẮT LỊCH HẸN */}
        <div className="col-span-4">
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 sticky top-24">
            <h3 className="font-bold text-gray-800 text-xl mb-10 tracking-tight">Tóm tắt lịch hẹn</h3>
            <div className="space-y-10">
              {confirmedPet ? (
                <div className="flex items-center gap-5 p-6 bg-blue-50/50 rounded-[28px] border border-blue-100 animate-in zoom-in">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm border border-blue-100"><PawPrint size={32} /></div>
                  <div>
                    <p className="font-black text-gray-800 text-lg leading-tight">{confirmedPet.name}</p>
                    <p className="text-[11px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{confirmedPet.breed}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-[40px]">
                  <PawPrint size={56} className="text-gray-100 mb-4" />
                  <p className="text-sm text-gray-300 font-black italic tracking-wide text-center px-6">Xác nhận thông tin bước 1 để xem tóm tắt</p>
                </div>
              )}

              <div className="space-y-5 pt-8 border-t border-gray-100">
                <SummaryRow label="Dịch vụ" value={selectedService} />
                <SummaryRow label="Bác sĩ" value={selectedDoctor ? selectedDoctor.name : '---'} />
                <SummaryRow label="Thời gian" value={bookingDate && bookingTime ? `${bookingTime} • ${bookingDate}` : '---'} />
                <div className="flex justify-between items-center pt-6">
                  <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Tạm tính:</span>
                  <span className="text-3xl font-black text-[#0095FF] tracking-tighter font-mono">150.000đ</span>
                </div>
              </div>

              <button 
                className={`w-full py-6 rounded-[24px] font-black text-sm shadow-xl transition-all active:scale-95 ${
                  (confirmedPet && selectedDoctor && bookingDate) ? 'bg-[#0095FF] text-white shadow-blue-100 hover:bg-blue-600' : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                }`}
                disabled={!confirmedPet || !selectedDoctor || !bookingDate}
              >
                XÁC NHẬN ĐẶT LỊCH NGAY
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Component con hỗ trợ UI
const ServiceType = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`p-8 rounded-[32px] border-2 flex flex-col items-center gap-4 transition-all ${
    active ? 'bg-blue-50 border-blue-500 text-blue-500 shadow-lg shadow-blue-50 scale-105' : 'bg-white border-gray-50 text-gray-400 hover:border-blue-200'
  }`}>
    <Icon size={32} />
    <span className="text-[11px] font-black uppercase tracking-[0.2em]">{label}</span>
  </button>
);

const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{label}:</span>
    <span className={`font-black tracking-tight ${value === '---' ? 'text-gray-200' : 'text-gray-700'}`}>{value}</span>
  </div>
);

export default CreateAppointment;