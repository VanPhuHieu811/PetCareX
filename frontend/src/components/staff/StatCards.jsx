import React from 'react';

export const ActionCard = ({ icon: Icon, title, subtitle, color = "bg-white", textColor = "text-gray-800" }) => (
  <div className={`${color} p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-shadow`}>
    <div className={`mb-3 p-2 rounded-lg ${color === 'bg-white' ? 'bg-gray-50' : 'bg-white/20'}`}>
      <Icon size={24} className={color === 'bg-white' ? 'text-blue-500' : 'text-white'} />
    </div>
    <h4 className={`font-bold text-sm ${textColor}`}>{title}</h4>
    <p className={`text-[11px] mt-1 ${color === 'bg-white' ? 'text-gray-400' : 'text-white/80'}`}>{subtitle}</p>
  </div>
);

export const MetricCard = ({ title, value, subValue, trend, icon: Icon, color = "white" }) => (
  <div className={`p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between relative overflow-hidden ${color === 'green' ? 'bg-green-600 text-white' : 'bg-white text-gray-800'}`}>
    <div>
      <p className={`text-xs font-medium ${color === 'green' ? 'text-green-100' : 'text-gray-500'}`}>{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
      <div className="mt-2 flex items-center gap-2 text-[11px]">
        <span className={color === 'green' ? 'text-green-100' : 'text-gray-400'}>{subValue}</span>
        {trend && <span className="text-green-400 font-bold">{trend}</span>}
      </div>
    </div>
    <div className={`p-3 rounded-xl self-start ${color === 'green' ? 'bg-white/20' : 'bg-blue-50 text-blue-500'}`}>
      <Icon size={24} />
    </div>
    {color !== 'green' && <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-50/50 rounded-full -z-0" />}
  </div>
);