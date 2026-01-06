import React, { useState, useMemo } from 'react';
import { MOCK_DOCTOR_STATS, REVENUE_BREAKDOWN } from '../../services/mockDataQL';
import { Calendar, DollarSign, Users, Stethoscope, Syringe, ShoppingBag, TrendingUp } from 'lucide-react';
import { VisitStat } from '../../types';

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'month' | 'year'>('month');
  // Mặc định lấy ngày hiện tại
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Format currency
  const formatVND = (value: number) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const totalRevenue = REVENUE_BREAKDOWN.KhamBenh + REVENUE_BREAKDOWN.TiemPhong + REVENUE_BREAKDOWN.BanHang;

  // Logic tạo dữ liệu giả dựa trên bộ lọc
  const visitStats = useMemo(() => {
    const stats: VisitStat[] = [];
    const dateObj = new Date(selectedDate);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    if (timeRange === 'year') {
      // Thống kê theo 12 tháng của năm
      for (let i = 1; i <= 12; i++) {
        stats.push({
          ThoiGian: `Tháng ${i}/${year}`,
          LuotKham: Math.floor(Math.random() * 300) + 100, // Random số liệu
          LuotTiem: Math.floor(Math.random() * 200) + 50,
        });
      }
    } else if (timeRange === 'month') {
      // Thống kê theo từng ngày trong tháng
      // Lấy số ngày trong tháng
      const daysInMonth = new Date(year, month, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        stats.push({
          ThoiGian: `${String(i).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`,
          LuotKham: Math.floor(Math.random() * 20) + 5,
          LuotTiem: Math.floor(Math.random() * 15) + 2,
        });
      }
    } else {
      // Thống kê cụ thể ngày đó (chia theo buổi hoặc chỉ hiện 1 dòng tổng)
      // Ở đây mình hiện 1 dòng tổng kết ngày đó
      stats.push({
        ThoiGian: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`,
        LuotKham: Math.floor(Math.random() * 30) + 10,
        LuotTiem: Math.floor(Math.random() * 20) + 5,
      });
    }
    return stats;
  }, [timeRange, selectedDate]);

  const getLabel = () => {
    const dateObj = new Date(selectedDate);
    if (timeRange === 'year') return `Năm ${dateObj.getFullYear()}`;
    if (timeRange === 'month') return `Tháng ${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
    return `Ngày ${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
  }

  return (
    <div className="space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tổng quan Chi nhánh CN01</h1>
          <p className="text-gray-500">Báo cáo tài chính và hoạt động</p>
        </div>
        
        <div className="flex items-center space-x-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setTimeRange('day')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${timeRange === 'day' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Ngày
            </button>
            <button
               onClick={() => setTimeRange('month')}
               className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${timeRange === 'month' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Tháng
            </button>
            <button
               onClick={() => setTimeRange('year')}
               className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${timeRange === 'year' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Năm
            </button>
          </div>
          <div className="h-6 w-px bg-gray-300"></div>
          <input 
            type={timeRange === 'day' ? 'date' : timeRange === 'month' ? 'month' : 'number'} 
            className="border-none focus:ring-0 text-sm text-gray-700 bg-transparent outline-none"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min="2000" max="2099" step="1"
          />
        </div>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500 bg-opacity-30 rounded-lg">
              <DollarSign className="text-white" size={24} />
            </div>
            <span className="text-xs font-medium bg-blue-500 bg-opacity-30 px-2 py-1 rounded">Tổng cộng</span>
          </div>
          <p className="text-blue-100 text-sm font-medium mb-1">Tổng doanh thu</p>
          <p className="text-2xl font-bold">{formatVND(totalRevenue)}</p>
        </div>

        {/* Exam Revenue */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <div className="flex items-center space-x-3 mb-2">
             <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
               <Stethoscope size={20} />
             </div>
             <p className="text-gray-500 text-sm font-medium">Doanh thu Khám</p>
           </div>
           <p className="text-xl font-bold text-gray-800 mt-2">{formatVND(REVENUE_BREAKDOWN.KhamBenh)}</p>
           <div className="w-full bg-gray-100 h-1.5 mt-3 rounded-full overflow-hidden">
             <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${(REVENUE_BREAKDOWN.KhamBenh / totalRevenue) * 100}%` }}></div>
           </div>
        </div>

        {/* Vaccine Revenue */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <div className="flex items-center space-x-3 mb-2">
             <div className="p-2 bg-green-100 text-green-600 rounded-lg">
               <Syringe size={20} />
             </div>
             <p className="text-gray-500 text-sm font-medium">Doanh thu Tiêm</p>
           </div>
           <p className="text-xl font-bold text-gray-800 mt-2">{formatVND(REVENUE_BREAKDOWN.TiemPhong)}</p>
           <div className="w-full bg-gray-100 h-1.5 mt-3 rounded-full overflow-hidden">
             <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(REVENUE_BREAKDOWN.TiemPhong / totalRevenue) * 100}%` }}></div>
           </div>
        </div>

        {/* Product Sales Revenue */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
           <div className="flex items-center space-x-3 mb-2">
             <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
               <ShoppingBag size={20} />
             </div>
             <p className="text-gray-500 text-sm font-medium">Sản phẩm bán ra</p>
           </div>
           <p className="text-xl font-bold text-gray-800 mt-2">{formatVND(REVENUE_BREAKDOWN.BanHang)}</p>
           <div className="w-full bg-gray-100 h-1.5 mt-3 rounded-full overflow-hidden">
             <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${(REVENUE_BREAKDOWN.BanHang / totalRevenue) * 100}%` }}></div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Doctor Stats Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-800 flex items-center">
              <Users size={18} className="mr-2 text-blue-600" />
              Doanh thu theo Bác sĩ
            </h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Bác sĩ</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Số ca khám</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Doanh thu tạo ra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_DOCTOR_STATS.map((doc) => (
                <tr key={doc.MaNV} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{doc.HoTen}</span>
                      <span className="text-xs text-gray-500">{doc.MaNV}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                     <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                       {doc.SoCaKham}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-800">
                    {formatVND(doc.DoanhThu)}
                  </td>
                </tr>
              ))}
              {/* Summary Row */}
               <tr className="bg-gray-50 font-bold text-gray-900">
                  <td className="px-6 py-3 text-sm">Tổng cộng</td>
                  <td className="px-6 py-3 text-center text-sm">{MOCK_DOCTOR_STATS.reduce((a, b) => a + b.SoCaKham, 0)}</td>
                  <td className="px-6 py-3 text-right text-sm">{formatVND(MOCK_DOCTOR_STATS.reduce((a, b) => a + b.DoanhThu, 0))}</td>
                </tr>
            </tbody>
          </table>
        </div>

        {/* Visit Stats Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
            <h3 className="font-bold text-gray-800 flex items-center">
              <TrendingUp size={18} className="mr-2 text-green-600" />
              Thống kê lượt Khám & Tiêm ({getLabel()})
            </h3>
          </div>
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-white border-b border-gray-100 sticky top-0 shadow-sm">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Thời gian</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center text-purple-600">Lượt Khám</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center text-green-600">Lượt Tiêm</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Tổng lượt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visitStats.map((stat, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{stat.ThoiGian}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-800">{stat.LuotKham}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-800">{stat.LuotTiem}</td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">{stat.LuotKham + stat.LuotTiem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 border-t border-gray-200 shrink-0">
            <table className="w-full text-left">
              <tbody>
                <tr className="font-bold text-gray-900">
                    <td className="px-6 py-3 text-sm w-1/4">Tổng cộng</td>
                    <td className="px-6 py-3 text-center text-sm w-1/4">{visitStats.reduce((a, b) => a + b.LuotKham, 0)}</td>
                    <td className="px-6 py-3 text-center text-sm w-1/4">{visitStats.reduce((a, b) => a + b.LuotTiem, 0)}</td>
                    <td className="px-6 py-3 text-right text-sm w-1/4">{visitStats.reduce((a, b) => a + b.LuotKham + b.LuotTiem, 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;