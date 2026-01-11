import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { mockMedicines } from '../../../services/mockDataBS';
// import { createPrescription } from '../../../api/doctor';
import { createPrescription, getMedicinesInStock, updateRevisitDate } from '../../../api/doctor';
import CalendarPicker from '../common/CalendarPicker';

const PrescriptionModal = ({ isOpen, onClose, petName, formData, maPhieuDV, branchId }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [dbMedicines, setDbMedicines] = useState([]);
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [revisitDate, setRevisitDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    if (isOpen && branchId) {
      const fetchMeds = async () => {
        try {
          const res = await getMedicinesInStock(branchId); //
          if (res.success) setDbMedicines(res.data);
        } catch (err) {
          console.error("Lỗi lấy danh sách thuốc:", err);
        }
      };
      fetchMeds();
    }
  }, [isOpen, branchId]);


  if (!isOpen) return null;



  const handleAddMed = (med) => {
    if (!selectedMeds.find(m => m.MaSP === med.MaSP)) {
      setSelectedMeds([...selectedMeds, { ...med, lieuDung: '', tanSuat: '', soLuong: '' }]);
    }
    setShowSearch(false);
    setSearchTerm('');
  };

  const updateMedField = (idx, field, value) => {
    const newMeds = [...selectedMeds];
    newMeds[idx][field] = value;
    setSelectedMeds(newMeds);
  };

  // const handleSave = () => {
  //   alert("Kê đơn thành công!");
  //   onClose();
  //   navigate('/doctor/dashboard');
  // };

  const handleSave = async () => {
    if (selectedMeds.length === 0) return;

    try {
      setIsSubmitting(true);
      
      // A. Tạo đơn thuốc (API 32)
      const prescriptionData = {
        MaPhieuDV: maPhieuDV,
        MaCN: branchId,
        medicines: selectedMeds
      };
      await createPrescription(prescriptionData); //

      // B. Cập nhật ngày tái khám nếu có chọn (API PATCH revisit-date)
      if (revisitDate) {
        await updateRevisitDate(maPhieuDV, revisitDate); //
      }

      alert("Kê đơn và hẹn lịch thành công!");
      onClose();
      navigate('/doctor/dashboard');
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-xl text-blue-600">💊</div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Kê Toa Thuốc</h3>
              <p className="text-sm text-slate-500 font-medium">Chỉ định sau khám cho {petName}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400">✕</button>
        </div>

        <div className="p-8 pt-0 overflow-y-auto space-y-6 scrollbar-hide">
          <section>
            <div className="flex justify-between items-center mb-4 relative">
              <h4 className="font-bold text-slate-700">Đơn thuốc</h4>
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className="flex items-center gap-2 text-blue-600 text-sm font-bold border border-blue-100 px-4 py-2 rounded-xl hover:bg-blue-50"
              >
                ＋ Thêm thuốc
              </button>

              {/* Drug Search Popover */}
              {showSearch && (
                <div ref={searchRef} className="absolute right-0 top-12 w-80 bg-white border border-slate-100 shadow-2xl rounded-2xl z-50 animate-in zoom-in-95 duration-200 overflow-hidden">
                  <div className="p-3 border-b border-slate-50 flex items-center gap-2">
                    <span className="text-slate-400">🔍</span>
                    <input 
                      autoFocus
                      className="text-sm outline-none w-full" 
                      placeholder="Tìm thuốc..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {mockMedicines.filter(m => m.TenSP.toLowerCase().includes(searchTerm.toLowerCase())).map(med => (
                      <div key={med.MaSP} onClick={() => handleAddMed(med)} className="p-4 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 flex justify-between">
                        <div>
                          <p className="text-sm font-bold text-blue-700">{med.TenSP}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{med.DonVi}</p>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold">Tồn: {med.Ton}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* List of Added Medicines */}
            {selectedMeds.length === 0 ? (
              <div className="border-2 border-dashed border-slate-100 rounded-[2rem] py-12 text-center bg-slate-50/30 text-slate-600">
                <div className="text-2xl mb-2">💊</div>
                <p className="text-sm font-medium">Chưa có thuốc nào được kê</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedMeds.map((med, idx) => (
                  <div key={med.MaSP} className="border border-slate-100 rounded-2xl p-5 bg-white relative group">
                    <button onClick={() => setSelectedMeds(selectedMeds.filter(m => m.MaSP !== med.MaSP))} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">🗑</button>
                    <h5 className="font-bold text-slate-800 text-sm mb-1">{med.TenSP}</h5>
                    <p className="text-[10px] text-slate-400 font-bold mb-4 uppercase">{med.DonVi}</p>
                    <div className="grid grid-cols-4 gap-3">
                      {/* <InputBox label="Liều dùng" placeholder="VD: 1 viên" />
                      <InputBox label="Tần suất" placeholder="2 lần/ngày" />
                      <InputBox label="Thời gian" placeholder="5 ngày" />
                      <InputBox label="Số lượng" placeholder="10" suffix="viên" /> */}

                      <InputBox label="Liều dùng" placeholder="1 viên" value={med.lieuDung} onChange={(v) => updateMedField(idx, 'lieuDung', v)} />
                      <InputBox label="Tần suất" placeholder="2 lần/ngày" value={med.tanSuat} onChange={(v) => updateMedField(idx, 'tanSuat', v)} />
                      <InputBox label="Số lượng" placeholder="10" suffix={med.DonVi} value={med.soLuong} onChange={(v) => updateMedField(idx, 'soLuong', v)} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Revisit Date Section */}
          <section className="relative">
            <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">🗓 Hẹn tái khám</h4>
            <div 
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-4 w-full p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:border-blue-200 transition-all"
            >
              <span className="text-slate-400">📅</span>
              <span className={revisitDate ? "text-slate-800 font-bold text-sm" : "text-slate-600 text-sm font-medium"}>
                {revisitDate || "Chọn ngày tái khám"}
              </span>
            </div>

            {/* Phần hiển thị Calendar khi nhấn vào input */}
            {showCalendar && (
              <div className="fixed inset-0 z-[200]" onClick={() => setShowCalendar(false)}>
                <div 
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CalendarPicker
                    selectedDate={revisitDate}
                    onSelectDate={(date) => {
                      setRevisitDate(date);
                      setShowCalendar(false);
                    }}
                  />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-slate-50 flex justify-end gap-3">
          <button onClick={onClose} disabled={isSubmitting} className="px-8 py-3 rounded-xl border font-bold text-slate-500">Hủy</button>
          <button
            onClick={handleSave}
            disabled={isSubmitting || selectedMeds.length === 0}
          //   className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${selectedMeds.length > 0 ? 'bg-blue-600 shadow-blue-100 hover:scale-105' : 'bg-blue-300 cursor-not-allowed'}`}
          // >
          //   💾 Lưu đơn thuốc ({selectedMeds.length})
          // </button>
          className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg ${isSubmitting || selectedMeds.length === 0 ? 'bg-blue-300' : 'bg-blue-600 hover:scale-105'}`}
          >
            {isSubmitting ? "Đang lưu..." : `Lưu đơn thuốc (${selectedMeds.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

const InputBox = ({ label, placeholder, suffix }) => (
  <div>
    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">{label}</label>
    <div className="relative">
      <input className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50/30 text-xs font-bold outline-none focus:border-blue-300 transition-all" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}/>

      {suffix && <span className="absolute right-3 top-3 text-[10px] text-slate-300 font-bold uppercase">{suffix}</span>}
    </div>
  </div>
);

export default PrescriptionModal;

