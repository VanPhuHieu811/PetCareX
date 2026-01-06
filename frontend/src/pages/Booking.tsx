import { useState, useRef, useEffect } from 'react';
import { branches, getAvailableSlotsForDate, getAvailableDoctorsForSlot, myPets, services } from '../data/mockDatabase';
import { Doctor, TimeSlot } from '../types';
import { CheckCircle2, Clock, MapPin, PawPrint, Stethoscope, User, ChevronRight, ChevronLeft, Phone, ChevronDown, Check } from 'lucide-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

const steps = [
    { id: 1, title: 'Dịch vụ & Địa điểm' },
    { id: 2, title: 'Thú cưng' },
    { id: 3, title: 'Thời gian & Bác sĩ' },
    { id: 4, title: 'Xác nhận' }
];

export default function Booking() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);

    // Selection State
    const [selectedBranch, setSelectedBranch] = useState(branches[0]);
    const [selectedService, setSelectedService] = useState(services[0]);
    const [selectedPet, setSelectedPet] = useState(myPets[0]);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
    const branchDropdownRef = useRef<HTMLDivElement>(null);

    // Derived state - doctors available for selected time slot
    const availableDoctors = selectedSlot
        ? getAvailableDoctorsForSlot(selectedDate, selectedSlot, selectedBranch.id)
        : [];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) {
                setIsBranchDropdownOpen(false);
            }
        };

        if (isBranchDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isBranchDropdownOpen]);

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setAvailableSlots(getAvailableSlotsForDate(date, selectedBranch.id));
        setSelectedSlot(null); // Reset slot
        setSelectedDoctor(null); // Reset doctor when date changes
    };

    const handleSlotSelect = (slotTime: string) => {
        setSelectedSlot(slotTime);
        setSelectedDoctor(null); // Reset doctor when slot changes
    };

    const handleDoctorSelect = (doc: Doctor) => {
        setSelectedDoctor(doc);
    };

    // Load available slots when step 3 is reached
    useEffect(() => {
        if (currentStep === 3 && availableSlots.length === 0) {
            setAvailableSlots(getAvailableSlotsForDate(selectedDate, selectedBranch.id));
        }
    }, [currentStep, selectedDate, selectedBranch.id]);

    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(c => c + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(c => c - 1);
    };

    const handleConfirm = () => {
        // Mock API Call
        alert('Đặt lịch thành công! Mã phiếu: BK-' + Math.floor(Math.random() * 10000));
        navigate('/profile');
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -z-10 h-0.5 w-full bg-gray-200" />
                    {steps.map((step) => (
                        <div key={step.id} className="flex flex-col items-center bg-gray-50 px-2">
                            <div
                                className={clsx(
                                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300",
                                    currentStep >= step.id
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : "bg-gray-200 text-gray-500"
                                )}
                            >
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

                    {/* STEP 1: Branch & Service */}
                    {currentStep === 1 && (
                        <div className="space-y-8 animate-fade-in">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <MapPin className="text-blue-600" /> Chọn chi nhánh gần bạn
                                </h2>

                                {/* Custom Dropdown */}
                                <div className="relative" ref={branchDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                                        className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white text-gray-900 font-medium cursor-pointer transition-all hover:border-blue-300 flex items-center justify-between"
                                    >
                                        <span className="text-left truncate">
                                            {selectedBranch.name} - {selectedBranch.address}
                                        </span>
                                        <ChevronDown className={clsx(
                                            "w-5 h-5 text-gray-500 flex-shrink-0 ml-2 transition-transform",
                                            isBranchDropdownOpen && "transform rotate-180"
                                        )} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isBranchDropdownOpen && (
                                        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl border-2 border-gray-200 shadow-lg max-h-80 overflow-y-auto">
                                            {branches.map(branch => (
                                                <button
                                                    key={branch.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedBranch(branch);
                                                        setIsBranchDropdownOpen(false);
                                                    }}
                                                    className={clsx(
                                                        "w-full px-4 py-3 text-left transition-colors flex items-center justify-between",
                                                        selectedBranch.id === branch.id
                                                            ? "bg-blue-50 text-blue-700"
                                                            : "text-gray-700 hover:bg-gray-50"
                                                    )}
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium truncate">{branch.name}</div>
                                                        <div className="text-sm text-gray-500 truncate">{branch.address}</div>
                                                    </div>
                                                    {selectedBranch.id === branch.id && (
                                                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Branch Details */}
                                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <div className="font-semibold text-gray-900">{selectedBranch.name}</div>
                                                <div className="text-sm text-gray-600 mt-1">{selectedBranch.address}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                            <span className="text-sm text-gray-700">{selectedBranch.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                            <span className="text-sm text-gray-700">Giờ mở cửa: {selectedBranch.openTime} - {selectedBranch.closeTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Stethoscope className="text-blue-600" /> Chọn dịch vụ
                                </h2>
                                <div className="flex md:flex-row flex-col gap-6">
                                    {services.map(service => (
                                        <div
                                            key={service.id}
                                            onClick={() => setSelectedService(service)}
                                            className={clsx(
                                                "flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-3 hover:bg-blue-50 min-w-0",
                                                selectedService.id === service.id
                                                    ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                                                    : "border-gray-200 hover:border-blue-300"
                                            )}
                                        >
                                            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                                                <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="w-full min-w-0">
                                                <div className="font-bold text-gray-900 whitespace-nowrap text-sm">{service.name}</div>
                                                <div className="text-xs text-blue-600 font-medium mt-1 whitespace-nowrap">{service.priceRange}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Pet Selection */}
                    {currentStep === 2 && (
                        <div className="animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <PawPrint className="text-blue-600" /> Chọn thú cưng của bạn?
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {myPets.map(pet => (
                                    <div
                                        key={pet.id}
                                        onClick={() => setSelectedPet(pet)}
                                        className={clsx(
                                            "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-blue-50",
                                            selectedPet.id === pet.id
                                                ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                                                : "border-gray-200 hover:border-blue-300"
                                        )}
                                    >
                                        <img src={pet.avatar} alt={pet.name} className="w-16 h-16 rounded-full object-cover border border-gray-200" />
                                        <div>
                                            <div className="font-bold text-lg text-gray-900">{pet.name}</div>
                                            <div className="text-sm text-gray-500">{pet.species} • {pet.breed}</div>
                                        </div>
                                        {selectedPet.id === pet.id && <CheckCircle2 className="ml-auto text-blue-600 w-6 h-6" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Time & Doctor */}
                    {currentStep === 3 && (
                        <div className="animate-fade-in space-y-8">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Clock className="text-blue-600" /> Chọn giờ khám
                                    </h2>
                                    <div className="mb-4">
                                        <label className="text-sm font-medium text-gray-700 mb-1 block">Ngày khám</label>
                                        <input
                                            type="date"
                                            className="p-2 border border-gray-300 rounded-lg w-full"
                                            value={selectedDate}
                                            onChange={(e) => handleDateChange(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        {availableSlots.map((slot) => (
                                            <button
                                                key={slot.time}
                                                disabled={!slot.isAvailable}
                                                onClick={() => handleSlotSelect(slot.time)}
                                                className={clsx(
                                                    "py-2 px-1 text-sm rounded-lg border text-center transition-colors",
                                                    !slot.isAvailable && "bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed decoration-slice",
                                                    slot.isAvailable && selectedSlot !== slot.time && "border-gray-200 hover:border-blue-500 hover:text-blue-600",
                                                    selectedSlot === slot.time && "bg-blue-600 text-white border-blue-600"
                                                )}
                                            >
                                                {slot.time}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 border-l pl-8 border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <User className="text-blue-600" /> Chọn bác sĩ
                                    </h2>
                                    {selectedSlot ? (
                                        <div className="space-y-3">
                                            {availableDoctors.length > 0 ? (
                                                availableDoctors.map(doc => (
                                                    <div
                                                        key={doc.id}
                                                        onClick={() => handleDoctorSelect(doc)}
                                                        className={clsx(
                                                            "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all hover:bg-blue-50",
                                                            selectedDoctor?.id === doc.id
                                                                ? "border-blue-600 bg-blue-50"
                                                                : "border-gray-200"
                                                        )}
                                                    >
                                                        <img src={doc.avatar} className="w-12 h-12 rounded-full" />
                                                        <div>
                                                            <div className="font-bold text-sm text-gray-900">{doc.name}</div>
                                                            <div className="text-xs text-gray-500">{doc.specialty}</div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-sm text-gray-400 italic">Không có bác sĩ khả dụng cho giờ này</div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-400 italic">Vui lòng chọn giờ khám trước</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Confirm */}
                    {currentStep === 4 && (
                        <div className="animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <CheckCircle2 className="text-blue-600" /> Xác nhận thông tin
                            </h2>

                            <div className="bg-blue-50 p-6 rounded-2xl space-y-4 text-sm max-w-lg mx-auto border border-blue-100">
                                <div className="flex justify-between border-b border-blue-100 pb-2">
                                    <span className="text-gray-500">Khách hàng</span>
                                    <span className="font-semibold text-gray-900">Nguyễn Văn A</span>
                                </div>
                                <div className="flex justify-between border-b border-blue-100 pb-2">
                                    <span className="text-gray-500">Thú cưng</span>
                                    <span className="font-semibold text-gray-900">{selectedPet.name} ({selectedPet.species})</span>
                                </div>
                                <div className="flex justify-between border-b border-blue-100 pb-2">
                                    <span className="text-gray-500">Chi nhánh</span>
                                    <span className="font-semibold text-gray-900 text-right">{selectedBranch.name}</span>
                                </div>
                                <div className="flex justify-between border-b border-blue-100 pb-2">
                                    <span className="text-gray-500">Dịch vụ</span>
                                    <span className="font-semibold text-gray-900">{selectedService.name}</span>
                                </div>
                                <div className="flex justify-between border-b border-blue-100 pb-2">
                                    <span className="text-gray-500">Bác sĩ</span>
                                    <span className="font-semibold text-gray-900">{selectedDoctor?.name}</span>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <span className="text-gray-500">Thời gian</span>
                                    <span className="font-bold text-blue-700 text-lg">{selectedSlot} - {selectedDate}</span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className={clsx(
                            "flex items-center px-6 py-2 rounded-lg font-medium transition-colors",
                            currentStep === 1
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-gray-600 hover:bg-gray-200 bg-white border border-gray-200"
                        )}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Quay lại
                    </button>

                    <button
                        onClick={currentStep === 4 ? handleConfirm : handleNext}
                        disabled={currentStep === 3 && (!selectedSlot || !selectedDoctor)}
                        className={clsx(
                            "flex items-center px-8 py-2 rounded-lg font-medium transition-colors shadow-sm",
                            (currentStep === 3 && (!selectedSlot || !selectedDoctor))
                                ? "bg-gray-300 text-white cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                        )}
                    >
                        {currentStep === 4 ? 'Xác nhận đặt lịch' : 'Tiếp tục'}
                        {currentStep !== 4 && <ChevronRight className="w-4 h-4 ml-1" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
