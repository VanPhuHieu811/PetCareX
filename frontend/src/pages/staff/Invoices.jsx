import React, { useState } from 'react';
import StaffLayout from '../../layouts/StaffLayout';
import { 
  FileText, Search, Calendar, Filter, Eye, Printer, 
  Download, ChevronRight, CheckCircle2, Clock, X 
} from 'lucide-react';

const Invoices = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  // Dữ liệu mẫu hóa đơn
  const invoiceData = [
    { id: 'HD-9901', customer: 'Nguyễn Văn An', date: '01/01/2026', time: '14:30', amount: '520.000đ', status: 'Đã thanh toán', method: 'Tiền mặt' },
    { id: 'HD-9902', customer: 'Trần Thị Bình', date: '01/01/2026', time: '15:15', amount: '1.250.000đ', status: 'Đã thanh toán', method: 'Chuyển khoản' },
    { id: 'HD-9903', customer: 'Lê Hoàng Cường', date: '31/12/2025', time: '09:00', amount: '85.000đ', status: 'Chờ thanh toán', method: '---' },
  ];

  const handleViewDetail = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetail(true);
  };

  return (
    <StaffLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Lịch sử Hóa đơn</h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Quản lý giao dịch và doanh thu</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-white border border-gray-100 px-6 py-3 rounded-2xl font-black text-xs text-gray-500 hover:bg-gray-50 transition-all shadow-sm">
            <Download size={18} /> XUẤT BÁO CÁO
          </button>
        </div>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
           <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center font-black"><FileText size={32} /></div>
           <div>
             <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Tổng đơn hôm nay</p>
             <p className="text-3xl font-black text-gray-800">42</p>
           </div>
        </div>
        <div className="bg-[#34B564] p-8 rounded-[32px] text-white shadow-lg flex items-center gap-6">
           <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center font-black"><CheckCircle2 size={32} /></div>
           <div>
             <p className="text-[11px] font-black text-white/60 uppercase tracking-widest">Doanh thu thực nhận</p>
             <p className="text-3xl font-black tracking-tighter">15.250.000đ</p>
           </div>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
           <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center font-black"><Clock size={32} /></div>
           <div>
             <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Chờ thanh toán</p>
             <p className="text-3xl font-black text-gray-800">03</p>
           </div>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm mb-8 flex gap-6 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Tìm theo mã hóa đơn..." className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
        </div>
        <div className="flex items-center gap-3">
           {/* Đã sửa thành input type="date" để bấm được */}
           <div className="relative">
              <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" />
              <input 
                type="date" 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl font-black text-sm text-gray-600 outline-none focus:border-blue-500 cursor-pointer" 
              />
           </div>
           <button className="p-3.5 bg-[#0095FF] text-white rounded-2xl shadow-lg shadow-blue-100 active:scale-95 transition-all">
             <Filter size={20} />
           </button>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden font-sans">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-50">
            <tr>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Mã hóa đơn</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Khách hàng</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Thời gian</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Tổng tiền</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {invoiceData.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50/50 transition-all group">
                <td className="px-8 py-6 font-black text-blue-500 text-sm">{inv.id}</td>
                <td className="px-8 py-6 font-black text-gray-800 text-sm">{inv.customer}</td>
                <td className="px-8 py-6 text-sm">
                  <p className="font-bold text-gray-700">{inv.time}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{inv.date}</p>
                </td>
                <td className="px-8 py-6 font-black text-gray-800 text-lg">{inv.amount}</td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${inv.status === 'Đã thanh toán' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button onClick={() => handleViewDetail(inv)} className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:text-[#0095FF] group-hover:bg-blue-50 transition-all"><Eye size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CHI TIẾT HÓA ĐƠN */}
      {showDetail && (
        <div className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-[500px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 font-sans">
            <div className="p-10 text-center border-b border-gray-50 relative">
               <button onClick={() => setShowDetail(false)} className="absolute right-8 top-8 p-2 bg-gray-50 rounded-full text-gray-400"><X size={20}/></button>
               <div className="w-20 h-20 bg-blue-50 text-[#0095FF] rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-inner"><Printer size={40} /></div>
               <h3 className="text-2xl font-black text-gray-800 tracking-tight">Chi tiết Hóa đơn</h3>
               <p className="text-sm font-bold text-gray-400 uppercase mt-1 tracking-widest">{selectedInvoice?.id} • {selectedInvoice?.method}</p>
            </div>
            <div className="p-10 space-y-6">
               <div className="flex justify-between items-center"><span className="text-xs font-bold text-gray-400 uppercase">Khách hàng:</span><span className="font-black text-gray-800">{selectedInvoice?.customer}</span></div>
               <div className="flex justify-between items-center"><span className="text-xs font-bold text-gray-400 uppercase">Ngày giao dịch:</span><span className="font-black text-gray-800">{selectedInvoice?.date}</span></div>
               <div className="border-t border-dashed border-gray-200 pt-6 space-y-4">
                  <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium italic">Pate Ciao x 5</span><span className="font-bold text-gray-700">175.000đ</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500 font-medium italic">Gói tiêm Puppy Standard</span><span className="font-bold text-gray-700">1.250.000đ</span></div>
               </div>
               <div className="bg-gray-50 p-6 rounded-3xl mt-8 flex justify-between items-center">
                  <span className="text-lg font-black text-gray-800">TỔNG TIỀN:</span>
                  <span className="text-3xl font-black text-[#0095FF] tracking-tighter">{selectedInvoice?.amount}</span>
               </div>
            </div>
            <div className="p-10 bg-gray-50/50 flex gap-4">
              <button className="flex-1 py-5 bg-white border border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-500">TẢI VỀ PDF</button>
              <button className="flex-[2] py-5 bg-[#0095FF] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 flex items-center justify-center gap-3">
                <Printer size={18} /> IN HÓA ĐƠN
              </button>
            </div>
          </div>
        </div>
      )}
    </StaffLayout>
  );
};

export default Invoices;