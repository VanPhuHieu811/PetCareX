import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarPicker from '../common/CalendarPicker';

const AppointmentModal = ({ isOpen, onClose, petName }) => {
  const navigate = useNavigate();

  // Ban đầu chưa chọn ngày
  const [selectedDate, setSelectedDate] = useState('');

  if (!isOpen) return null;

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
              alert(`Đã đặt lịch tái khám cho ${petName} vào ngày ${selectedDate}`);
              onClose();               // đóng modal
              navigate('/dashboard');  // 👉 quay về dashboard
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
