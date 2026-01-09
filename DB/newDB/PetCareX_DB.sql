/* =========================================================
   PETCAREX - DENORMALIZED DATABASE SCRIPT (FINAL VERSION)
   Mục tiêu: Tối ưu hiệu suất đọc & Snapshot dữ liệu
   Cập nhật: Bổ sung đầy đủ Explicit Constraints (FK, PK, CK)
   ========================================================= */
USE db_ac35db_new;
GO

/* =========================================================
   1. NHÓM DANH MỤC (MASTER DATA)
   ========================================================= */

CREATE TABLE ChiNhanh (
    MaCN varchar(10) NOT NULL,
    TenCN nvarchar(100) NOT NULL,
    DiaChi nvarchar(255) NOT NULL,
    SDT varchar(10) NULL,
    ThoiGianMo time(0) NULL,
    ThoiGianDong time(0) NULL,
    CONSTRAINT PK_ChiNhanh PRIMARY KEY (MaCN),
    CONSTRAINT CK_ChiNhanh_SDT_So CHECK (SDT IS NULL OR SDT NOT LIKE '%[^0-9]%'),
    CONSTRAINT CK_ChiNhanh_Gio CHECK  (ThoiGianMo IS NULL OR ThoiGianDong IS NULL OR ThoiGianDong > ThoiGianMo)
); 
GO

CREATE TABLE LoaiThanhVien (
    MaLoaiTV varchar(10) NOT NULL,
    TenLoaiTV nvarchar(15) NOT NULL,
    SoTienChiTieu int NOT NULL,
    SoTienDuyTri int NOT NULL,
    CONSTRAINT PK_LoaiThanhVien PRIMARY KEY (MaLoaiTV),
    CONSTRAINT CK_LoaiTV_Ten CHECK (TenLoaiTV IN (N'Cơ bản', N'Thân thiết', N'VIP')),
    CONSTRAINT CK_LoaiTV_ChiTieu CHECK (SoTienChiTieu >= 0),
    CONSTRAINT CK_LoaiTV_DuyTri CHECK (SoTienDuyTri >= 0)
); 
GO

CREATE TABLE KhuyenMai (
    MaKhuyenMai varchar(10) NOT NULL,
    TenKhuyenMai nvarchar(100) NOT NULL,
    PhanTramGiam int NOT NULL,
    CONSTRAINT PK_KhuyenMai PRIMARY KEY (MaKhuyenMai),
    CONSTRAINT CK_KhuyenMai_PhanTram CHECK (PhanTramGiam BETWEEN 0 AND 100)
); 
GO

CREATE TABLE LoaiSP (
    MaLoaiSP varchar(10) NOT NULL,
    TenLoaiSP nvarchar(50) NOT NULL,
    CONSTRAINT PK_LoaiSP PRIMARY KEY (MaLoaiSP),
    CONSTRAINT CK_LoaiSP_Ten CHECK (TenLoaiSP IN (N'Thuốc', N'Thức ăn', N'Phụ kiện'))
); 
GO

CREATE TABLE SanPham (
    MaSP varchar(10) NOT NULL,
    TenSP nvarchar(50) NOT NULL,
    MaLoaiSP varchar(10) NOT NULL,
    GiaBan int NOT NULL,
    DonViTinh nvarchar(20) NOT NULL,
    CONSTRAINT PK_SanPham PRIMARY KEY (MaSP),
    CONSTRAINT FK_SanPham_LoaiSP FOREIGN KEY (MaLoaiSP) REFERENCES LoaiSP(MaLoaiSP),
    CONSTRAINT CK_SanPham_Gia CHECK (GiaBan >= 0)
); 
GO

CREATE TABLE LoaiThuCung (
    MaLoaiTC varchar(10) NOT NULL,
    TenLoaiTC nvarchar(20) NOT NULL,
    CONSTRAINT PK_LoaiThuCung PRIMARY KEY (MaLoaiTC)
); 
GO

CREATE TABLE Giong (
    MaGiong varchar(10) NOT NULL,
    TenGiong nvarchar(50) NOT NULL,
    MaLoaiTC varchar(10) NOT NULL,
    CONSTRAINT PK_Giong PRIMARY KEY (MaGiong),
    CONSTRAINT FK_Giong_LoaiTC FOREIGN KEY (MaLoaiTC) REFERENCES LoaiThuCung(MaLoaiTC)
); 
GO

CREATE TABLE VacXin (
    MaVacXin varchar(10) NOT NULL,
    TenVacXin nvarchar(100) NOT NULL,
    NgaySanXuat date NULL,
    DonViTinh nvarchar(20) NOT NULL,
    GiaVacXin int NOT NULL,
    CONSTRAINT PK_VacXin PRIMARY KEY (MaVacXin),
    CONSTRAINT CK_VacXin_NSX CHECK (NgaySanXuat IS NULL OR NgaySanXuat <= CAST(GETDATE() AS date)),
    CONSTRAINT CK_VacXin_Gia CHECK (GiaVacXin >= 0)
); 
GO

CREATE TABLE GoiTiemPhong (
    MaGoiTP varchar(10) NOT NULL,
    TenGoiTP nvarchar(100) NOT NULL,
    UuDaiGiamTien int NOT NULL,
    ThoiHan int NOT NULL,
    CONSTRAINT PK_GoiTiemPhong PRIMARY KEY (MaGoiTP),
    CONSTRAINT CK_GoiTP_UuDai CHECK (UuDaiGiamTien BETWEEN 5 AND 15),
    CONSTRAINT CK_GoiTP_ThoiHan CHECK (ThoiHan BETWEEN 6 AND 12)
); 
GO

/* =========================================================
   2. NHÓM KHÁCH HÀNG & THÚ CƯNG (Có Phi chuẩn hóa)
   ========================================================= */

CREATE TABLE NguoiDung (
    MaND varchar(10) NOT NULL,
    HoTen nvarchar(50) NOT NULL,
    Email nvarchar(255) NOT NULL,
    NgaySinh date NULL,
    GioiTinh nvarchar(5) NULL,
    SDT varchar(10) NULL,
    CCCD varchar(12) NULL,
    LoaiND nvarchar(20) NOT NULL,
    CONSTRAINT PK_NguoiDung PRIMARY KEY (MaND),
    CONSTRAINT UQ_NguoiDung_Email UNIQUE (Email),
    CONSTRAINT UQ_NguoiDung_CCCD UNIQUE (CCCD),
    CONSTRAINT CK_NguoiDung_GioiTinh CHECK (GioiTinh IN (N'Nam', N'Nữ')),
    CONSTRAINT CK_NguoiDung_LoaiND CHECK (LoaiND IN (N'Khách hàng', N'Nhân viên')),
    CONSTRAINT CK_NguoiDung_NgaySinh CHECK (NgaySinh < CAST(GETDATE() AS date)),
    CONSTRAINT CK_NguoiDung_SDT_So CHECK (SDT IS NULL OR SDT NOT LIKE '%[^0-9]%'),
    CONSTRAINT CK_NguoiDung_CCCD_So CHECK (CCCD IS NULL OR CCCD NOT LIKE '%[^0-9]%')
); 
GO

CREATE TABLE KhachHang (
    MaKH varchar(10) NOT NULL,
    LanCuoiToiCuaHang datetime NULL,
    MaLoaiTV varchar(10) NOT NULL,
    DiemLoyalty int NOT NULL DEFAULT 0,
    CONSTRAINT PK_KhachHang PRIMARY KEY (MaKH),
    CONSTRAINT FK_KhachHang_NguoiDung FOREIGN KEY (MaKH) REFERENCES NguoiDung(MaND),
    CONSTRAINT FK_KhachHang_LoaiTV FOREIGN KEY (MaLoaiTV) REFERENCES LoaiThanhVien(MaLoaiTV),
    CONSTRAINT CK_KhachHang_LanCuoi CHECK (LanCuoiToiCuaHang IS NULL OR LanCuoiToiCuaHang <= GETDATE()),
    CONSTRAINT CK_KhachHang_Diem CHECK (DiemLoyalty >= 0)
); 
GO

CREATE TABLE ThuCung (
    MaTC varchar(10) NOT NULL,
    TenTC nvarchar(50) NOT NULL,
    MaGiong varchar(10) NOT NULL,
    TenGiong nvarchar(50) NULL, 
    TenLoaiTC nvarchar(20) NULL,
    NgaySinh date NULL,
    TinhTrangSucKhoe nvarchar(100) NULL,
    MaKH varchar(10) NOT NULL,
    GioiTinh nvarchar(3) NULL,
    CONSTRAINT PK_ThuCung PRIMARY KEY (MaTC),
    CONSTRAINT FK_ThuCung_Giong FOREIGN KEY (MaGiong) REFERENCES Giong(MaGiong),
    CONSTRAINT FK_ThuCung_KhachHang FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH),
    CONSTRAINT CK_ThuCung_GioiTinh CHECK (GioiTinh IN (N'Đực', N'Cái')),
    CONSTRAINT CK_ThuCung_NgaySinh CHECK (NgaySinh <= CAST(GETDATE() AS date))
); 
GO

/* =========================================================
   3. NHÓM NHÂN SỰ & QUẢN LÝ KHO
   ========================================================= */

CREATE TABLE NhanVien (
    MaNV varchar(10) NOT NULL,
    NgayVaoLam datetime NOT NULL,
    LuongCoBan int NOT NULL,
    TrangThai nvarchar(20) NOT NULL,
    TenChucVu nvarchar(50) NOT NULL,
    MaCN varchar(10) NOT NULL,
    CONSTRAINT PK_NhanVien PRIMARY KEY (MaNV),
    CONSTRAINT FK_NhanVien_NguoiDung FOREIGN KEY (MaNV) REFERENCES NguoiDung(MaND),
    CONSTRAINT FK_NhanVien_ChiNhanh FOREIGN KEY (MaCN) REFERENCES ChiNhanh(MaCN),
    CONSTRAINT CK_NhanVien_Luong CHECK (LuongCoBan > 0),
    CONSTRAINT CK_NhanVien_TrangThai CHECK (TrangThai IN (N'Đang làm', N'Nghỉ việc')),
    CONSTRAINT CK_NhanVien_NgayVaoLam CHECK (NgayVaoLam <= GETDATE()),
    CONSTRAINT CK_NhanVien_ChucVu CHECK (TenChucVu IN (N'Bác sĩ', N'Bán hàng', N'Tiếp tân', N'Quản lý'))
); 
GO

CREATE TABLE TaiKhoan (
    MaND varchar(10) NOT NULL,
    MatKhau varchar(30) NOT NULL,
    NgayTao datetime NOT NULL CONSTRAINT DF_TaiKhoan_NgayTao DEFAULT GETDATE(),
    TrangThai nvarchar(20) NOT NULL,
    VaiTro nvarchar(50) NOT NULL,
    CONSTRAINT PK_TaiKhoan PRIMARY KEY (MaND),
    CONSTRAINT FK_TaiKhoan_NguoiDung FOREIGN KEY (MaND) REFERENCES NguoiDung(MaND),
    CONSTRAINT CK_TaiKhoan_TrangThai CHECK (TrangThai IN (N'Hoạt động', N'Khóa')),
    CONSTRAINT CK_TaiKhoan_VaiTro CHECK (VaiTro IN (N'Bác sĩ', N'Bán hàng', N'Tiếp tân', N'Quản lý', N'Khách hàng'))
); 
GO

CREATE TABLE DieuDong (
    MaCN varchar(10) NOT NULL,
    MaNV varchar(10) NOT NULL,
    NgayBD date NOT NULL,
    NgayKT date NULL,
    MaNVDieuDong varchar(10) NOT NULL,
    CONSTRAINT PK_DieuDong PRIMARY KEY (MaCN, MaNV, NgayBD),
    CONSTRAINT FK_DieuDong_CN FOREIGN KEY (MaCN) REFERENCES ChiNhanh(MaCN),
    CONSTRAINT FK_DieuDong_NV FOREIGN KEY (MaNV) REFERENCES NhanVien(MaNV),
    CONSTRAINT FK_DieuDong_NVDieuDong FOREIGN KEY (MaNVDieuDong) REFERENCES NhanVien(MaNV),
    CONSTRAINT CK_DieuDong_Ngay CHECK (NgayKT > NgayBD)
); 
GO

CREATE TABLE SPCuaTungCN (
    MaSP varchar(10) NOT NULL,
    MaCN varchar(10) NOT NULL,
    SoLuongTonKho int NOT NULL,
    CONSTRAINT PK_SPCuaTungCN PRIMARY KEY (MaSP, MaCN),
    CONSTRAINT FK_SPCuaTungCN_SP FOREIGN KEY (MaSP) REFERENCES SanPham(MaSP),
    CONSTRAINT FK_SPCuaTungCN_CN FOREIGN KEY (MaCN) REFERENCES ChiNhanh(MaCN),
    CONSTRAINT CK_SPCuaTungCN_Ton CHECK (SoLuongTonKho >= 0)
); 
GO

CREATE TABLE VacXin_ChiNhanh (
    MaVacXin varchar(10) NOT NULL,
    MaCN varchar(10) NOT NULL,
    TonKho int NOT NULL,
    CONSTRAINT PK_VacXin_ChiNhanh PRIMARY KEY (MaVacXin, MaCN),
    CONSTRAINT FK_VX_CN_VX FOREIGN KEY (MaVacXin) REFERENCES VacXin(MaVacXin),
    CONSTRAINT FK_VX_CN_CN FOREIGN KEY (MaCN) REFERENCES ChiNhanh(MaCN),
    CONSTRAINT CK_VX_CN_Ton CHECK (TonKho >= 0)
); 
GO

/* =========================================================
   4. NHÓM DỊCH VỤ CỐT LÕI (CORE SERVICES)
   ========================================================= */

CREATE TABLE DichVu (
    MaDV varchar(10) NOT NULL,
    TenDV nvarchar(50) NOT NULL,
    CONSTRAINT PK_DichVu PRIMARY KEY (MaDV),
    CONSTRAINT CK_DichVu_Loai CHECK (TenDV IN (N'Khám bệnh', N'Tiêm phòng', N'Mua hàng'))
); 
GO

CREATE TABLE CungCapDV (
    MaCN varchar(10) NOT NULL,
    MaDV varchar(10) NOT NULL,
    CONSTRAINT PK_CungCapDV PRIMARY KEY (MaCN, MaDV),
    CONSTRAINT FK_CungCap_CN FOREIGN KEY (MaCN) REFERENCES ChiNhanh(MaCN),
    CONSTRAINT FK_CungCap_DV FOREIGN KEY (MaDV) REFERENCES DichVu(MaDV)
); 
GO

CREATE TABLE PhieuDatDV (
    MaPhieuDV varchar(10) NOT NULL,
    NgayDatDV datetime NOT NULL,
    MaKH varchar(10),
    TenKhachHang nvarchar(50) NULL, 
    TenThuCung nvarchar(50) NULL,
    MaCN varchar(10) NOT NULL,
    MaDV varchar(10) NOT NULL,
    HinhThucDat nvarchar(20) NOT NULL,
    TrangThai nvarchar(20) NOT NULL,
    LoaiDichVu nvarchar(20) NOT NULL,
    BacSiPhuTrach varchar(10) NULL, 
    CONSTRAINT PK_PhieuDatDV PRIMARY KEY (MaPhieuDV),
    CONSTRAINT FK_PhieuDatDV_KH FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH),
    CONSTRAINT FK_PhieuDatDV_CN FOREIGN KEY (MaCN) REFERENCES ChiNhanh(MaCN),
    CONSTRAINT FK_PhieuDatDV_DV FOREIGN KEY (MaDV) REFERENCES DichVu(MaDV),
    CONSTRAINT FK_PhieuDatDV_BacSi FOREIGN KEY (BacSiPhuTrach) REFERENCES NhanVien(MaNV),
    CONSTRAINT CK_PhieuDatDV_HinhThuc CHECK (HinhThucDat IN (N'Tại quầy', N'Online')),
    CONSTRAINT CK_PhieuDatDV_TrangThai CHECK (TrangThai IN (N'Đang chờ', N'Đang thực hiện', N'Hủy', N'Hoàn thành', N'Đã thanh toán')),
    CONSTRAINT CK_PhieuDatDV_Loai CHECK (LoaiDichVu IN (N'Khám bệnh', N'Tiêm phòng', N'Mua hàng'))
); 
GO

CREATE TABLE DatKhamBenh (
    MaPhieuDV varchar(10) NOT NULL,
    NgayKham datetime NOT NULL,
    MoTaTrieuChung nvarchar(255) NULL,
    MoTaChuanDoan nvarchar(255) NULL,
    NgayTaiKham datetime NULL,
    TongTienDonThuoc int DEFAULT 0,
    MaTC varchar(10) NOT NULL,
	BacSiPhuTrach varchar(10),
    CONSTRAINT PK_PhieuKham PRIMARY KEY (MaPhieuDV),
    CONSTRAINT FK_PhieuKham_PhieuDatDV FOREIGN KEY (MaPhieuDV) REFERENCES PhieuDatDV(MaPhieuDV),
    CONSTRAINT FK_PhieuKham_ThuCung FOREIGN KEY (MaTC) REFERENCES ThuCung(MaTC),
    CONSTRAINT CK_PhieuKham_NTK CHECK (NgayTaiKham IS NULL OR NgayTaiKham > NgayKham),
	CONSTRAINT FK_PhieuKham_BacSi FOREIGN KEY (BacSiPhuTrach) REFERENCES NhanVien(MaNV),
    CONSTRAINT CK_PhieuKham_TongTien CHECK (TongTienDonThuoc >= 0)
); 
GO

CREATE TABLE DangKyGoiTP (
    MaDK varchar(10) NOT NULL,
    MaKH varchar(10) NOT NULL,
    MaGoiTP varchar(10) NOT NULL,
    ThoiGianBD datetime NOT NULL,
    ThoiGianKT datetime NOT NULL,
    CONSTRAINT PK_DangKyGoiTP PRIMARY KEY (MaDK),
    CONSTRAINT FK_DangKyGoiTP_KH FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH),
    CONSTRAINT FK_DangKyGoiTP_Goi FOREIGN KEY (MaGoiTP) REFERENCES GoiTiemPhong(MaGoiTP),
    CONSTRAINT CK_DangKyGoiTP_Ngay CHECK (ThoiGianKT > ThoiGianBD)
); 
GO

CREATE TABLE DatTiemPhong (
    MaPhieuDV varchar(10) NOT NULL,
    NgayTiem datetime NOT NULL,
    MaTC varchar(10) NOT NULL,
    MaDK varchar(10) NULL,
    BacSiPhuTrach varchar(10), 
    CONSTRAINT PK_PhieuTiem PRIMARY KEY (MaPhieuDV),
    CONSTRAINT FK_PhieuTiem_PhieuDatDV FOREIGN KEY (MaPhieuDV) REFERENCES PhieuDatDV(MaPhieuDV),
    CONSTRAINT FK_PhieuTiem_ThuCung FOREIGN KEY (MaTC) REFERENCES ThuCung(MaTC),
    CONSTRAINT FK_PhieuTiem_DK FOREIGN KEY (MaDK) REFERENCES DangKyGoiTP(MaDK),
    CONSTRAINT FK_PhieuTiem_BacSi FOREIGN KEY (BacSiPhuTrach) REFERENCES NhanVien(MaNV)
); 
GO

CREATE TABLE DatMuaHang (
    MaPhieuDV varchar(10) NOT NULL,
    DiaChiNhanHang nvarchar(200) NULL,
    TongTien int DEFAULT 0,
    CONSTRAINT PK_PhieuMuaHang PRIMARY KEY (MaPhieuDV),
    CONSTRAINT FK_PhieuMuaHang_PhieuDatDV FOREIGN KEY (MaPhieuDV) REFERENCES PhieuDatDV(MaPhieuDV),
    CONSTRAINT CK_PhieuMuaHang_TongTien CHECK (TongTien >= 0)
); 
GO

CREATE TABLE ThoiGianTiemChiDinh (
    MaDK varchar(10) NOT NULL,
    MaVacXin varchar(10) NOT NULL,
    ThangTiem datetime NULL,
    LieuLuong int NOT NULL,
    TrangThai nvarchar(20) NOT NULL,
    CONSTRAINT PK_TGTiem PRIMARY KEY (MaDK, MaVacXin),
    CONSTRAINT FK_TGTiem_DK FOREIGN KEY (MaDK) REFERENCES DangKyGoiTP(MaDK),
    CONSTRAINT FK_TGTiem_VX FOREIGN KEY (MaVacXin) REFERENCES VacXin(MaVacXin),
    CONSTRAINT CK_TGTiem_Thang CHECK (ThangTiem > 0),
    CONSTRAINT CK_TGTiem_LieuLuong CHECK (LieuLuong > 0),
    CONSTRAINT CK_TGTiem_TrangThai CHECK (TrangThai IN (N'Chưa tiêm', N'Đã tiêm'))
); 
GO

/* =========================================================
   5. NHÓM CHI TIẾT GIAO DỊCH (SNAPSHOT DỮ LIỆU)
   ========================================================= */

CREATE TABLE DonThuoc (
    MaPhieuDV varchar(10) NOT NULL,
    MaSP varchar(10) NOT NULL,
    MaCN varchar(10) NOT NULL,
    TenSP_SnapShot nvarchar(50) NULL,
    DonGia_LucMua int DEFAULT 0,
    SoLuongMua int NOT NULL,
    ThanhTien int DEFAULT 0,
    TanSuat int,
    LieuDung nvarchar(50),
    CONSTRAINT PK_DonThuoc PRIMARY KEY (MaPhieuDV, MaSP),
    CONSTRAINT FK_DonThuoc_PhieuKham FOREIGN KEY (MaPhieuDV) REFERENCES DatKhamBenh(MaPhieuDV),
    CONSTRAINT FK_DonThuoc_SPCN FOREIGN KEY (MaSP, MaCN) REFERENCES SPCuaTungCN(MaSP, MaCN),
    CONSTRAINT CK_DonThuoc_SL CHECK (SoLuongMua > 0),
    CONSTRAINT CK_DonThuoc_ThanhTien CHECK (ThanhTien >= 0)
); 
GO

CREATE TABLE DanhSachSP (
    MaPhieuDV varchar(10) NOT NULL,
    MaSP varchar(10) NOT NULL,
    MaCN varchar(10) NOT NULL,
    TenSP_SnapShot nvarchar(50) NULL,
    DonGia_LucMua int DEFAULT 0,
    SoLuongMua int NOT NULL,
    CONSTRAINT PK_DanhSachSP PRIMARY KEY (MaPhieuDV, MaSP),
    CONSTRAINT FK_DanhSachSP_PhieuMua FOREIGN KEY (MaPhieuDV) REFERENCES DatMuaHang(MaPhieuDV),
    CONSTRAINT FK_DanhSachSP_SPCN FOREIGN KEY (MaSP, MaCN) REFERENCES SPCuaTungCN(MaSP, MaCN),
    CONSTRAINT CK_DanhSachSP_SL CHECK (SoLuongMua > 0)
); 
GO

CREATE TABLE DanhSachVacXin (
    MaPhieuDV varchar(10) NOT NULL,
    MaVacXin varchar(10) NOT NULL,
    LieuLuong int NOT NULL,
    DonGia int DEFAULT 0,
    CONSTRAINT PK_DanhSachVX PRIMARY KEY (MaPhieuDV, MaVacXin),
    CONSTRAINT FK_DanhSachVX_Phieu FOREIGN KEY (MaPhieuDV) REFERENCES DatTiemPhong(MaPhieuDV),
    CONSTRAINT FK_DanhSachVX_VX FOREIGN KEY (MaVacXin) REFERENCES VacXin(MaVacXin),
    CONSTRAINT CK_DanhSachVX_LieuLuong CHECK (LieuLuong > 0)
); 
GO

/* =========================================================
   6. NHÓM HÓA ĐƠN & ĐÁNH GIÁ
   ========================================================= */

CREATE TABLE HoaDon (
    MaHoaDon varchar(10) NOT NULL,
    MaNVLap varchar(10) NOT NULL,
    MaKH varchar(10),
    MaCN varchar(10) NOT NULL,
    MaKhuyenMai varchar(10) NULL,
    NgayLap datetime NOT NULL,
    TongTien int NOT NULL,
    HinhThucThanhToan nvarchar(15) NOT NULL,
    CONSTRAINT PK_HoaDon PRIMARY KEY (MaHoaDon),
    CONSTRAINT FK_HoaDon_NV FOREIGN KEY (MaNVLap) REFERENCES NhanVien(MaNV),
    CONSTRAINT FK_HoaDon_KH FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH),
    CONSTRAINT FK_HoaDon_CN FOREIGN KEY (MaCN) REFERENCES ChiNhanh(MaCN),
    CONSTRAINT FK_HoaDon_KM FOREIGN KEY (MaKhuyenMai) REFERENCES KhuyenMai(MaKhuyenMai),
    CONSTRAINT CK_HoaDon_TongTien CHECK (TongTien >= 0),
    CONSTRAINT CK_HoaDon_HTTT CHECK (HinhThucThanhToan IN (N'Chuyển khoản', N'Tiền mặt'))	
); 
GO

CREATE TABLE ChiTietHoaDon (
    MaHoaDon varchar(10) NOT NULL,
    MaPhieuDV varchar(10) NOT NULL,
    TongTienDV int NOT NULL,
    CONSTRAINT PK_ChiTietHoaDon PRIMARY KEY (MaHoaDon, MaPhieuDV),
    CONSTRAINT FK_CTHD_HoaDon FOREIGN KEY (MaHoaDon) REFERENCES HoaDon(MaHoaDon),
    CONSTRAINT FK_CTHD_PhieuDV FOREIGN KEY (MaPhieuDV) REFERENCES PhieuDatDV(MaPhieuDV),
    CONSTRAINT CK_CTHD_Tong CHECK (TongTienDV >= 0)
); 
GO


CREATE TABLE DanhGia (
    MaPhieuDV varchar(10) NOT NULL,
    NgayDanhGia datetime NOT NULL,
    MaKH varchar(10) NOT NULL,
    DiemDanhGia int NOT NULL,
    ThaiDoNhanVien int NULL,
    MucDoHaiLong nvarchar(20) NULL,
    BinhLuan nvarchar(255) NULL,
    CONSTRAINT PK_DanhGia PRIMARY KEY (MaPhieuDV, NgayDanhGia),
    CONSTRAINT FK_DanhGia_Phieu FOREIGN KEY (MaPhieuDV) REFERENCES PhieuDatDV(MaPhieuDV),
    CONSTRAINT FK_DanhGia_KH FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH),
    CONSTRAINT CK_DanhGia_Diem CHECK (DiemDanhGia BETWEEN 1 AND 10),
    CONSTRAINT CK_DanhGia_Ngay CHECK (NgayDanhGia <= GETDATE()),
    CONSTRAINT CK_DanhGia_MucDo CHECK (MucDoHaiLong IN (N'Tệ', N'Chưa đạt', N'Ổn', N'Tốt', N'Tuyệt vời'))
); 
GO