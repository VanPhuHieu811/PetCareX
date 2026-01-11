import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarPicker from '../common/CalendarPicker';

const AppointmentModal = ({ isOpen, onClose, petName, maPhieuDV, formData }) => {
  const navigate = useNavigate();

  // Ban đầu chưa chọn ngày
  const [selectedDate, setSelectedDate] = useState('');

  if (!isOpen) return null;

  const handleNextAppointment = async () => {
    try {
      const normalizeDate = (d) => {
        if (!d) return null;
        if (d.includes('/')) {
          const [day, month, year] = d.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return d;
      };

      const r = await fetch ("http://localhost:3000/api/v1/services/exams", {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...formData, maPhieuDV})
      })

      const res = await fetch("http://localhost:3000/api/v1/services/exams/revisit-date", {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          maPhieuDV: maPhieuDV,
          ngayTaiKham: normalizeDate(selectedDate)
        })
      })
      if (!res.ok && !r.ok) {
        throw new Error("Loi khong them lich duoc")
      }
      alert("Them thanh cong")
    }
    catch(err) {
      console.error("Loi them ngay tai kham")
    }
  }

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🗓</span>
            <h3 className="text-xl font-bold text-slate-800">Hẹn Tái Khám</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
        </div>

        {/* Calendar */}
        <div className="flex justify-center mb-8">
          <CalendarPicker
            selectedDate={selectedDate}
            onSelectDate={(date) => setSelectedDate(date)}
          />
        </div>

        {/* Chỉ hiển thị khi đã chọn ngày */}
        {selectedDate && (
          <div className="text-center mb-10 animate-in fade-in duration-200">
            <p className="text-slate-400 text-sm font-medium mb-1">Đã chọn:</p>
            <p className="text-slate-800 font-bold text-lg">
              {selectedDate}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            ✕ Hủy
          </button>

          <button
            disabled={!selectedDate}
            onClick={() => {
              handleNextAppointment()
              onClose();               // đóng modal
              navigate('/doctor/dashboard');  // 👉 quay về dashboard
            }}
            className={`flex-1 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2
              ${selectedDate
                ? 'bg-white border border-slate-200 text-slate-800 shadow-sm hover:shadow-md'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
            `}
          >
            ✓ Xác nhận lịch hẹn
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
