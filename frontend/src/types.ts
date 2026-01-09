export type Role = 'MANAGER' | 'DOCTOR' | 'RECEPTIONIST' | 'SALES' | 'CUSTOMER';

export interface UserAccount {
	username: string;
	password: string;
	role: string;
	name: string;
	linkedId?: string;
}

export interface AuthState {
	user: UserAccount | null;
	isAuthenticated: boolean;
	login: (username: string, password: string) => Promise<boolean>;
	logout: () => void;

	register: (
    email: string,
    password: string,
    name: string,
    cccd: string
  ) => Promise<boolean>;
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

// Trùng với SanPham nhưng có thêm trường SoLuongDaBan
export interface SanPham {
	MaSP: string;
	TenSP: string;
	MaLoaiSP: string;
	TenLoaiSP: string; // From LoaiSP
	GiaBan: number;
	TonKho: number; // From SPCuaTungCN
	SoLuongDaBan?: number; // Added field
}

export interface Product {
	id: string;
	name: string;
	sku: string;
	category: string;
	originalPrice: number;
	salePrice?: number;
	discountPercentage: number;
	image: string;
	description: string;
	rating: number;
	stock: number;
	isInStock: boolean;
	branchStock?: { [branchId: string]: number }; // Tồn kho theo từng chi nhánh
}
//---------------------------------------

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

export interface CurrentUser {
	id: string;
	name: string;
	email: string;
	phone: string;
	avatar: string;
	loyaltyPoints: number;
	memberType: 'Basic' | 'Silver' | 'VIP';
}

export interface Branch {
	id: string;
	name: string;
	address: string;
	phone: string;
	openTime: string;
	closeTime: string;
}

export interface Service {
	id: string;
	name: string;
	description: string;
	estimatedDuration: number; // minutes
	priceRange?: string;
	image: string;
}

export interface Doctor {
	id: string;
	name: string;
	specialty: string;
	branchId: string;
	avatar: string;
	intro: string;
}

export interface Pet {
	id: string;
	name: string;
	species: string; // Chó, Mèo
	breed: string; // Giống
	dob: string;
	gender: 'Đực' | 'Cái';
	weight: number;
	avatar?: string;
}

export interface ProductAvailability {
	branchId: string;
	branchName: string;
	stock: number;
}

export interface OrderItem {
	productId: string;
	productName: string;
	price: number;
	quantity: number;
	total: number;
}

export interface Order {
	id: string;
	date: string;
	totalAmount: number;
	status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
	paymentMethod: 'Cash' | 'Transfer';
	branchName: string;
	items: OrderItem[];
}

export interface MedicalRecord {
	id: string;
	date: string;
	petId: string;
	petName: string;
	serviceType: string;
	doctorName: string;
	diagnosis: string;
	symptoms: string;
	prescription?: {
		medicineName: string;
		quantity: number;
		usage: string;
	}[];
	vaccines?: {
		name: string;
		batch: string;
	}[];
	nextAppointment?: string;
}

export interface TimeSlot {
	time: string;
	isAvailable: boolean;
}