import React from 'react';

const Step2Treatment = ({ onSelectAction }) => {
  const actions = [
    {
      id: 'prescription',
      title: 'Kê Toa Thuốc',
      desc: 'Mở form kê đơn thuốc với live search và kiểm tra tồn kho',
      icon: '💊',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'appointment',
      title: 'Hẹn Tái Khám',
      desc: 'Chọn ngày tái khám trên lịch',
      icon: '📅',
      color: 'bg-slate-50 text-slate-600',
    },
    {
      id: 'finish',
      title: 'Kết Thúc Khám',
      desc: 'Lưu kết quả khám và quay về Dashboard',
      icon: '✓',
      color: 'bg-slate-50 text-slate-600',
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="mb-8">
        <h3 className="text-lg font-bold text-slate-800">Chọn hướng xử lý</h3>
        <p className="text-sm text-slate-400">Bác sĩ chọn 1 trong 3 hướng xử lý sau khám</p>
      </div>

      <div className="space-y-4">
        {actions.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectAction(item.id)}
            className="w-full flex items-center justify-between p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all group text-left outline-none"
          >
            <div className="flex items-center gap-5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${item.color}`}>
                {item.icon}
              </div>
              <div>
                <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </p>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            </div>
            <div className="text-slate-300 group-hover:text-blue-500 transition-colors">
              <span className="text-xl">→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Step2Treatment;