import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // Import Toaster
import clsx from 'clsx';
import { 
    CheckCircle2, Clock, MapPin, PawPrint, Stethoscope, 
    User, ChevronRight, ChevronLeft, ChevronDown, 
    Check, Loader2, Calendar as CalendarIcon 
} from 'lucide-react';

// --- IMPORTS API ---
import { getMyPets } from '../../api/petApi'; 
import { 
    getBranches, 
    getAvailableDoctors, 
    bookExamAppointment, 
    bookVaccineAppointment,
    Branch, 
    Doctor 
} from '../../api/bookingApi'; 

// --- CONSTANTS ---
const steps = [
    { id: 1, title: 'Dịch vụ & Địa điểm' },
    { id: 2, title: 'Thú cưng' },
    { id: 3, title: 'Thời gian & Bác sĩ' },
    { id: 4, title: 'Xác nhận' }
];

const SERVICES_DATA = [
    { 
        id: 'DV01', 
        name: 'Khám bệnh', 
        type: 'Khám bệnh',
        image: 'https://png.pngtree.com/template/20190719/ourlarge/pngtree-pet-clinic-logo-with-dog-cat-and-bird-with-cross-symbol-image_248028.jpg',
        priceRange: '150.000đ - 500.000đ'
    },
    { 
        id: 'DV02', 
        name: 'Tiêm phòng', 
        type: 'Tiêm phòng',
        image: 'https://png.pngtree.com/png-vector/20251016/ourmid/pngtree-cartoon-veterinary-syringe-with-paw-emblem-clean-isolated-white-png-image_17742378.webp',
        priceRange: 'Theo loại vắc-xin'
    }
];

const TIME_SLOTS = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
    "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
];

export default function Booking() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);

    // --- State Dữ liệu ---
    const [branches, setBranches] = useState<Branch[]>([]);
    const [myPets, setMyPetsList] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    
    // --- State Loading ---
    const [loadingData, setLoadingData] = useState(false);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- State Lựa chọn ---
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [selectedService, setSelectedService] = useState(SERVICES_DATA[0]);
    const [selectedPet, setSelectedPet] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    
    const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
    const branchDropdownRef = useRef<HTMLDivElement>(null);

    // 1. Fetch dữ liệu ban đầu
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoadingData(true);
            try {
                const [branchesData, petsData] = await Promise.all([
                    getBranches(),
                    getMyPets()
                ]);

                if (branchesData) {
                    setBranches(branchesData);
                    if (branchesData.length > 0) setSelectedBranch(branchesData[0]);
                }

                const petList = Array.isArray(petsData) ? petsData : (petsData?.data || []);
                setMyPetsList(petList);
                if (petList.length > 0) setSelectedPet(petList[0]);

            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
                toast.error("Không thể tải dữ liệu hệ thống");
            } finally {
                setLoadingData(false);
            }
        };

        if (user) {
            fetchInitialData();
        }
    }, [user]);

    // 2. Fetch Bác sĩ rảnh
    useEffect(() => {
        const fetchDoctors = async () => {
            if (!selectedBranch || !selectedDate || !selectedSlot) return;

            setLoadingDoctors(true);
            setDoctors([]);
            setSelectedDoctor(null);

            try {
                const res = await getAvailableDoctors(selectedBranch.MaCN, selectedDate, selectedSlot);
                if (res && res.success) {
                    setDoctors(res.data);
                } else if (Array.isArray(res)) {
                    setDoctors(res);
                }
            } catch (error) {
                console.error("Lỗi tìm bác sĩ:", error);
            } finally {
                setLoadingDoctors(false);
            }
        };

        fetchDoctors();
    }, [selectedBranch, selectedDate, selectedSlot]);

    // Handle click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) {
                setIsBranchDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setSelectedSlot(null);
        setSelectedDoctor(null);
    };

    const handleNext = () => {
        if (currentStep === 1 && !selectedBranch) return toast.error("Vui lòng chọn chi nhánh");
        if (currentStep === 2 && !selectedPet) return toast.error("Vui lòng chọn thú cưng");
        if (currentStep === 3 && (!selectedSlot || !selectedDoctor)) return toast.error("Vui lòng chọn giờ và bác sĩ");
        
        if (currentStep < 4) setCurrentStep(c => c + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(c => c - 1);
    };

    // --- LOGIC RESET: Quay về đầu để đặt lịch mới ---
    const resetBooking = () => {
        setCurrentStep(1);
        setSelectedSlot(null);
        setSelectedDoctor(null);
        setSelectedDate(new Date().toISOString().split('T')[0]); // Reset về hôm nay
        // Note: Không reset Branch/Pet/Service để tiện cho User đặt tiếp nếu cần
        setIsSubmitting(false); // Tắt trạng thái loading sau khi reset xong
    };

    // --- LOGIC CONFIRM: Đặt lịch & Thông báo ---
    const handleConfirm = async () => {
        if (!user) return toast.error("Vui lòng đăng nhập để đặt lịch");
        if (!selectedBranch?.MaCN) return toast.error("Lỗi: Chi nhánh không hợp lệ");
        if (!selectedPet?.MaTC) return toast.error("Lỗi: Thú cưng không hợp lệ");
        if (!selectedDoctor?.MaNV) return toast.error("Lỗi: Bác sĩ không hợp lệ");
        if (!selectedSlot) return toast.error("Vui lòng chọn giờ khám");

        setIsSubmitting(true);
        try {
            const dateTimeISO = `${selectedDate}T${selectedSlot}:00`; 

            const commonPayload = {
                maKH: user.MaND || user.id || "", 
                maCN: selectedBranch.MaCN,
                maDV: selectedService.id, 
                hinhThucDat: 'Online',
                bacSiPhuTrach: selectedDoctor.MaNV,
                maTC: selectedPet.MaTC,
            };

            let res;
            if (selectedService.type === 'Khám bệnh') {
                res = await bookExamAppointment({
                    ...commonPayload,
                    ngayKham: dateTimeISO
                });
            } else {
                res = await bookVaccineAppointment({
                    ...commonPayload,
                    ngayTiem: dateTimeISO,
                    maDK: null 
                });
            }

            if (res && (res.success === true || res.success === undefined)) {
                
                const successMsg = selectedService.type === 'Khám bệnh' 
                    ? "Đã đặt lịch khám bệnh thành công!" 
                    : "Đã đặt lịch tiêm phòng thành công!";
                
                toast.success(successMsg, { duration: 3000 });

                setTimeout(() => {
                    resetBooking();
                }, 2000); 

            } else {
                toast.error(res?.message || "Đặt lịch thất bại.");
                setIsSubmitting(false);
            }

        } catch (error: any) {
            console.error("API Error:", error);
            toast.error(error?.message || "Lỗi kết nối server");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl font-sans">
            {/* --- COMPONENT TOASTER ĐỂ HIỆN THÔNG BÁO --- */}
            <Toaster position="top-center" reverseOrder={false} />

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -z-10 h-0.5 w-full bg-gray-200" />
                    {steps.map((step) => (
                        <div key={step.id} className="flex flex-col items-center bg-gray-50 px-2">
                            <div className={clsx(
                                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300",
                                currentStep >= step.id ? "bg-blue-600 text-white shadow-lg" : "bg-gray-200 text-gray-500"
                            )}>
                                {step.id}
                            </div>
                            <span className={clsx("text-xs font-medium mt-2", currentStep >= step.id ? "text-blue-700" : "text-gray-400")}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden min-h-[500px] flex flex-col">
                <div className="p-6 md:p-8 flex-grow">
                    
                    {/* STEP 1: Dịch vụ & Địa điểm */}
                    {currentStep === 1 && (
                        <div className="space-y-8 animate-fade-in">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <MapPin className="text-blue-600" /> Chọn chi nhánh gần bạn
                                </h2>
                                <div className="relative" ref={branchDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                                        className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 bg-white text-gray-900 font-medium cursor-pointer flex items-center justify-between hover:border-blue-400 transition-all"
                                    >
                                        <span className="truncate">
                                            {selectedBranch ? `${selectedBranch.TenCN} - ${selectedBranch.DiaChi}` : "Đang tải danh sách..."}
                                        </span>
                                        <ChevronDown className={clsx("w-5 h-5 text-gray-500 transition-transform", isBranchDropdownOpen && "rotate-180")} />
                                    </button>

                                    {isBranchDropdownOpen && (
                                        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl border-2 border-gray-200 shadow-xl max-h-60 overflow-y-auto">
                                            {branches.map(branch => (
                                                <button
                                                    key={branch.MaCN}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedBranch(branch);
                                                        setIsBranchDropdownOpen(false);
                                                    }}
                                                    className={clsx(
                                                        "w-full px-4 py-3 text-left transition-colors flex items-center justify-between",
                                                        selectedBranch?.MaCN === branch.MaCN ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                                                    )}
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium truncate">{branch.TenCN}</div>
                                                        <div className="text-sm text-gray-500 truncate">{branch.DiaChi}</div>
                                                    </div>
                                                    {selectedBranch?.MaCN === branch.MaCN && <Check className="w-5 h-5 text-blue-600 ml-2" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Stethoscope className="text-blue-600" /> Chọn dịch vụ
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {SERVICES_DATA.map(service => (
                                        <div
                                            key={service.id}
                                            onClick={() => setSelectedService(service)}
                                            className={clsx(
                                                "p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-3",
                                                selectedService.id === service.id ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-gray-200 hover:border-blue-300"
                                            )}
                                        >
                                            <img src={service.image} alt={service.name} className="w-16 h-16 rounded-full object-cover shadow-sm" />
                                            <div>
                                                <div className="font-bold text-gray-900">{service.name}</div>
                                                <div className="text-xs text-blue-600 font-medium mt-1">{service.priceRange}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Chọn Thú Cưng */}
                    {currentStep === 2 && (
                        <div className="animate-fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <PawPrint className="text-blue-600" /> Chọn thú cưng
                                </h2>
                                <button 
                                    onClick={() => navigate('/customer/profile', { state: { openAddPet: true } })} 
                                    className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    + Thêm mới
                                </button>
                            </div>
                            
                            {myPets.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                    <p className="text-gray-500 mb-2">Bạn chưa có thú cưng nào.</p>
                                    <p className="text-sm text-gray-400">Vui lòng thêm thú cưng để tiếp tục đặt lịch.</p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {myPets.map(pet => (
                                        <div
                                            key={pet.MaTC}
                                            onClick={() => setSelectedPet(pet)}
                                            className={clsx(
                                                "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                                                selectedPet?.MaTC === pet.MaTC ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                                            )}
                                        >
                                            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl border border-white shadow-sm">
                                                🐶
                                            </div>
                                            <div>
                                                <div className="font-bold text-lg text-gray-900">{pet.TenTC}</div>
                                                <div className="text-sm text-gray-500">{pet.LoaiTC || "Thú cưng"} • {pet.Giong || "Chưa rõ"}</div>
                                            </div>
                                            {selectedPet?.MaTC === pet.MaTC && <CheckCircle2 className="ml-auto text-blue-600" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 3: Thời gian & Bác sĩ */}
                    {currentStep === 3 && (
                        <div className="animate-fade-in space-y-8">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Chọn Ngày & Giờ */}
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Clock className="text-blue-600" /> Chọn thời gian
                                    </h2>
                                    <div className="mb-6">
                                        <label className="text-sm font-bold text-gray-700 mb-2 block">Ngày khám</label>
                                        <div className="relative">
                                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                            <input
                                                type="date"
                                                className="pl-10 p-3 border border-gray-300 rounded-xl w-full font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={selectedDate}
                                                onChange={(e) => handleDateChange(e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                    </div>

                                    <label className="text-sm font-bold text-gray-700 mb-2 block">Khung giờ ({TIME_SLOTS.length} slots)</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {TIME_SLOTS.map((slot) => (
                                            <button
                                                key={slot}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={clsx(
                                                    "py-2 px-1 text-sm rounded-lg border font-medium transition-all",
                                                    selectedSlot === slot 
                                                        ? "bg-blue-600 text-white border-blue-600 shadow-md" 
                                                        : "border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-600 bg-white"
                                                )}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Chọn Bác Sĩ */}
                                <div className="flex-1 border-l pl-0 md:pl-8 border-gray-100 pt-6 md:pt-0 border-t md:border-t-0">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <User className="text-blue-600" /> Chọn bác sĩ
                                    </h2>
                                    
                                    {!selectedSlot ? (
                                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                            <Clock className="mx-auto text-gray-400 mb-2 w-8 h-8" />
                                            <p className="text-sm text-gray-500">Vui lòng chọn khung giờ để xem bác sĩ rảnh.</p>
                                        </div>
                                    ) : loadingDoctors ? (
                                        <div className="flex flex-col items-center justify-center py-12">
                                            <Loader2 className="animate-spin text-blue-600 mb-2 w-8 h-8" />
                                            <span className="text-sm text-gray-500 font-medium">Đang tìm bác sĩ phù hợp...</span>
                                        </div>
                                    ) : doctors.length > 0 ? (
                                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                                            {doctors.map(doc => (
                                                <div
                                                    key={doc.MaNV}
                                                    onClick={() => setSelectedDoctor(doc)}
                                                    className={clsx(
                                                        "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
                                                        selectedDoctor?.MaNV === doc.MaNV ? "border-blue-600 bg-blue-50" : "border-gray-100 hover:border-blue-300"
                                                    )}
                                                >
                                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg border border-white shadow-sm">
                                                        {doc.HoTen.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-sm text-gray-900">{doc.HoTen}</div>
                                                        <div className="text-xs text-gray-500">{doc.Email}</div>
                                                    </div>
                                                    {selectedDoctor?.MaNV === doc.MaNV && <CheckCircle2 className="ml-auto text-blue-600 w-5 h-5" />}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 bg-orange-50 rounded-xl border border-orange-100 text-orange-600 text-sm p-4">
                                            <p className="font-bold mb-1">Rất tiếc!</p>
                                            Không có bác sĩ nào rảnh vào <strong>{selectedSlot}</strong> ngày <strong>{selectedDate}</strong>.
                                            <br/>Vui lòng chọn giờ khác.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Xác nhận */}
                    {currentStep === 4 && (
                        <div className="animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <CheckCircle2 className="text-blue-600" /> Xác nhận thông tin
                            </h2>

                            <div className="bg-blue-50 p-6 rounded-2xl space-y-4 text-sm max-w-lg mx-auto border border-blue-100 shadow-sm">
                                <div className="flex justify-between border-b border-blue-200 pb-3">
                                    <span className="text-gray-500">Khách hàng</span>
                                    <span className="font-bold text-gray-900">{user?.HoTen || user?.name}</span>
                                </div>
                                <div className="flex justify-between border-b border-blue-200 pb-3">
                                    <span className="text-gray-500">Thú cưng</span>
                                    <span className="font-bold text-gray-900">{selectedPet?.TenTC} ({selectedPet?.LoaiTC})</span>
                                </div>
                                <div className="flex justify-between border-b border-blue-200 pb-3">
                                    <span className="text-gray-500">Chi nhánh</span>
                                    <span className="font-bold text-gray-900 text-right">{selectedBranch?.TenCN}</span>
                                </div>
                                <div className="flex justify-between border-b border-blue-200 pb-3">
                                    <span className="text-gray-500">Dịch vụ</span>
                                    <span className="font-bold text-blue-700">{selectedService?.name}</span>
                                </div>
                                <div className="flex justify-between border-b border-blue-200 pb-3">
                                    <span className="text-gray-500">Bác sĩ</span>
                                    <span className="font-bold text-gray-900">{selectedDoctor?.HoTen}</span>
                                </div>
                                <div className="flex justify-between pt-2 items-center">
                                    <span className="text-gray-500">Thời gian</span>
                                    <div className="text-right">
                                        <div className="font-black text-2xl text-blue-600">{selectedSlot}</div>
                                        <div className="text-gray-600 font-medium">{selectedDate}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 1 || isSubmitting}
                        className={clsx(
                            "flex items-center px-6 py-2.5 rounded-xl font-bold transition-colors",
                            currentStep === 1 
                                ? "text-gray-300 cursor-not-allowed" 
                                : "text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200"
                        )}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Quay lại
                    </button>

                    <button
                        onClick={currentStep === 4 ? handleConfirm : handleNext}
                        disabled={
                            isSubmitting || loadingData ||
                            (currentStep === 1 && !selectedBranch) ||
                            (currentStep === 2 && !selectedPet) ||
                            (currentStep === 3 && (!selectedSlot || !selectedDoctor))
                        }
                        className={clsx(
                            "flex items-center px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200",
                            (isSubmitting || loadingData)
                                ? "bg-gray-400 text-white cursor-wait"
                                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-300 active:scale-95 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang xử lý...
                            </>
                        ) : (
                            <>
                                {currentStep === 4 ? 'Xác nhận đặt lịch' : 'Tiếp tục'}
                                {currentStep !== 4 && <ChevronRight className="w-4 h-4 ml-1" />}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}