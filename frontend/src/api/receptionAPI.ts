import { apiGet, apiPost } from './client';

// ==========================================
// 1. ĐỊNH NGHĨA INTERFACE (TYPES)
// ==========================================

export interface Pet {
  TenTC: string | null;
  GioiTinh: string | null;
  NgaySinh: string | null;
  TenGiong: string | null;
  TinhTrangSucKhoe: string | null;
  TenLoaiTC: string | null;
}

export interface VaccinePackage {
  MaGoiTP: string;
  TenGoiTP: string;
  GiaTien: number;     // Thêm giá tiền để hiển thị
  UuDaiGiamTien: number;
  ThoiHan: number;     // Số tháng/năm hiệu lực
  MoTa?: string;
}

export interface Customer {
  MaND: string;       // Bổ sung MaND (quan trọng để định danh)
  HoTen: string;
  sdt: string;
  Email: string;
  DiemLoyalty: number;
  SoLuongThuCung: number;
  pets: Pet[];
}

export interface AppointmentDashboard {
  stats: {
    DangCho: number;
    DaThanhToan: number;
    HoanThanh: number;
    DaHuy: number;
  };
  appointments: Array<{
    MaPhieuDV: string;
    NgayDatDV: string;
    TenThuCung: string;
    TenDV: string;
    TenKH: string;
    SdtKH: string;
    TenBS: string | null;
    TrangThai: string;
  }>;
}

export interface AddCustomerInput {
  name: string;
  sdt: string;
  email: string;
  birthDate: string;
  gender: string;
  cccd?: string;
}

export interface AddPetInput {
  maKH: string;
  name: string;
  gender: string;
  birthDate?: string;
  breedId: string;   // Dùng breedId (MaGiong) thay vì tên breed string
  species: string;   // Tên loài hoặc Mã loài
  weight: number;
}

// Payload tạo lịch khám (Khớp với Services.service.js)
export interface CreateExamInput {
  maKH: string;
  maCN: string;
  maDV: string;       // Thường là 'DV001'
  hinhThucDat: string;
  bacSiPhuTrach: string | null;
  maTC: string;
  ngayKham: string;   // ISO String (YYYY-MM-DDTHH:mm:ss)
}

// Payload tạo lịch tiêm (Khớp với Services.service.js)
export interface CreateVaccineInput {
  maKH: string;
  maCN: string;
  maDV: string;       // 'DV002' hoặc 'DV003'
  hinhThucDat: string;
  bacSiPhuTrach: string | null;
  maTC: string;
  ngayTiem: string;   // ISO String
  maDK?: string | null; // Mã đăng ký gói (nếu có)
}

// ==========================================
// 2. CẤU HÌNH ĐƯỜNG DẪN API
// ==========================================

const BASE_PATH = "/api/v1/reception";    // Các tác vụ tiếp tân cơ bản
const SERVICE_PATH = "/api/v1/services";  // Các tác vụ đặt lịch chuyên môn
const PACKAGE_PATH = "/api/v1/packages";  // Các tác vụ liên quan gói tiêm

// ==========================================
// 3. RECEPTION API OBJECT
// ==========================================

const receptionAPI = {
  
  // --- NHÓM 1: QUẢN LÝ KHÁCH HÀNG & THÚ CƯNG ---

  /** Tìm kiếm khách hàng theo tên hoặc SĐT */
  getCustomerDetails: async (identifier: string): Promise<Customer[]> => {
    // API trả về mảng danh sách khách hàng tìm thấy
    return apiGet(`${BASE_PATH}?identifier=${encodeURIComponent(identifier)}`);
  },

  /** Lấy thống kê khách hàng (VIP, Thân thiết...) */
  getCustomerStats: async (): Promise<any> => {
    return apiGet(`${BASE_PATH}/stats`);
  },

  /** Tạo hồ sơ khách hàng mới */
  addCustomer: async (customerData: AddCustomerInput) => {
    return apiPost(`${BASE_PATH}`, customerData);
  },

  /** Thêm thú cưng cho khách hàng cũ */
  addPet: async (data: AddPetInput): Promise<any> => {
    return apiPost(`${BASE_PATH}/add-pet`, data);
  },

  /** Lấy lịch sử khám bệnh của thú cưng */
  getPetHistory: async (maTC: string): Promise<any> => {
    return apiGet(`${BASE_PATH}/pet-history/${maTC}`);
  },

  // --- NHÓM 2: DANH MỤC & TÀI NGUYÊN ---

  /** Lấy danh sách Loài (Chó, Mèo...) */
  getPetSpecies: async (): Promise<any[]> => {
    return apiGet(`${BASE_PATH}/species`);
  },

  /** Lấy danh sách Giống theo Mã Loài */
  getBreeds: async (maLoai: string): Promise<any[]> => {
    return apiGet(`${BASE_PATH}/breeds?maLoai=${maLoai}`);
  },

  /** Lấy danh sách Bác sĩ rảnh theo Chi nhánh và Thời gian */
  getAvailableDoctors: async (branchID: string, date: string, time: string): Promise<any[]> => {
    const query = new URLSearchParams({ branchID, date, time }).toString();
    return apiGet(`${BASE_PATH}/available-doctors?${query}`);
  },

  /** Lấy Dashboard lịch hẹn (Trang chủ Tiếp tân) */
  getAppointmentBoard: async (date: string, status: string = 'Tất cả', search: string = ''): Promise<AppointmentDashboard> => {
    const query = new URLSearchParams({ date, status, search }).toString();
    return apiGet(`${BASE_PATH}/appointments?${query}`);
  },

  // --- NHÓM 3: ĐẶT LỊCH DỊCH VỤ (SERVICES) ---

  /** * Tạo lịch KHÁM BỆNH 
   * Backend: Services.service.js -> createExamAppointment
   */
  createExamAppointment: async (payload: CreateExamInput) => {
    return apiPost(`${SERVICE_PATH}/exams`, payload);
  },

  /** * Tạo lịch TIÊM PHÒNG (Lẻ hoặc Gói)
   * Backend: Services.service.js -> createVaccineAppointment
   */
  createVaccineAppointment: async (payload: CreateVaccineInput) => {
    return apiPost(`${SERVICE_PATH}/vaccinations`, payload);
  },

  // --- NHÓM 4: GÓI TIÊM CHỦNG (PACKAGES) ---

  /** * Lấy danh sách tất cả gói tiêm
   * Backend: Packages.service.js -> getAllPackages
   */
  getAllPackages: async (): Promise<VaccinePackage[]> => {
    // SỬA: Gọi thẳng vào base path của package, không thêm /packages nữa
    return apiGet(`${PACKAGE_PATH}/packages`); 
  },

  /** * Đăng ký gói tiêm cho khách (Sau khi tạo lịch tiêm thành công)
   * Backend: Packages.service.js -> registerPackage
   */
  registerPackage: async (payload: {
    MaKH: string;
    MaGoiTP: string;
    MaPhieuDV: string;
  }) => {
    return apiPost(`${PACKAGE_PATH}/register`, payload);
  },
};

export default receptionAPI;