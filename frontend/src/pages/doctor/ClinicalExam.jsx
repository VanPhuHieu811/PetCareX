import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { petHistories, currentUser } from '../../services/mockDataBS';
import { getCustomerDetails } from '../../api/doctor';
// 1. Import các component đã tách
import Step1Diagnosis from '../../components/doctor/clinical/Step1Diagnosis';
import Step2Treatment from '../../components/doctor/clinical/Step2Treatment'; 
import Stepper from '../../components/doctor/common/Stepper';
import PrescriptionModal from '../../components/doctor/clinical/PrescriptionModal';
import AppointmentModal from '../../components/doctor/clinical/AppointmentModal';

const ClinicalExam = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // 1. CẬP NHẬT: Thêm state quản lý đóng/mở Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 2. Thêm state để lưu trữ dữ liệu form của các bước
  const [formData, setFormData] = useState({
    trieuChung: '',
    chuanDoan: '',
    huongXuLy: ''
  });

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);


  const [pet, setPetInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPetFullData = async () => {
      try {
        setLoading(true);
        // Chạy song song các API để tối ưu tốc độ
        const [customerData] = await Promise.all([
          getCustomerDetails(petId),    // Lấy info từ hàm bạn vừa đưa
        ]);

        const customer = customerData?.data?.[0];

        if (customer) {
          setPetInfo(customer);
        }

      } catch (err) {
        console.error("Lỗi khi tải hồ sơ thú cưng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPetFullData();
}, [petId]);


  const currentTime = "19:41"; 
  
  // 2. Định nghĩa danh sách các bước
  const stepsConfig = [
    { label: "Chẩn đoán", sub: "Triệu chứng & kết quả" },
    { label: "Xử lý", sub: "Chọn hướng xử lý" }
  ];

  // CẬP NHẬT: Hàm xử lý khi chọn hành động ở Bước 2
  const handleActionSelect = (actionId) => {
    setFormData(prev => ({ ...prev, huongXuLy: actionId }));
    
    // Nếu chọn kê toa thuốc thì mở Modal
    if (actionId === 'prescription') {
      setIsModalOpen(true);
    } 
    else if (actionId === 'appointment') { // Thêm logic này
      setIsAppointmentModalOpen(true);
    }
    else if (actionId === 'finish') {
      // Logic hoàn tất khám
      navigate('/doctor/dashboard');
    }
  };

  return (
    <div className="bg-[#f4f7fe] min-h-screen">
      {/* Top Bar giữ nguyên */}
      <div className="flex justify-between items-center px-8 py-4 bg-white border-b">
        <button onClick={() => navigate(-1)} className="text-slate-500 flex items-center gap-2 text-sm">
          ← Quay lại
        </button>
        <div className="flex items-center gap-4 text-slate-600 text-sm">
          <span>👤 {currentUser.hoTen}</span>
          <span>🕒 {currentTime}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-8">
        {/* Patient Header Card giữ nguyên */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border flex justify-between items-center mb-8">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 bg-slate-200 rounded-xl overflow-hidden flex items-center justify-center text-3xl">
               
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-800">{pet?.TenTC || "Lucky"}</h2>
                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs">{pet?.TenLoaiTC}</span>
                <span className="text-slate-600 text-xs not-italic">🩺 Khám bệnh</span>
              </div>
              <p className="text-sm text-slate-500">{pet?.TenGiong} • Chủ: {pet?.HoTen}</p>
            </div>
          </div>
          {pet?.TinhTrangSucKhoe !== 'Khỏe mạnh' && (
             <div className="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
               ⚠️ Có cảnh báo đặc biệt
             </div>
          )}
        </div>

        {/* 3. Sử dụng component Stepper đã tách */}
        <Stepper steps={stepsConfig} currentStep={step} />

        {/* CẬP NHẬT: Form Content sử dụng handleActionSelect */}
        <div className="bg-white rounded-[2rem] border p-10 shadow-sm min-h-[400px]">
          {step === 1 ? (
            <Step1Diagnosis formData={formData} setFormData={setFormData} />
          ) : (
            <Step2Treatment onSelectAction={handleActionSelect} />
          )}
        </div>

        {/* Bottom Actions giữ nguyên */}
        <div className="flex justify-between mt-8">
          <button 
            onClick={() => step > 1 && setStep(step - 1)}
            className={`px-8 py-3 rounded-xl border font-bold text-slate-500 transition-all ${step === 1 ? 'invisible opacity-0' : 'visible opacity-100'}`}
          >
            ← Quay lại
          </button>
          
          {step === 1 && (
            <button 
              onClick={() => setStep(2)}
              className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              Tiếp tục <span className="text-lg">→</span>
            </button>
          )}
        </div>

        {/* CẬP NHẬT: Chèn Modal vào cuối Component */}
        <PrescriptionModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          petName={pet?.TenTC || "Lucky"} 
          formData={formData}
        />
        {/* 3. Chèn Modal vào cuối Component */}
        <AppointmentModal 
          isOpen={isAppointmentModalOpen}
          onClose={() => setIsAppointmentModalOpen(false)}
          petName={pet?.TenTC}
        />

        {/* CẬP NHẬT: Phần ghi chú tự động lưu ở dưới cùng */}
        <div className="text-center mt-10 pb-10">
          <p className="text-[10px] text-slate-400 italic">
            Các thay đổi sẽ được tự động ghi lại: "Đã lưu bởi {currentUser.hoTen} lúc {currentTime} 4/1/2026"
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClinicalExam;