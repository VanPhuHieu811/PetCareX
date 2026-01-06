import React, { useState, useEffect } from 'react';

const CalendarPicker = ({ onSelectDate, selectedDate }) => {

  const parseSelectedDate = () => {
    if (!selectedDate) return null;
    const [d, m, y] = selectedDate.split('/').map(Number);
    return new Date(y, m - 1, d);
  };

  const selectedDateObj = parseSelectedDate();

  // 📌 Mở đúng tháng của ngày đã chọn
  const [currentMonth, setCurrentMonth] = useState(
    selectedDateObj || new Date()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (selectedDateObj) {
      setCurrentMonth(new Date(
        selectedDateObj.getFullYear(),
        selectedDateObj.getMonth(),
        1
      ));
    }
  }, [selectedDate]);

  const daysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();

  const firstDayOfMonth = (year, month) =>
    new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    ));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    ));
  };

  const monthYearString = currentMonth.toLocaleString('vi-VN', {
    month: 'long',
    year: 'numeric',
  });

  const days = Array.from(
    { length: daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth()) },
    (_, i) => i + 1
  );

  const blanks = Array.from(
    { length: firstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth()) },
    (_, i) => i
  );

  return (
    <div className="bg-white border border-slate-100 shadow-2xl rounded-[2rem] p-6 w-[320px] animate-in zoom-in-95 duration-200">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={handlePrevMonth} className="w-8 h-8 rounded-full hover:bg-slate-50">❮</button>
        <h4 className="text-sm font-bold text-slate-800 capitalize">
          {monthYearString}
        </h4>
        <button onClick={handleNextMonth} className="w-8 h-8 rounded-full hover:bg-slate-50">❯</button>
      </div>

      {/* Thứ */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
          <div key={day} className="text-[10px] font-bold text-slate-500 text-center py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Ngày */}
      <div className="grid grid-cols-7 gap-1">
        {blanks.map(i => <div key={`blank-${i}`} />)}

        {days.map(day => {
          const dateObj = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
          );

          const dateStr = `${day}/${currentMonth.getMonth() + 1}/${currentMonth.getFullYear()}`;

          const isSelected = selectedDate === dateStr;

          const isToday =
            dateObj.getTime() === today.getTime();

          // 🚫 Ngày quá khứ
          const isPast = dateObj <= today;

          return (
            <button
              key={day}
              disabled={isPast}
              onClick={() => onSelectDate(dateStr)}
              className={`
                w-10 h-10 flex items-center justify-center rounded-xl text-xs font-bold transition-all
                ${isSelected
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-110'
                  : isToday
                    ? 'border-2 border-blue-400 text-blue-300'
                    : isPast
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarPicker;
