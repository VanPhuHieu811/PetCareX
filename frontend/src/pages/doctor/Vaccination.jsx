
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { petHistories, currentUser } from '../../services/mockDataBS';
import VaccineSelection from '../../components/doctor/vaccination/VaccineSelection';

const Vaccination = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [selectedVaccine, setSelectedVaccine] = useState(null);

  const pet = petHistories[petId]?.info;
  const currentTime = "22:56"; 

  const handleConfirm = () => {
    if (!selectedVaccine) {
      alert("Vui lòng chọn vaccine trước khi xác nhận!");
      return;
    }

    alert(
      `Đã xác nhận tiêm ${selectedVaccine.TenVacXin} cho ${pet.TenTC}.
        Hệ thống đã cập nhật tồn kho.`
    );

    navigate('/dashboard'); // ✅ quay về dashboard
  };

  return (
    <div className="bg-[#f4f7fe] min-h-screen">
      {/* Top Bar */}
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
        {/* Patient Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border flex justify-between items-center mb-8">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 bg-slate-200 rounded-xl" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-800">{pet?.TenTC}</h2>
                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs">{pet?.Loai}</span>
                <span className="text-slate-600 text-xs font-medium">💉 Tiêm phòng</span>
              </div>
              <p className="text-sm text-slate-500">
                {pet?.TenGiong} • Chủ: {pet?.TenChuNuoi}
              </p>
            </div>
          </div>
        </div>

        {/* Vaccine selection */}
        <div className="bg-white rounded-[2rem] border p-8 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Tiêm phòng</h3>
            <p className="text-sm text-slate-400">Chọn vaccine và xác nhận tiêm</p>
          </div>
          
          <VaccineSelection 
            onSelect={setSelectedVaccine}
            selectedId={selectedVaccine?.MaVacXin}
          />
        </div>

        {/* Confirm button */}
        <div className="flex justify-end mt-8">
          <button 
            onClick={handleConfirm}
            disabled={!selectedVaccine}
            className={`px-10 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2
              ${selectedVaccine
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'}
            `}
          >
            ✓ Xác nhận đã tiêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Vaccination;
