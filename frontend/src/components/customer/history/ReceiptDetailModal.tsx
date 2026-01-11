// src/components/customer/history/ReceiptDetailModal.tsx
import { useMemo } from "react";
import {
  X,
  Calendar,
  User,
  MapPin,
  CreditCard,
  FileText,
  Stethoscope,
  Syringe,
  ShoppingCart,
} from "lucide-react";

export type ReceiptHeader = {
  MaHD: string;
  MaNVLap: string;
  TenNVLap: string;
  MaKH: string;
  TenKH: string;
  NgayLapDon: string;
  MaKhuyenMai: string | null;
  TongTien: number;
  HinhThucThanhToan: string;
  TenCN: string;
};

export type KhamBenhItem = {
  MaPhieuDV: string;
  MaSP: string;
  TenSP_SnapShot: string;
  DonGia_LucMua: number;
  SoLuongMua: number;
  ThanhTien: number;
};

export type MuaHangItem = KhamBenhItem;

export type TiemPhongItem = {
  MaPhieuDV: string;
  MaVacXin: string;
  TenVacXin?: string;
  LieuLuong: number | null;
  DonGia: number;
};

export type ServiceBase = {
  MaPhieuDV: string;
  LoaiDichVu: string;
  TrangThai: string;
  NgayDatDV: string;
  MaCN: string;
  TenKhachHang: string;
  TenThuCung: string | null;
  TenBacSi: string | null;
  DiaChiNhanHang?: string | null;
  items: (KhamBenhItem | TiemPhongItem | MuaHangItem)[];
};

export type ReceiptDetail = {
  header: ReceiptHeader;
  services: ServiceBase[];
};

type Props = {
  open: boolean;
  loading?: boolean;
  error?: string | null;
  data: ReceiptDetail | null;
  onClose: () => void;
};

function formatMoney(v: number) {
  const n = Number(v ?? 0);
  return n.toLocaleString("vi-VN") + " ₫";
}

function formatDateTime(iso?: string | null) {
  if (!iso) return "—";
  // Parse ISO string manually to avoid timezone conversion
  const dateStr = iso.split('T')[0]; // "2026-01-12"
  const timeStr = iso.split('T')[1]?.substring(0, 8) || "00:00:00"; // "08:03:00"
  
  const [year, month, day] = dateStr.split('-');
  const [hour, minute] = timeStr.split(':');
  
  return `${hour}:${minute} ${day}/${month}/${year}`;
}

function serviceIcon(type: string) {
  const t = (type || "").toLowerCase();
  if (t.includes("khám")) return <Stethoscope className="w-5 h-5" />;
  if (t.includes("tiêm")) return <Syringe className="w-5 h-5" />;
  if (t.includes("mua")) return <ShoppingCart className="w-5 h-5" />;
  return <FileText className="w-5 h-5" />;
}

// Hàm tính tổng tiền từng phiếu dựa trên items
function calcServiceTotal(s: ServiceBase) {
  const type = (s.LoaiDichVu || "").toLowerCase();

  // Khám bệnh / Mua hàng
  if (type.includes("khám") || type.includes("mua")) {
    const rows = (s.items || []) as Array<KhamBenhItem | MuaHangItem>;
    return rows.reduce((sum, it) => sum + Number(it.ThanhTien ?? 0), 0);
  }

  // Tiêm phòng
  if (type.includes("tiêm")) {
    const rows = (s.items || []) as TiemPhongItem[];
    return rows.reduce((sum, it) => {
      const dose = Number(it.LieuLuong ?? 1);
      return sum + Number(it.DonGia ?? 0) * dose;
    }, 0);
  }
  return 0;
}

// Component con: Render item Khám bệnh
function RenderKhamBenhItems({ items }: { items: KhamBenhItem[] }) {
  if (!items?.length) return <div className="p-4 text-sm text-gray-500 italic">Không có đơn thuốc/dịch vụ đi kèm.</div>;
  return (
    <div className="border-t border-gray-100 bg-white">
      <div className="bg-emerald-50/50 px-4 py-2 border-b border-gray-100 flex items-center gap-2">
        <FileText className="w-4 h-4 text-emerald-600" />
        <span className="text-sm font-semibold text-emerald-800">Chi tiết đơn thuốc / Dịch vụ</span>
      </div>
      <div className="divide-y divide-gray-100">
        {items.map((it, idx) => (
          <div key={idx} className="p-3 flex justify-between items-start text-sm">
            <div>
              <div className="font-medium text-gray-900">{it.TenSP_SnapShot}</div>
              <div className="text-gray-500 text-xs">Mã: {it.MaSP}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-500 text-xs">{formatMoney(it.DonGia_LucMua)} x {it.SoLuongMua}</div>
              <div className="font-semibold text-gray-900">{formatMoney(it.ThanhTien)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Component con: Render item Mua hàng
function RenderMuaHangItems({ items }: { items: MuaHangItem[] }) {
  if (!items?.length) return <div className="p-4 text-sm text-gray-500 italic">Không có sản phẩm.</div>;
  return (
    <div className="border-t border-gray-100 bg-white">
      <div className="bg-blue-50/50 px-4 py-2 border-b border-gray-100 flex items-center gap-2">
        <ShoppingCart className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-semibold text-blue-800">Sản phẩm đã mua</span>
      </div>
      <div className="divide-y divide-gray-100">
        {items.map((it, idx) => (
          <div key={idx} className="p-3 flex justify-between items-start text-sm">
            <div>
              <div className="font-medium text-gray-900">{it.TenSP_SnapShot}</div>
              <div className="text-gray-500 text-xs">Mã: {it.MaSP}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-500 text-xs">{formatMoney(it.DonGia_LucMua)} x {it.SoLuongMua}</div>
              <div className="font-semibold text-gray-900">{formatMoney(it.ThanhTien)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Component con: Render item Tiêm phòng
function RenderTiemPhongItems({ items }: { items: TiemPhongItem[] }) {
  if (!items?.length) return <div className="p-4 text-sm text-gray-500 italic">Không có thông tin vắc-xin.</div>;
  return (
    <div className="border-t border-gray-100 bg-white">
      <div className="bg-purple-50/50 px-4 py-2 border-b border-gray-100 flex items-center gap-2">
        <Syringe className="w-4 h-4 text-purple-600" />
        <span className="text-sm font-semibold text-purple-800">Chi tiết tiêm phòng</span>
      </div>
      <div className="divide-y divide-gray-100">
        {items.map((it, idx) => {
          const dose = it.LieuLuong ?? 1;
          const total = (it.DonGia ?? 0) * dose;
          return (
            <div key={idx} className="p-3 flex justify-between items-start text-sm">
              <div>
                <div className="font-medium text-gray-900">Vắc-xin: {it.TenVacXin || it.MaVacXin}</div>
                <div className="text-gray-500 text-xs">Liều lượng: {dose}ml</div>
              </div>
              <div className="text-right">
                <div className="text-gray-500 text-xs">{formatMoney(it.DonGia)} / ml</div>
                <div className="font-semibold text-gray-900">{formatMoney(total)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Component chính điều phối việc render item
function RenderServiceContent({ s }: { s: ServiceBase }) {
  const type = (s.LoaiDichVu || "").toLowerCase();
  if (type.includes("khám")) return <RenderKhamBenhItems items={s.items as KhamBenhItem[]} />;
  if (type.includes("tiêm")) return <RenderTiemPhongItems items={s.items as TiemPhongItem[]} />;
  if (type.includes("mua")) return <RenderMuaHangItems items={s.items as MuaHangItem[]} />;

  // Fallback nếu có loại dịch vụ lạ
  return <div className="p-4 text-sm text-gray-500">Chi tiết dịch vụ chưa được hỗ trợ hiển thị.</div>;
}

export default function ReceiptDetailModal({ open, loading, error, data, onClose }: Props) {
  if (!open) return null;

  const header = data?.header;
  const services = data?.services ?? [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold">Chi tiết hóa đơn</h2>
            <p className="text-blue-100 text-sm mt-0.5">#{header?.MaHD ?? "..."}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="overflow-y-auto p-6 space-y-6 bg-gray-50 flex-1">
          {loading && (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              Đang tải dữ liệu...
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center">
              {error}
            </div>
          )}

          {!loading && !error && data && header && (
            <>
              {/* Thông tin chung Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Calendar className="w-5 h-5" /></div>
                    <div>
                      <div className="text-xs text-gray-500">Ngày lập</div>
                      <div className="font-medium text-gray-900">{formatDateTime(header.NgayLapDon)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg"><User className="w-5 h-5" /></div>
                    <div>
                      <div className="text-xs text-gray-500">Nhân viên lập</div>
                      <div className="font-medium text-gray-900">{header.TenNVLap}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><MapPin className="w-5 h-5" /></div>
                    <div>
                      <div className="text-xs text-gray-500">Chi nhánh</div>
                      <div className="font-medium text-gray-900">{header.TenCN}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><CreditCard className="w-5 h-5" /></div>
                    <div>
                      <div className="text-xs text-gray-500">Thanh toán</div>
                      <div className="font-medium text-gray-900">{header.HinhThucThanhToan}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tổng tiền */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-5 rounded-xl flex items-center justify-between">
                <span className="text-blue-800 font-semibold">Tổng thành tiền</span>
                <span className="text-3xl font-black text-blue-700">{formatMoney(header.TongTien)}</span>
              </div>

              {/* Danh sách phiếu dịch vụ */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 text-lg">Danh sách phiếu dịch vụ ({services.length})</h3>

                {services.length === 0 && <div className="text-gray-500 italic">Không có dịch vụ nào trong hóa đơn này.</div>}

                {services.map((s, index) => {
                  const subTotal = calcServiceTotal(s);
                  return (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {/* Header của phiếu */}
                      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-gray-600">
                            {serviceIcon(s.LoaiDichVu)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 flex items-center gap-2">
                              {s.LoaiDichVu}
                              <span className="px-2 py-0.5 rounded text-[10px] bg-gray-100 text-gray-500 border border-gray-200 font-mono">
                                {s.MaPhieuDV}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1 space-y-0.5">
                              {s.TenThuCung && <p>Thú cưng: <span className="font-medium text-gray-700">{s.TenThuCung}</span></p>}
                              {s.TenBacSi && <p>Bác sĩ: <span className="font-medium text-gray-700">{s.TenBacSi}</span></p>}
                              {s.DiaChiNhanHang && <p>Địa chỉ nhận hàng: <span className="font-medium text-gray-700">{s.DiaChiNhanHang}</span></p>}
                            </div>
                          </div>
                        </div>
                        <div className="text-right pl-12 md:pl-0">
                          <div className="text-xs text-gray-400">Tạm tính phiếu</div>
                          <div className="text-lg font-bold text-gray-900">{formatMoney(subTotal)}</div>
                        </div>
                      </div>

                      {/* Content của phiếu */}
                      <RenderServiceContent s={s} />
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white flex justify-end shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}