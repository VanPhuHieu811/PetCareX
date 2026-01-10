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
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Components
import MedicalRecordDetailModal from "../../components/customer/history/MedicalRecordDetailModal";
import AddPetModal, { PetFormData } from "../../components/customer/pets/AddPetModal";
import PetList from "../../components/customer/pets/PetList";
import PetMedicalHistory from "../../components/customer/pets/PetMedicalHistory";
// APIs & Types
import { MedicalRecord, Pet } from "../../types";
import ReceiptDetailModal, { ReceiptDetail } from "../../components/customer/history/ReceiptDetailModal";
import { getCustomerMe, getCustomerReceipts, updateCustomerMe, getReceiptDetailsApi } from "../../api/customerApi";
import { getMyPets, createPet, getPetExams, getPetVaccinations } from "../../api/petApi";

// ==========================
// Types: Local (User Info & List Rows)
// ==========================
type Tab = "orders" | "pets" | "info";

type CustomerMe = {
  MaND: string;
  HoTen: string;
  Email: string;
  NgaySinh?: string | null;
  GioiTinh?: string | null;
  SDT?: string | null;
  CCCD?: string | null;
  LoaiND?: string | null;
  NgayTao?: string | null;
  TrangThai?: string | null;
  DiemLoyalty?: number | null;
  TenLoaiTV?: string | null;
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
  TenGiong?: string;
  TenLoaiTC?: string
  NgaySinh?: string;
  TinhTrangSucKhoe?: string | null;
  MaKH?: string;
  GioiTinh?: string;
};

function mapPetRowToPet(p: PetRow): Pet {
  return {
    id: p.MaTC,
    name: p.TenTC,
    breedId: p.MaGiong || "—",
    breed: p.TenGiong || "—",
    species: p.TenLoaiTC || "—",
    dob: p.NgaySinh ? String(p.NgaySinh).slice(0, 10) : "",
    health: p.TinhTrangSucKhoe ?? "—",
    customerId: p.MaKH || "",
    gender: (p.GioiTinh === "Cái" ? "Cái" : "Đực"),
  };
}

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

export default function Profile() {
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const { logout } = useAuth();
  const navigate = useNavigate();

  // global loading/error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // customer
  const [customer, setCustomer] = useState<CustomerMe | null>(null);

  // editable info
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [userInfo, setUserInfo] = useState({
    HoTen: "", Email: "", SDT: "", CCCD: "", NgaySinh: "", GioiTinh: "",
  });
  const [savingInfo, setSavingInfo] = useState(false);

  // receipts list
  const [receipts, setReceipts] = useState<ReceiptRow[]>([]);

  // ==========================
  // STATE CHO MODAL HÓA ĐƠN MỚI
  // ==========================
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptDetail, setReceiptDetail] = useState<ReceiptDetail | null>(null);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [receiptError, setReceiptError] = useState<string | null>(null);

  // pets list
  const [pets, setPets] = useState<PetRow[]>([]);
  const [petsLoading, setPetsLoading] = useState(false);

  // pet history
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [petHistoryLoading, setPetHistoryLoading] = useState(false);

  // medical record modal (của thú cưng)
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
      const me: CustomerMe = (meRes as any)?.data;
      setCustomer(me);

      setUserInfo({
        HoTen: me?.HoTen ?? "",
        Email: me?.Email ?? "",
        SDT: me?.SDT ?? "",
        CCCD: me?.CCCD ?? "",
        NgaySinh: me?.NgaySinh ? String(me.NgaySinh).slice(0, 10) : "",
        GioiTinh: me?.GioiTinh ?? "",
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
  }, []);

  // ==========================
  // HÀM MỞ HÓA ĐƠN (GỌI API MỚI)
  // ==========================
  const openReceipt = async (receiptId: string) => {
    setIsReceiptModalOpen(true);
    setReceiptLoading(true);
    setReceiptError(null);
    setReceiptDetail(null);

    try {
      const res = await getReceiptDetailsApi(receiptId);
      // Giả sử API trả về { success: true, data: { ... } }
      const detailData = (res as any)?.data ?? res;
      setReceiptDetail(detailData);
    } catch (e: any) {
      setReceiptError(e?.message || "Không lấy được chi tiết hóa đơn");
    } finally {
      setReceiptLoading(false);
    }
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

      const mappedExams: MedicalRecord[] = examRows.map((x: any) => ({
        id: x.MaPhieuDV,
        date: x.NgayKham,
        petId,
        petName: pet?.TenTC || "Thú cưng",
        serviceType: "Khám bệnh",
        doctorName: x.TenBacSi || "Bác sĩ",
        diagnosis: x.MoTaChuanDoan || "—",
        symptoms: x.MoTaTrieuChung || "—",
        nextAppointment: x.NgayTaiKham || undefined,
        prescription: x.DonThuocList || [],
      }));

      const mappedVaccines: MedicalRecord[] = vxRows.map((v: any) => ({
        id: v.MaPhieuDV,
        date: v.NgayTiem,
        petId,
        petName: pet?.TenTC || "Thú cưng",
        serviceType: "Tiêm phòng",
        doctorName: v.TenBacSi || "Bác sĩ",
        diagnosis: "Tiêm phòng",
        symptoms: "—",
        vaccines: v.DanhSachVacXin || [],
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleRecordClick = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsRecordModalOpen(true);
  };

  // ==========================
  // Add pet 
  // ==========================
  const handleAddPet = async (data: PetFormData) => {
    setAddingPet(true);
    setError(null);
    try {
      await createPet({
        TenTC: data.name,
        MaGiong: data.breedId,
        NgaySinh: data.dob,
        GioiTinh: data.gender,
        TinhTrangSucKhoe: data.healthStatus || null,
      });
      setPetsLoading(true);
      const pRes = await getMyPets();
      setPets(normalizeList<PetRow>(pRes));
      setPetsLoading(false);
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
    const seed = customer?.MaND || customer?.Email || "me";
    return `https://i.pravatar.cc/150?u=${encodeURIComponent(seed)}`;
  }, [customer]);

  const memberType = useMemo(() => customer?.TenLoaiTV ?? "Cơ bản", [customer]);

  const loyaltyPoints = useMemo(() => {
    const v = Number(customer?.DiemLoyalty ?? 0);
    return Number.isFinite(v) ? v : 0;
  }, [customer]);

  const uiPets = useMemo<Pet[]>(() => pets.map(mapPetRowToPet), [pets]);

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
            <button onClick={loadAll} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
              <RefreshCcw className="w-4 h-4" /> Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================
  // Main render
  // ==========================
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        {/* User Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="relative inline-block">
            <img src={avatarUrl} alt={customer.HoTen} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-50" />
            <div className="absolute bottom-2 right-0 bg-yellow-400 text-white p-1 rounded-full border-2 border-white" title={memberType}>
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
              activeTab === "orders" ? "bg-blue-50 border-blue-600 text-blue-700" : "border-transparent text-gray-600 hover:bg-gray-50"
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
              activeTab === "pets" ? "bg-blue-50 border-blue-600 text-blue-700" : "border-transparent text-gray-600 hover:bg-gray-50"
            )}
          >
            <FileText className="w-5 h-5" /> Hồ sơ thú cưng
          </button>

          <button
            onClick={() => setActiveTab("info")}
            className={clsx(
              "w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4",
              activeTab === "info" ? "bg-blue-50 border-blue-600 text-blue-700" : "border-transparent text-gray-600 hover:bg-gray-50"
            )}
          >
            <User className="w-5 h-5" /> Thông tin cá nhân
          </button>
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Đăng xuất
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
                      className="w-full text-left bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:border-blue-200 transition group"
                    >
                      <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <span className="text-sm text-gray-500">
                            Mã hóa đơn: <span className="font-mono text-gray-900 font-semibold group-hover:text-blue-600">#{id}</span>
                          </span>
                          <div className="text-xs text-gray-400 mt-1">
                            {safeDate(date)} {r.TenCN ? `• ${r.TenCN}` : ""}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-blue-600">{formatVND(total)}</span>
                        </div>
                      </div>
                      <div className="px-6 py-4 text-sm text-gray-600 flex justify-between items-center">
                         <span>Xem chi tiết dịch vụ & đơn thuốc</span>
                         <span className="text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Mở →</span>
                      </div>
                    </button>
                  );
                })}
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
                  <Plus className="w-5 h-5" /> Thêm thú cưng
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
                  <Edit2 className="w-4 h-4" /> Chỉnh sửa
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelEdit}
                    disabled={savingInfo}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-60"
                  >
                    <X className="w-4 h-4" /> Hủy
                  </button>
                  <button
                    onClick={handleSaveInfo}
                    disabled={savingInfo}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" /> {savingInfo ? "Đang lưu..." : "Lưu"}
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
                    <div className="text-sm text-gray-500 mt-1">{loyaltyPoints.toLocaleString("vi-VN")} điểm thưởng</div>
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
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bổ sung</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="text-sm text-blue-600 font-medium mb-1">Điểm thưởng</div>
                      <div className="text-2xl font-bold text-blue-700">{loyaltyPoints.toLocaleString("vi-VN")}</div>
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

      {/* Modal chi tiết lịch sử khám bệnh thú cưng (cũ) */}
      <MedicalRecordDetailModal
        record={selectedRecord}
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
      />

      {/* MODAL CHI TIẾT HÓA ĐƠN (MỚI) */}
      <ReceiptDetailModal
        open={isReceiptModalOpen}
        loading={receiptLoading}
        error={receiptError}
        data={receiptDetail}
        onClose={() => setIsReceiptModalOpen(false)}
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