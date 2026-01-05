// Dựa trên schema database đã cung cấp
export type Role = 'MANAGER' | 'STAFF' | 'CUSTOMER';

export interface UserAccount {
  username: string;
  password: string; 
  role: Role;
  displayName: string;
  linkedId?: string;
}

export interface AuthState {
  user: UserAccount | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export interface ChiNhanh {
  MaCN: string;
  TenCN: string;
  DiaChi: string;
  SDT: string;
}

export interface NhanVien {
  MaNV: string;
  HoTen: string; // From joined NguoiDung table implicitly for UI
  MaChucVu: string;
  TenChucVu: string; // From joined ChucVu
  MaCN: string;
  TrangThai: 'DangLamViec' | 'DaNghiViec' | 'DieuDong';
  HieuSuat?: {
    SoDonHang: number;
    DiemDanhGia: number;
  };
}

export interface SanPham {
  MaSP: string;
  TenSP: string;
  MaLoaiSP: string;
  TenLoaiSP: string; // From LoaiSP
  GiaBan: number;
  TonKho: number; // From SPCuaTungCN
  SoLuongDaBan?: number; // Added field
}

export interface ThuCung {
  MaTC: string;
  TenTC: string;
  Loai: string; // From LoaiThuCung
  Giong: string; // From Giong
  TenChu: string; // From KhachHang -> NguoiDung
  MaKH: string;
  LichSuKham: Array<{
    NgayKham: string;
    ChuanDoan: string;
    BacSi: string;
  }>;
  TinhTrangTiem?: string;
}

export interface Vacxin {
  MaVacXin: string;
  TenVacXin: string;
  NgaySanXuat: string;
  GiaVacXin: number;
  TonKho: number; // From Vacxin_ChiNhanh
  LuotDat: number; // Calculated statistic
}

export interface DoanhThuData {
  time: string;
  revenue: number;
}

export interface KhachHang {
  MaKH: string;
  HoTen: string;
  SDT: string;
  LoaiTV: string; // VIP, ThanThiet, CoBan
  LanCuoiToi: string;
  TongChiTieu: number;
}

// New Types for Dashboard
export interface DoctorStat {
  MaNV: string;
  HoTen: string;
  SoCaKham: number;
  DoanhThu: number;
}

export interface VisitStat {
  ThoiGian: string;
  LuotKham: number;
  LuotTiem: number;
}
