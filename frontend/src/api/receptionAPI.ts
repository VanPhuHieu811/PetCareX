import { apiGet, apiPost } from './client'; // Import hàm apiGet từ client.js

// --- Định nghĩa các Interface cho dữ liệu ---

export interface Pet {
  TenTC: string | null;
  GioiTinh: string | null;
  NgaySinh: string | null;
  TenGiong: string | null;
  TinhTrangSucKhoe: string | null;
  TenLoaiTC: string | null;
}

export interface Customer {
  HoTen: string;
  sdt: string;
  Email: string;
  DiemLoyalty: number;
  SoLuongThuCung: number;
  pets: Pet[];
}

export interface Appointment {
  MaPhieuDV: string;
  NgayDatDV: string;
  TenThuCung: string;
  TenDV: string;
  TenKH: string;
  SdtKH: string;
  TenBS: string | null;
  TrangThai: string;
}

export interface AppointmentDashboard {
  stats: {
    DangCho: number;
    DaThanhToan: number;
    HoanThanh: number;
    DaHuy: number;
  };
  appointments: Appointment[];
}

export interface AddCustomerInput {
  name: string;
  sdt: string;
  email: string;
  birthDate: string; // Định dạng YYYY-MM-DD từ input date
  gender: string;    // 'Nam', 'Nữ' hoặc 'Khác'
  cccd?: string;
}
export interface CreateAppointmentInput {
  maCN: string;
  maKH: string;
  maTC: string;
  maDV: string;       // Mã dịch vụ (lấy từ bảng DichVu)
  maBS: string | null; // Mã bác sĩ (có thể null)
  ngayHen: string;    // 'YYYY-MM-DD HH:mm'
  loaiDichVu: 'KhamBenh' | 'TiemPhong'; // Cờ để backend rẽ nhánh bảng
  isPackage?: boolean; // True nếu đăng ký gói tiêm
  maGoiTP?: string;    // Mã gói tiêm nếu isPackage = true
}

export interface AddPetInput {
  maKH: string;
  name: string;
  gender: string;
  birthDate?: string;
  breed: string;   // Giống (Poodle, Mèo mướp...)
  species: string; // Loài (Chó/Mèo)
}

// --- Reception API ---

const BASE_PATH = "/api/v1/reception"; // Giả sử route được mount tại đây trong server

const receptionAPI = {
  /**
   * Lấy thông tin khách hàng kèm danh sách thú cưng
   * Endpoint: GET /?identifier=...
   */
  getCustomerDetails: async (identifier: string): Promise<Customer> => {
    // encodeURIComponent giúp xử lý các ký tự đặc biệt trong Email hoặc SĐT
    return apiGet(`${BASE_PATH}?identifier=${encodeURIComponent(identifier)}`);
  },

  getCustomerStats: async (): Promise<any> => {
    return apiGet(`${BASE_PATH}/stats`);
  },
  

  addCustomer: async (customerData: AddCustomerInput) => {
    // apiPost sẽ nhận object customerData và gửi lên body của request
    return apiPost(`${BASE_PATH}`, customerData);
  },
  
  getPetHistory: async (maTC: string): Promise<any> => {
    return apiGet(`${BASE_PATH}/pet-history/${maTC}`);
  },
  /**
   * Lấy bảng lịch hẹn và thống kê
   * Endpoint: GET /appointments?date=...&status=...&search=...
   */
  getAppointmentBoard: async (date: string, status: string = 'Tất cả', search: string = ''): Promise<AppointmentDashboard> => {
    const query = new URLSearchParams({
      date,
      status,
      search
    }).toString();
    return apiGet(`${BASE_PATH}/appointments?${query}`);
  },

  /**
   * Lấy danh sách bác sĩ rảnh theo chi nhánh và thời gian
   * Endpoint: GET /available-doctors?branchID=...&date=...&time=...
   */
  getAvailableDoctors: async (branchID: string, date: string, time: string): Promise<any[]> => {
    const query = new URLSearchParams({
      branchID,
      date,
      time
    }).toString();
    return apiGet(`${BASE_PATH}/available-doctors?${query}`);
  },

  /**
   * API Thêm thú cưng mới
   */
  addPet: async (data: AddPetInput): Promise<any> => {
    return apiPost(`${BASE_PATH}/add-pet`, data);
  },

  /**
   * API Tạo phiếu đặt lịch (Xử lý giao dịch phức tạp)
   */
  createAppointment: async (data: CreateAppointmentInput): Promise<any> => {
    return apiPost(`${BASE_PATH}/create-appointment`, data);
  },
  /** Lấy danh sách loài (Chó, Mèo, ...) */
  getPetSpecies: async (): Promise<any[]> => {
    return apiGet(`${BASE_PATH}/species`);
  },

  /** Lấy danh sách giống theo Mã Loại */
  getBreeds: async (maLoai: string): Promise<any[]> => {
    return apiGet(`${BASE_PATH}/breeds?maLoai=${maLoai}`);
  },
};

export default receptionAPI;