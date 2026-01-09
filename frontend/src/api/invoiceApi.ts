import { apiPost } from "./client";

export type InvoiceFullRow = {
  MaHoaDon: string;
  MaNVLap: string;
  NgayLap: string;
  TenDV: string;      // "Mua hàng" | "Khám bệnh" | "Tiêm phòng"
  MaPhieuDV: string;
  LoaiChiTiet: string;
  TenChiTiet: string;
  SoLuong: number | null;
  DonGia: number;
  ThanhTien: number;
};

export function getInvoiceFull(invoiceId: string) {
  // IMPORTANT: backend nên đọc req.query.invoiceId
  return apiPost('/api/v1/invoices/full', { invoiceId })
}
