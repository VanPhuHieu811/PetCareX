// src/pages/customer/Profile.tsx
import { useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";
import {
  FileText,
  Package,
  User,
  ShieldCheck,
  Plus,
  Mail,
  Phone,
  Edit2,
  Save,
  X,
  RefreshCcw,
  AlertCircle,
} from "lucide-react";

import MedicalRecordDetailModal from "../../components/customer/history/MedicalRecordDetailModal";
import AddPetModal, { PetFormData } from "../../components/customer/pets/AddPetModal";
import PetList from "../../components/customer/pets/PetList";
import PetMedicalHistory from "../../components/customer/pets/PetMedicalHistory";
import { MedicalRecord } from "../../types";

import { getCustomerMe, getCustomerReceipts, updateCustomerMe } from "../../api/customerApi";
import { getMyPets, createPet, getPetExams, getPetVaccinations } from "../../api/petApi";
import { getInvoiceFull, InvoiceFullRow } from "../../api/invoiceApi";

// ==========================
// Types: minimal
// ==========================
type Tab = "orders" | "pets" | "info";

type CustomerMe = {
  MaKH?: string;
  MaND?: string;
  HoTen: string;
  Email: string;
  SDT?: string | null;
  CCCD?: string | null;
  NgaySinh?: string | null;
  GioiTinh?: string | null;
  VaiTro?: string;
  TrangThai?: string;
  LoaiTV?: string;
  DiemTichLuy?: number;
};

type ReceiptRow = {
  MaHoaDon?: string;
  MaHD?: string;
  NgayLap?: string;
  NgayLapDon?: string;
  TongTien?: number;
  HinhThucThanhToan?: string;
  TenCN?: string;
  TrangThai?: string;
};

type PetRow = {
  MaTC: string;
  TenTC: string;
  MaGiong?: string;
  NgaySinh?: string;
  GioiTinh?: string;
  TinhTrangSucKhoe?: string | null;
  MaKH?: string;
};

type ExamRow = {
  MaPhieuDV: string;
  NgayKham: string;
  MoTaTrieuChung: string | null;
  MoTaChuanDoan: string | null;
  NgayTaiKham: string | null;
  TongTienDonThuoc: number | null;
  TenBacSi: string | null;
};

type VaccinationRow = {
  MaPhieuDV: string;
  NgayTiem: string;
  TenVacXin: string;
  LieuLuong: string | number;
  DonGia: number;
  TenBacSi: string | null;
};

// ==========================
// UI helpers
// ==========================
function formatVND(n?: number | null) {
  const val = typeof n === "number" ? n : 0;
  return val.toLocaleString("vi-VN") + "đ";
}

function safeDate(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN");
}

function normalizeList<T = any>(payload: any): T[] {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (payload && payload.data && Array.isArray(payload.data.data)) return payload.data.data;
  return [];
}

// ==========================
// Invoice FULL -> grouped view for UI
// ==========================
type InvoiceFullGroup = {
  MaPhieuDV: string;
  TenDV: string;
  items: InvoiceFullRow[];
};

function groupInvoiceRows(rows: InvoiceFullRow[]): InvoiceFullGroup[] {
  const map = new Map<string, InvoiceFullGroup>();

  for (const r of rows) {
    const key = r.MaPhieuDV || "UNKNOWN";
    if (!map.has(key)) {
      map.set(key, {
        MaPhieuDV: r.MaPhieuDV,
        TenDV: r.TenDV,
        items: [],
      });
    }
    map.get(key)!.items.push(r);
  }

  return Array.from(map.values());
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState<Tab>("orders");

  // global loading/error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // customer
  const [customer, setCustomer] = useState<CustomerMe | null>(null);

  // editable info
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [userInfo, setUserInfo] = useState({
    HoTen: "",
    Email: "",
    SDT: "",
    CCCD: "",
    NgaySinh: "",
    GioiTinh: "",
  });
  const [savingInfo, setSavingInfo] = useState(false);

  // receipts
  const [receipts, setReceipts] = useState<ReceiptRow[]>([]);

  // invoice detail modal (NEW)
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [invoiceRows, setInvoiceRows] = useState<InvoiceFullRow[] | null>(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  // pets
  const [pets, setPets] = useState<PetRow[]>([]);
  const [petsLoading, setPetsLoading] = useState(false);

  // pet history
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [petHistoryLoading, setPetHistoryLoading] = useState(false);

  // medical record modal
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // add pet modal
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [addingPet, setAddingPet] = useState(false);

  // ==========================
  // Load initial data
  // ==========================
  const loadAll = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1) me
      const meRes = await getCustomerMe();
      const me: CustomerMe = (meRes as any)?.data ?? meRes;
      setCustomer(me);

      setUserInfo({
        HoTen: me?.HoTen || "",
        Email: me?.Email || "",
        SDT: (me?.SDT as any) || "",
        CCCD: (me?.CCCD as any) || "",
        NgaySinh: me?.NgaySinh ? String(me.NgaySinh).slice(0, 10) : "",
        GioiTinh: (me?.GioiTinh as any) || "",
      });

      // 2) receipts + pets in parallel
      const [rRes, pRes] = await Promise.all([getCustomerReceipts(), getMyPets()]);

      const rData = (rRes as any)?.data ?? rRes;
      setReceipts(normalizeList<ReceiptRow>(rData));

      setPets(normalizeList<PetRow>(pRes));
    } catch (e: any) {
      setError(e?.message || "Có lỗi xảy ra khi tải dữ liệu.");
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================
  // Invoice details via /api/v1/invoices/full
  // ==========================
  const openReceipt = async (receiptId: string) => {
    setSelectedReceiptId(receiptId);
    setInvoiceRows(null);
    setInvoiceLoading(true);
    setError(null);

    try {
      const rs = await getInvoiceFull(receiptId);
      const rows: InvoiceFullRow[] = (rs as any)?.data ?? rs;

      if (!Array.isArray(rows) || rows.length === 0) {
        setInvoiceRows([]);
      } else {
        setInvoiceRows(rows);
      }
    } catch (e: any) {
      setError(e?.message || "Không lấy được chi tiết hóa đơn (invoices/full)");
      setInvoiceRows(null);
    } finally {
      setInvoiceLoading(false);
    }
  };

  const closeReceipt = () => {
    setSelectedReceiptId(null);
    setInvoiceRows(null);
    setInvoiceLoading(false);
  };

  // ==========================
  // Pet history
  // ==========================
  const loadPetHistory = async (petId: string) => {
    setPetHistoryLoading(true);
    setMedicalRecords([]);
    setError(null);

    try {
      const [examRes, vxRes] = await Promise.all([getPetExams(petId), getPetVaccinations(petId)]);

      const examRows: ExamRow[] = normalizeList<ExamRow>((examRes as any)?.data ?? examRes);
      const vxRows: VaccinationRow[] = normalizeList<VaccinationRow>((vxRes as any)?.data ?? vxRes);

      const pet = pets.find((p) => p.MaTC === petId);

      const mappedExams: MedicalRecord[] = examRows.map((x) => ({
        id: x.MaPhieuDV,
        date: x.NgayKham,
        petId,
        petName: pet?.TenTC || "Thú cưng",
        serviceType: "Khám bệnh",
        doctorName: x.TenBacSi || "Bác sĩ",
        diagnosis: x.MoTaChuanDoan || "—",
        symptoms: x.MoTaTrieuChung || "—",
        nextAppointment: x.NgayTaiKham || undefined,
        prescription: [],
      }));

      const mappedVaccines: MedicalRecord[] = vxRows.map((v) => ({
        id: v.MaPhieuDV,
        date: v.NgayTiem,
        petId,
        petName: pet?.TenTC || "Thú cưng",
        serviceType: "Tiêm phòng",
        doctorName: v.TenBacSi || "Bác sĩ",
        diagnosis: "Tiêm phòng",
        symptoms: "—",
        vaccines: [{ name: v.TenVacXin, batch: "" }],
      }));

      const all = [...mappedExams, ...mappedVaccines].sort((a, b) => {
        const ta = new Date(a.date).getTime();
        const tb = new Date(b.date).getTime();
        return tb - ta;
      });

      setMedicalRecords(all);
    } catch (e: any) {
      setError(e?.message || "Không lấy được lịch sử khám/tiêm");
    } finally {
      setPetHistoryLoading(false);
    }
  };

  // ==========================
  // Record modal
  // ==========================
  const handleRecordClick = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsRecordModalOpen(true);
  };

  // ==========================
  // Add pet (FIXED LOGIC)
  // ==========================
  const handleAddPet = async (data: PetFormData) => {
    setAddingPet(true);
    setError(null);

    try {
      // Backend yêu cầu TenTC, MaGiong, NgaySinh, GioiTinh
      await createPet({
        TenTC: data.name,
        MaGiong: data.breedId,
        NgaySinh: data.dob,
        GioiTinh: data.gender, // "Đực" | "Cái"
        TinhTrangSucKhoe: data.healthStatus || null,
      });

      // refresh pets list
      setPetsLoading(true);
      const pRes = await getMyPets();
      setPets(normalizeList<PetRow>(pRes));
      setPetsLoading(false);

      // close modal ONLY HERE (parent)
      setIsAddPetModalOpen(false);
    } catch (e: any) {
      setError(e?.message || "Thêm thú cưng thất bại");
    } finally {
      setAddingPet(false);
    }
  };

  // ==========================
  // Save customer info
  // ==========================
  const handleSaveInfo = async () => {
    setSavingInfo(true);
    setError(null);

    try {
      const rs = await updateCustomerMe({
        HoTen: userInfo.HoTen,
        NgaySinh: userInfo.NgaySinh || null,
        GioiTinh: userInfo.GioiTinh || null,
        SDT: userInfo.SDT || null,
        CCCD: userInfo.CCCD || null,
      });

      const updated: CustomerMe = (rs as any)?.data ?? rs;
      setCustomer(updated);

      setUserInfo({
        HoTen: updated?.HoTen || "",
        Email: updated?.Email || userInfo.Email || "",
        SDT: (updated?.SDT as any) || "",
        CCCD: (updated?.CCCD as any) || "",
        NgaySinh: updated?.NgaySinh ? String(updated.NgaySinh).slice(0, 10) : userInfo.NgaySinh,
        GioiTinh: (updated?.GioiTinh as any) || "",
      });

      setIsEditingInfo(false);
    } catch (e: any) {
      setError(e?.message || "Cập nhật thất bại");
    } finally {
      setSavingInfo(false);
    }
  };

  const handleCancelEdit = () => {
    if (!customer) return;
    setUserInfo({
      HoTen: customer?.HoTen || "",
      Email: customer?.Email || "",
      SDT: (customer?.SDT as any) || "",
      CCCD: (customer?.CCCD as any) || "",
      NgaySinh: customer?.NgaySinh ? String(customer.NgaySinh).slice(0, 10) : "",
      GioiTinh: (customer?.GioiTinh as any) || "",
    });
    setIsEditingInfo(false);
  };

  // ==========================
  // UI computed
  // ==========================
  const avatarUrl = useMemo(() => {
    const seed = customer?.MaKH || customer?.MaND || customer?.Email || "me";
    return `https://i.pravatar.cc/150?u=${encodeURIComponent(seed)}`;
  }, [customer]);

  const memberType = useMemo(() => {
    const loai = (customer as any)?.LoaiTV;
    return loai || "VIP";
  }, [customer]);

  const loyaltyPoints = useMemo(() => {
    const v = Number((customer as any)?.DiemTichLuy ?? 0);
    return Number.isFinite(v) ? v : 0;
  }, [customer]);

  const uiPets = useMemo(() => {
    return pets.map((p) => ({
      id: p.MaTC,
      name: p.TenTC,
      species: "—",
      breed: p.MaGiong || "—",
      dob: p.NgaySinh ? String(p.NgaySinh).slice(0, 10) : "",
      gender: (p.GioiTinh as any) || "—",
      weight: 0,
      avatar:
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=300",
    }));
  }, [pets]);

  // ==========================
  // Loading / empty states
  // ==========================
  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 flex items-center gap-3">
          <RefreshCcw className="w-5 h-5 animate-spin" />
          <div className="font-medium text-gray-800">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <div className="font-bold text-gray-900">Không lấy được thông tin khách hàng</div>
            <div className="text-sm text-gray-600 mt-1">{error || "Vui lòng đăng nhập lại."}</div>
            <button
              onClick={loadAll}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              <RefreshCcw className="w-4 h-4" />
              Thử lại
            </button>
            <div className="text-xs text-gray-500 mt-3">
              Lưu ý: AuthContext của bạn đang lưu token ở <b>petcare_token</b>.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================
  // Main render
  // ==========================
  const invoiceGroups = invoiceRows ? groupInvoiceRows(invoiceRows) : [];

  const invoiceHeader = invoiceRows && invoiceRows.length > 0 ? invoiceRows[0] : null;
  const invoiceTotal =
    invoiceRows && invoiceRows.length > 0
      ? invoiceRows.reduce((sum, r) => sum + (Number(r.ThanhTien) || 0), 0)
      : 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        {/* User Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="relative inline-block">
            <img
              src={avatarUrl}
              alt={customer.HoTen}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-50"
            />
            <div
              className="absolute bottom-2 right-0 bg-yellow-400 text-white p-1 rounded-full border-2 border-white"
              title={memberType}
            >
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900">{customer.HoTen}</h2>
          <p className="text-sm text-gray-500">{customer.Email}</p>

          <div className="mt-4 inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
            {loyaltyPoints.toLocaleString("vi-VN")} điểm thưởng
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm">
            <div className="font-bold mb-1">Có lỗi</div>
            <div>{error}</div>
          </div>
        )}

        {/* Menu */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setActiveTab("orders")}
            className={clsx(
              "w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4",
              activeTab === "orders"
                ? "bg-blue-50 border-blue-600 text-blue-700"
                : "border-transparent text-gray-600 hover:bg-gray-50"
            )}
          >
            <Package className="w-5 h-5" /> Lịch sử hóa đơn
          </button>

          <button
            onClick={() => {
              setActiveTab("pets");
              setSelectedPetId(null);
              setMedicalRecords([]);
            }}
            className={clsx(
              "w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4",
              activeTab === "pets"
                ? "bg-blue-50 border-blue-600 text-blue-700"
                : "border-transparent text-gray-600 hover:bg-gray-50"
            )}
          >
            <FileText className="w-5 h-5" /> Hồ sơ thú cưng
          </button>

          <button
            onClick={() => setActiveTab("info")}
            className={clsx(
              "w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4",
              activeTab === "info"
                ? "bg-blue-50 border-blue-600 text-blue-700"
                : "border-transparent text-gray-600 hover:bg-gray-50"
            )}
          >
            <User className="w-5 h-5" /> Thông tin cá nhân
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="lg:col-span-3">
        {/* ==================== ORDERS ==================== */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-gray-900">Lịch sử hóa đơn</h2>
            </div>

            {receipts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-600">
                Chưa có hóa đơn nào.
              </div>
            ) : (
              <div className="space-y-4">
                {receipts.map((r) => {
                  const id = (r.MaHoaDon || r.MaHD || "") as string;
                  const date = r.NgayLapDon || r.NgayLap || "";
                  const total = r.TongTien ?? 0;

                  return (
                    <button
                      key={id}
                      onClick={() => openReceipt(id)}
                      className="w-full text-left bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:border-blue-200 transition"
                    >
                      <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <span className="text-sm text-gray-500">
                            Mã hóa đơn:{" "}
                            <span className="font-mono text-gray-900 font-semibold">#{id}</span>
                          </span>
                          <div className="text-xs text-gray-400 mt-1">
                            {safeDate(date)} {r.TenCN ? `• ${r.TenCN}` : ""}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-blue-600">{formatVND(total)}</span>
                        </div>
                      </div>

                      <div className="px-6 py-4 text-sm text-gray-600">
                        Bấm để xem chi tiết hóa đơn
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Invoice details modal (NEW) */}
            {selectedReceiptId && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                onClick={closeReceipt}
              >
                <div
                  className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">Chi tiết hóa đơn</div>
                      <div className="text-blue-100 mt-1">#{selectedReceiptId}</div>
                    </div>
                    <button onClick={closeReceipt} className="p-2 hover:bg-blue-800 rounded-full">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    {invoiceLoading && (
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center gap-2">
                        <RefreshCcw className="w-4 h-4 animate-spin" />
                        <span className="text-gray-700 font-medium">Đang tải chi tiết...</span>
                      </div>
                    )}

                    {!invoiceLoading && invoiceRows && (
                      <>
                        {invoiceRows.length === 0 ? (
                          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-700">
                            Không có dữ liệu chi tiết hóa đơn.
                          </div>
                        ) : (
                          <>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="bg-gray-50 p-4 rounded-xl">
                                <div className="text-sm text-gray-500">Thông tin chung</div>
                                <div className="font-bold text-gray-900">
                                  Nhân viên lập: {invoiceHeader?.MaNVLap || "—"}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Ngày lập: {invoiceHeader?.NgayLap ? safeDate(invoiceHeader.NgayLap) : "—"}
                                </div>
                              </div>
                              <div className="bg-gray-50 p-4 rounded-xl">
                                <div className="text-sm text-gray-500">Tổng tiền (tính từ chi tiết)</div>
                                <div className="text-2xl font-black text-blue-600">{formatVND(invoiceTotal)}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Lưu ý: Tổng này cộng từ các dòng invoices/full.
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              {invoiceGroups.map((g) => (
                                <div
                                  key={g.MaPhieuDV}
                                  className="border border-gray-100 rounded-2xl overflow-hidden"
                                >
                                  <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                    <div>
                                      <div className="font-bold text-gray-900">
                                        {g.TenDV} • Mã PDV: <span className="font-mono">{g.MaPhieuDV}</span>
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        Số dòng chi tiết: {g.items.length}
                                      </div>
                                    </div>
                                    <div className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 w-fit">
                                      {g.TenDV}
                                    </div>
                                  </div>

                                  <div className="p-6 divide-y divide-gray-100">
                                    {g.items.map((it, idx) => {
                                      const qty = it.SoLuong ?? 1;
                                      const price = it.DonGia ?? 0;
                                      const total = it.ThanhTien ?? (price * (qty || 1));
                                      return (
                                        <div key={idx} className="flex justify-between py-3 first:pt-0 last:pb-0">
                                          <div>
                                            <div className="font-medium text-gray-900">{it.TenChiTiet}</div>
                                            <div className="text-sm text-gray-500">
                                              {it.LoaiChiTiet} • SL: {it.SoLuong ?? "—"} • Đơn giá: {formatVND(price)}
                                            </div>
                                          </div>
                                          <div className="text-gray-900 font-semibold">{formatVND(total)}</div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {!invoiceLoading && invoiceRows === null && (
                      <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-700">
                        Không có dữ liệu chi tiết hóa đơn.
                      </div>
                    )}

                    <div className="flex justify-end" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== PETS ==================== */}
        {activeTab === "pets" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Hồ sơ sức khỏe</h2>

              {!selectedPetId && (
                <button
                  onClick={() => setIsAddPetModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                  Thêm thú cưng
                </button>
              )}
            </div>

            {petsLoading && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-2">
                <RefreshCcw className="w-4 h-4 animate-spin" />
                <span className="text-gray-700 font-medium">Đang tải thú cưng...</span>
              </div>
            )}

            {selectedPetId ? (
              <div className="space-y-4">
                <PetMedicalHistory
                  pet={uiPets.find((p) => p.id === selectedPetId) || null}
                  records={medicalRecords}
                  onBack={() => {
                    setSelectedPetId(null);
                    setMedicalRecords([]);
                  }}
                  onRecordClick={handleRecordClick}
                />

                {petHistoryLoading && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-2">
                    <RefreshCcw className="w-4 h-4 animate-spin" />
                    <span className="text-gray-700 font-medium">Đang tải lịch sử...</span>
                  </div>
                )}
              </div>
            ) : (
              <PetList
                pets={uiPets as any}
                selectedPetId={selectedPetId}
                onSelectPet={async (id: string) => {
                  setSelectedPetId(id);
                  await loadPetHistory(id);
                }}
              />
            )}
          </div>
        )}

        {/* ==================== INFO ==================== */}
        {activeTab === "info" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h2>

              {!isEditingInfo ? (
                <button
                  onClick={() => setIsEditingInfo(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Chỉnh sửa
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelEdit}
                    disabled={savingInfo}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-60"
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveInfo}
                    disabled={savingInfo}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    {savingInfo ? "Đang lưu..." : "Lưu"}
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                  <div className="relative">
                    <img src={avatarUrl} alt={customer.HoTen} className="w-24 h-24 rounded-full border-4 border-blue-50" />
                    <div className="absolute bottom-0 right-0 bg-yellow-400 text-white p-1.5 rounded-full border-2 border-white">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Loại thành viên</div>
                    <div className="text-lg font-bold text-gray-900">{memberType}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {loyaltyPoints.toLocaleString("vi-VN")} điểm thưởng
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                    {isEditingInfo ? (
                      <input
                        type="text"
                        value={userInfo.HoTen}
                        onChange={(e) => setUserInfo((p) => ({ ...p, HoTen: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">{customer.HoTen}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email
                    </label>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">{customer.Email}</div>
                    {isEditingInfo && (
                      <div className="text-xs text-gray-500 mt-1">
                        Email hiện đang không hỗ trợ cập nhật (backend chưa cho update Email).
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Số điện thoại
                    </label>
                    {isEditingInfo ? (
                      <input
                        type="tel"
                        value={userInfo.SDT}
                        onChange={(e) => setUserInfo((p) => ({ ...p, SDT: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">{customer.SDT || "—"}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CCCD</label>
                    {isEditingInfo ? (
                      <input
                        type="text"
                        value={userInfo.CCCD}
                        onChange={(e) => setUserInfo((p) => ({ ...p, CCCD: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">{customer.CCCD || "—"}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                    {isEditingInfo ? (
                      <input
                        type="date"
                        value={userInfo.NgaySinh}
                        onChange={(e) => setUserInfo((p) => ({ ...p, NgaySinh: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                        {customer.NgaySinh ? safeDate(customer.NgaySinh) : "—"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                    {isEditingInfo ? (
                      <select
                        value={userInfo.GioiTinh}
                        onChange={(e) => setUserInfo((p) => ({ ...p, GioiTinh: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">-- Chọn --</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">{customer.GioiTinh || "—"}</div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mã khách hàng</label>
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 font-mono">
                      {(customer as any).MaKH || (customer as any).MaND || "—"}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bổ sung</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="text-sm text-blue-600 font-medium mb-1">Điểm thưởng</div>
                      <div className="text-2xl font-bold text-blue-700">
                        {loyaltyPoints.toLocaleString("vi-VN")}
                      </div>
                      <div className="text-xs text-blue-500 mt-1">Có thể dùng để đổi quà</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="text-sm text-green-600 font-medium mb-1">Tổng hóa đơn</div>
                      <div className="text-2xl font-bold text-green-700">{receipts.length}</div>
                      <div className="text-xs text-green-500 mt-1">Tổng số hóa đơn của bạn</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal chi tiết lịch sử khám bệnh */}
      <MedicalRecordDetailModal
        record={selectedRecord}
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
      />

      {/* Modal thêm thú cưng */}
      <AddPetModal
        isOpen={isAddPetModalOpen}
        onClose={() => setIsAddPetModalOpen(false)}
        onSubmit={handleAddPet}
        submitting={addingPet}
      />

      {/* Overlay while adding pet */}
      {addingPet && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex items-center gap-3">
            <RefreshCcw className="w-5 h-5 animate-spin" />
            <div className="font-medium text-gray-900">Đang thêm thú cưng...</div>
          </div>
        </div>
      )}
    </div>
  );
}
