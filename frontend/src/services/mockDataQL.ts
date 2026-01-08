import { UserAccount, NhanVien, SanPham, ThuCung, Vacxin, KhachHang, DoanhThuData, ChiNhanh, DoctorStat, VisitStat } from '../types';

export const MOCK_ACCOUNTS: UserAccount[] = [
  // 1. Quản lý (Full quyền)
  { 
    username: 'admin', password: '123', role: 'Quản lý', 
    displayName: 'Quản Lý Cửa Hàng', linkedId: 'NV01' 
  },
  
  // 2. Bác sĩ (Chuyên về Thú cưng, Tiêm chủng)
  { 
    username: 'bacsi', password: '123', role: 'Bác sĩ', 
    displayName: 'Bác sĩ An', linkedId: 'NV02' 
  },

  // 3. Tiếp tân (Chuyên về Khách hàng, Lịch hẹn)
  { 
    username: 'tieptan', password: '123', role: 'Tiếp tân', 
    displayName: 'Lễ tân Hoa', linkedId: 'NV03' 
  },

  // 4. Bán vé / Bán hàng (Chuyên về Kho, Hóa đơn)
  { 
    username: 'banhang', password: '123', role: 'Bán hàng', 
    displayName: 'NV Bán hàng Hảo', linkedId: 'NV04' 
  },
  
  // 5. Khách hàng
  { 
    username: 'khach', password: '123', role: 'Khách hàng', 
    displayName: 'Nguyễn Văn A', linkedId: 'KH01' 
  }
];
export const CURRENT_BRANCH_ID = 'CN01'; // Giả sử đang quản lý CN01

export const BRANCHES: ChiNhanh[] = [
  { MaCN: 'CN01', TenCN: 'PetCareX Quận 1', DiaChi: '123 Nguyễn Huệ, Q1', SDT: '0901234567' },
  { MaCN: 'CN02', TenCN: 'PetCareX Phú Nhuận', DiaChi: '45 Phan Xích Long, PN', SDT: '0909876543' },
  { MaCN: 'CN03', TenCN: 'PetCareX Hà Nội', DiaChi: '10 Hai Bà Trưng, HN', SDT: '0912345678' },
];

export const MOCK_EMPLOYEES: NhanVien[] = [
  { MaNV: 'NV001', HoTen: 'Nguyễn Văn An', MaChucVu: 'CV01', TenChucVu: 'Bác sĩ', MaCN: 'CN01', TrangThai: 'DangLamViec', HieuSuat: { SoDonHang: 120, DiemDanhGia: 4.8 } },
  { MaNV: 'NV002', HoTen: 'Trần Thị Bích', MaChucVu: 'CV02', TenChucVu: 'Thu ngân', MaCN: 'CN01', TrangThai: 'DangLamViec', HieuSuat: { SoDonHang: 450, DiemDanhGia: 4.5 } },
  { MaNV: 'NV003', HoTen: 'Lê Hoàng Nam', MaChucVu: 'CV03', TenChucVu: 'Kho', MaCN: 'CN01', TrangThai: 'DangLamViec', HieuSuat: { SoDonHang: 50, DiemDanhGia: 4.2 } },
  { MaNV: 'NV004', HoTen: 'Phạm Thị Duyên', MaChucVu: 'CV01', TenChucVu: 'Bác sĩ', MaCN: 'CN01', TrangThai: 'DangLamViec', HieuSuat: { SoDonHang: 98, DiemDanhGia: 4.9 } },
];

export const MOCK_PRODUCTS: SanPham[] = [
  { MaSP: 'SP001', TenSP: 'Thức ăn hạt Royal Canin', MaLoaiSP: 'LSP01', TenLoaiSP: 'Thức ăn', GiaBan: 150000, TonKho: 45, SoLuongDaBan: 320 },
  { MaSP: 'SP002', TenSP: 'Sữa tắm SOS', MaLoaiSP: 'LSP02', TenLoaiSP: 'Vệ sinh', GiaBan: 85000, TonKho: 12, SoLuongDaBan: 85 },
  { MaSP: 'SP003', TenSP: 'Pate Whiskas', MaLoaiSP: 'LSP01', TenLoaiSP: 'Thức ăn', GiaBan: 35000, TonKho: 100, SoLuongDaBan: 540 },
  { MaSP: 'SP004', TenSP: 'Vòng cổ trị rận', MaLoaiSP: 'LSP03', TenLoaiSP: 'Phụ kiện', GiaBan: 120000, TonKho: 5, SoLuongDaBan: 45 }, // Low stock
];

export const MOCK_PETS: ThuCung[] = [
  { 
    MaTC: 'TC001', TenTC: 'Mimi', Loai: 'Mèo', Giong: 'Anh Lông Ngắn', TenChu: 'Phạm Hương', MaKH: 'KH01',
    LichSuKham: [
      { NgayKham: '2023-10-15', ChuanDoan: 'Viêm da nhẹ', BacSi: 'Nguyễn Văn An' },
      { NgayKham: '2023-12-20', ChuanDoan: 'Khám sức khỏe định kỳ', BacSi: 'Nguyễn Văn An' }
    ],
    TinhTrangTiem: 'Đã tiêm đủ 2 mũi'
  },
  { 
    MaTC: 'TC002', TenTC: 'Lu', Loai: 'Chó', Giong: 'Corgi', TenChu: 'Trần Đức', MaKH: 'KH02',
    LichSuKham: [
      { NgayKham: '2024-01-05', ChuanDoan: 'Rối loạn tiêu hóa', BacSi: 'Nguyễn Văn An' }
    ],
    TinhTrangTiem: 'Chưa tiêm phòng dại'
  },
];

export const MOCK_VACCINES: Vacxin[] = [
  { MaVacXin: 'VX001', TenVacXin: 'Rabisin (Phòng dại)', NgaySanXuat: '2023-05-01', GiaVacXin: 150000, TonKho: 50, LuotDat: 320 },
  { MaVacXin: 'VX002', TenVacXin: 'Vanguard 5/L', NgaySanXuat: '2023-06-15', GiaVacXin: 250000, TonKho: 20, LuotDat: 150 },
  { MaVacXin: 'VX003', TenVacXin: 'Tricat Trio', NgaySanXuat: '2023-08-10', GiaVacXin: 200000, TonKho: 5, LuotDat: 400 },
];

export const REVENUE_DATA: DoanhThuData[] = [
  { time: 'T1', revenue: 120000000 },
  { time: 'T2', revenue: 135000000 },
  { time: 'T3', revenue: 110000000 },
  { time: 'T4', revenue: 160000000 },
  { time: 'T5', revenue: 145000000 },
  { time: 'T6', revenue: 190000000 },
];

export const MOCK_CUSTOMERS: KhachHang[] = [
  { MaKH: 'KH01', HoTen: 'Phạm Hương', SDT: '0988888888', LoaiTV: 'VIP', LanCuoiToi: '2024-05-20', TongChiTieu: 15000000 },
  { MaKH: 'KH02', HoTen: 'Trần Đức', SDT: '0977777777', LoaiTV: 'ThanThiet', LanCuoiToi: '2024-01-05', TongChiTieu: 6000000 },
  { MaKH: 'KH03', HoTen: 'Lê Văn C', SDT: '0966666666', LoaiTV: 'CoBan', LanCuoiToi: '2023-08-10', TongChiTieu: 500000 }, // Inactive
];

// Mock Data cho Dashboard mới
export const MOCK_DOCTOR_STATS: DoctorStat[] = [
  { MaNV: 'NV001', HoTen: 'Nguyễn Văn An', SoCaKham: 125, DoanhThu: 150000000 },
  { MaNV: 'NV004', HoTen: 'Phạm Thị Duyên', SoCaKham: 98, DoanhThu: 115000000 },
  { MaNV: 'NV005', HoTen: 'Lê Thanh Tùng', SoCaKham: 45, DoanhThu: 50000000 },
];

export const MOCK_VISIT_STATS_DAILY: VisitStat[] = [
  { ThoiGian: '01/06/2024', LuotKham: 15, LuotTiem: 8 },
  { ThoiGian: '02/06/2024', LuotKham: 12, LuotTiem: 10 },
  { ThoiGian: '03/06/2024', LuotKham: 18, LuotTiem: 5 },
  { ThoiGian: '04/06/2024', LuotKham: 20, LuotTiem: 12 },
  { ThoiGian: '05/06/2024', LuotKham: 14, LuotTiem: 6 },
];