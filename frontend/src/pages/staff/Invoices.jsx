import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Calendar, Filter, Eye, Printer, 
  Download, CheckCircle2, X, Loader2 
} from 'lucide-react';
import { apiGet, apiPost } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const Invoices = () => {
  const { user } = useAuth();
  
  // 1. Lấy ngày hiện tại chuẩn YYYY-MM-DD để gán vào Input Date (BẮT BUỘC FORMAT NÀY CHO INPUT)
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 2. Format hiển thị ra giao diện: LUÔN LÀ NGÀY/THÁNG/NĂM
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    
    // Trường hợp 1: Ngày lọc (YYYY-MM-DD) -> Cắt chuỗi để tránh bị lùi ngày do múi giờ
    if (dateString.length === 10 && dateString.includes('-')) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    // Trường hợp 2: Ngày giờ từ API (ISO String) -> Dùng Date Object
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // 3. Format tiền tệ VNĐ
  const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

  // --- STATE ---
  const [invoiceData, setInvoiceData] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, invoiceCount: 0 });
  const [loading, setLoading] = useState(false);
  
  // State Bộ lọc
  const [filterDate, setFilterDate] = useState(getTodayString());
  const [searchQuery, setSearchQuery] = useState('');

  // State Modal
  const [showDetail, setShowDetail] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // --- GỌI API ---
  const fetchData = async () => {
    if (!user) {
        return;
    }
    setLoading(true);
    try {
      // Ưu tiên lấy MaCN từ user, nếu không có thì fallback (để test)
      const branchId = user?.MaCN || user?.branchId || 'CN001'; 

      const [listRes, statsRes] = await Promise.all([
        apiGet(`/api/v1/sales/invoices?branchId=${branchId}&date=${filterDate}&customerName=${encodeURIComponent(searchQuery)}`),
        apiGet(`/api/v1/sales/sales-daily?branchId=${branchId}&date=${filterDate}`)
      ]);

      if (listRes.success) {
        setInvoiceData(listRes.invoices || []);
      }

      if (statsRes.success) {
        setStats({
          revenue: statsRes.data.revenue,
          invoiceCount: statsRes.data.invoiceCount
        });
      }

    } catch (error) {
      console.error("Lỗi tải dữ liệu hóa đơn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterDate, user]);

  const handleFilterClick = () => {
    fetchData();
  };

  const handleViewDetail = async (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetail(true);
    setLoadingDetails(true);
    setInvoiceDetails([]);

    try {
      const res = await apiPost('/api/v1/invoices/full', { invoiceId: invoice.MaHoaDon });
      if (res.success) {
        setInvoiceDetails(res.data);
      }
    } catch (error) {
      console.error("Lỗi chi tiết:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Lịch sử Hóa đơn</h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">
            Quản lý giao dịch và doanh thu
          </p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-white border border-gray-100 px-6 py-3 rounded-2xl font-black text-xs text-gray-500 hover:bg-gray-50 transition-all shadow-sm">
            <Download size={18} /> XUẤT BÁO CÁO
          </button>
        </div>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
           <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center font-black"><FileText size={32} /></div>
           <div>
             {/* Hiển thị ngày đã format DD/MM/YYYY */}
             <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Tổng đơn {formatDisplayDate(filterDate)}</p>
             <p className="text-3xl font-black text-gray-800">{stats.invoiceCount}</p>
           </div>
        </div>
        <div className="bg-[#34B564] p-8 rounded-[32px] text-white shadow-lg flex items-center gap-6">
           <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center font-black"><CheckCircle2 size={32} /></div>
           <div>
             <p className="text-[11px] font-black text-white/60 uppercase tracking-widest">Doanh thu thực nhận</p>
             <p className="text-3xl font-black tracking-tighter">{formatMoney(stats.revenue)}</p>
           </div>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm mb-8 flex gap-6 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Tìm theo tên khách hàng..." 
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFilterClick()}
          />
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
              <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" />
              <input 
                type="date" 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl font-black text-sm text-gray-600 outline-none focus:border-blue-500 cursor-pointer uppercase" 
              />
           </div>
           <button onClick={handleFilterClick} className="p-3.5 bg-[#0095FF] text-white rounded-2xl shadow-lg shadow-blue-100 active:scale-95 transition-all">
             <Filter size={20} />
           </button>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden font-sans min-h-[400px]">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-50">
            <tr>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Mã hóa đơn</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Khách hàng</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Thời gian</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Tổng tiền</th>
              <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Hình thức</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={6} className="py-20 text-center"><div className="flex justify-center items-center gap-2"><Loader2 className="animate-spin" /> Đang tải...</div></td></tr>
            ) : invoiceData.length === 0 ? (
               <tr>
                <td colSpan={6} className="py-20 text-center text-gray-400">
                   <p className="font-bold text-lg">Không tìm thấy dữ liệu!</p>
                   {/* Hiển thị ngày đã format DD/MM/YYYY */}
                   <p className="text-xs mt-2">Vui lòng kiểm tra ngày lọc ({formatDisplayDate(filterDate)}) hoặc chi nhánh.</p>
                </td>
              </tr>
            ) : (
              invoiceData.map((inv) => (
                <tr key={inv.MaHoaDon} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-8 py-6 font-black text-blue-500 text-sm">{inv.MaHoaDon}</td>
                  <td className="px-8 py-6 font-black text-gray-800 text-sm">{inv.TenKhachHang || 'Khách vãng lai'}</td>
                  <td className="px-8 py-6 text-sm">
                    {/* Giờ giữ nguyên */}
                    <p className="font-bold text-gray-700">{new Date(inv.NgayLap).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}</p>
                    {/* Ngày hiển thị format DD/MM/YYYY */}
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{formatDisplayDate(inv.NgayLap)}</p>
                  </td>
                  <td className="px-8 py-6 font-black text-gray-800 text-lg">{formatMoney(inv.TongTien)}</td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600">
                      {inv.HinhThucThanhToan || 'Tiền mặt'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => handleViewDetail(inv)} className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:text-[#0095FF] group-hover:bg-blue-50 transition-all">
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL CHI TIẾT */}
      {showDetail && selectedInvoice && (
        <div className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-[500px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 font-sans flex flex-col max-h-[90vh]">
            <div className="p-10 text-center border-b border-gray-50 relative shrink-0">
               <button onClick={() => setShowDetail(false)} className="absolute right-8 top-8 p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"><X size={20}/></button>
               <div className="w-20 h-20 bg-blue-50 text-[#0095FF] rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-inner"><Printer size={40} /></div>
               <h3 className="text-2xl font-black text-gray-800 tracking-tight">Chi tiết Hóa đơn</h3>
               <p className="text-sm font-bold text-gray-400 uppercase mt-1 tracking-widest">{selectedInvoice.MaHoaDon}</p>
            </div>
            
            <div className="p-10 space-y-6 overflow-y-auto custom-scrollbar">
               <div className="flex justify-between items-center"><span className="text-xs font-bold text-gray-400 uppercase">Khách hàng:</span><span className="font-black text-gray-800">{selectedInvoice.TenKhachHang || 'Vãng lai'}</span></div>
               <div className="flex justify-between items-center"><span className="text-xs font-bold text-gray-400 uppercase">Ngày:</span><span className="font-black text-gray-800">{formatDisplayDate(selectedInvoice.NgayLap)}</span></div>
               
               <div className="border-t border-dashed border-gray-200 pt-6 space-y-4">
                  {loadingDetails ? <div className="text-center"><Loader2 className="animate-spin inline"/></div> : 
                    invoiceDetails.length > 0 ? invoiceDetails.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <div>
                            <span className="text-gray-700 font-bold block">{item.TenChiTiet}</span>
                            <span className="text-[10px] text-gray-400 uppercase font-bold">{item.LoaiChiTiet} x {item.SoLuong}</span>
                        </div>
                        <span className="font-bold text-gray-700">{formatMoney(item.ThanhTien)}</span>
                      </div>
                    )) : <p className="text-center text-gray-400">Không có chi tiết</p>
                  }
               </div>

               <div className="bg-gray-50 p-6 rounded-3xl mt-8 flex justify-between items-center">
                  <span className="text-lg font-black text-gray-800">TỔNG TIỀN:</span>
                  <span className="text-3xl font-black text-[#0095FF] tracking-tighter">{formatMoney(selectedInvoice.TongTien)}</span>
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Invoices;