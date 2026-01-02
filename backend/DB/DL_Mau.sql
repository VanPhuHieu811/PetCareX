/* =========================================================
   PETCAREX - SEED DATA (SAMPLE DATA 10+ ROWS)
   Author: Gemini
   Note: Dữ liệu được insert theo thứ tự để đảm bảo Khóa Ngoại
   ========================================================= */

USE PetCareX;
GO

-- 1. Insert CHI NHÁNH
INSERT INTO ChiNhanh (MaCN, TenCN, DiaChi, SDT, ThoiGianMo, ThoiGianDong) VALUES
('CN001', N'PetCareX Quận 1', N'123 Nguyễn Huệ, Q1, TP.HCM', '0281111111', '08:00:00', '21:00:00'),
('CN002', N'PetCareX Quận 3', N'45 Võ Thị Sáu, Q3, TP.HCM', '0281111112', '08:00:00', '21:00:00'),
('CN003', N'PetCareX Quận 5', N'67 Nguyễn Trãi, Q5, TP.HCM', '0281111113', '08:00:00', '21:00:00'),
('CN004', N'PetCareX Quận 7', N'89 Nguyễn Văn Linh, Q7, TP.HCM', '0281111114', '07:30:00', '22:00:00'),
('CN005', N'PetCareX Quận 10', N'101 Thành Thái, Q10, TP.HCM', '0281111115', '08:00:00', '21:00:00'),
('CN006', N'PetCareX Thủ Đức', N'234 Võ Văn Ngân, Thủ Đức', '0281111116', '07:00:00', '22:00:00'),
('CN007', N'PetCareX Bình Thạnh', N'56 Lê Quang Định, Bình Thạnh', '0281111117', '08:00:00', '21:00:00'),
('CN008', N'PetCareX Gò Vấp', N'78 Phan Văn Trị, Gò Vấp', '0281111118', '08:00:00', '21:00:00'),
('CN009', N'PetCareX Tân Bình', N'90 Cộng Hòa, Tân Bình', '0281111119', '08:00:00', '21:00:00'),
('CN010', N'PetCareX Phú Nhuận', N'12 Phan Xích Long, Phú Nhuận', '0281111120', '08:00:00', '21:00:00');

-- 2. Insert CHỨC VỤ (Đúng tên theo ràng buộc CHECK)
INSERT INTO ChucVu (MaChucVu, TenChucVu) VALUES
('CV001', N'Quản lý chi nhánh'),
('CV002', N'Bác sĩ thú y'),
('CV003', N'Nhân viên bán hàng'),
('CV004', N'Nhân viên tiếp tân');

-- 3. Insert LOẠI THÀNH VIÊN
INSERT INTO LoaiThanhVien (MaLoaiTV, TenLoaiTV, SoTienChiTieu, SoTienDuyTri) VALUES
('LTV01', N'Cơ bản', 0, 0),
('LTV02', N'Thân thiết', 5000000, 3000000),
('LTV03', N'VIP', 12000000, 8000000);

-- 4. Insert LOẠI SẢN PHẨM
INSERT INTO LoaiSP (MaLoaiSP, TenLoaiSP) VALUES
('LSP01', N'Thuốc'),    -- Quan trọng cho Trigger Đơn Thuốc
('LSP02', N'Thức ăn'),
('LSP03', N'Phụ kiện');

-- 5. Insert SẢN PHẨM
INSERT INTO SanPham (MaSP, TenSP, MaLoaiSP, GiaBan) VALUES
('SP001', N'Thuốc trị ve chó Bravecto', 'LSP01', 500000),
('SP002', N'Thuốc tẩy giun Drontal', 'LSP01', 150000),
('SP003', N'Kháng sinh Amoxicillin', 'LSP01', 80000),
('SP004', N'Vitamin tổng hợp PetTabs', 'LSP01', 200000),
('SP005', N'Hạt Royal Canin Puppy', 'LSP02', 350000),
('SP006', N'Pate Whiskas Mèo', 'LSP02', 30000),
('SP007', N'Xương gặm sạch răng', 'LSP02', 50000),
('SP008', N'Dây dắt chó Flexi', 'LSP03', 450000),
('SP009', N'Bát ăn chống sặc', 'LSP03', 120000),
('SP010', N'Chuồng vận chuyển size L', 'LSP03', 800000);

-- 6. Insert KHUYẾN MÃI
INSERT INTO KhuyenMai (MaKhuyenMai, TenKhuyenMai, PhanTramGiam) VALUES
('KM001', N'Mừng khai trương', 10),
('KM002', N'Black Friday', 50),
('KM003', N'Khách hàng mới', 5),
('KM004', N'Sinh nhật cửa hàng', 20),
('KM005', N'Tết Nguyên Đán', 15),
('KM006', N'Giáng sinh', 10),
('KM007', N'Quốc khánh 2/9', 10),
('KM008', N'Hè rực rỡ', 5),
('KM009', N'Tri ân khách VIP', 25),
('KM010', N'Flash Sale', 30);

-- 7. Insert NGƯỜI DÙNG (20 người: 10 NV, 10 KH)
-- NV01: Quản lý, NV02-04: Bác sĩ, NV05-07: Bán hàng, NV08-10: Tiếp tân
INSERT INTO NguoiDung (MaND, HoTen, Email, NgaySinh, GioiTinh, SDT, CCCD, LoaiND) VALUES
('ND001', N'Nguyễn Văn Quản Lý', 'quanly1@gmail.com', '1990-01-01', N'Nam', '0901000001', '001090000001', N'Nhân viên'),
('ND002', N'Trần Thị Bác Sĩ A', 'bacsi1@gmail.com', '1992-05-05', N'Nữ', '0901000002', '001090000002', N'Nhân viên'),
('ND003', N'Lê Văn Bác Sĩ B', 'bacsi2@gmail.com', '1988-08-08', N'Nam', '0901000003', '001090000003', N'Nhân viên'),
('ND004', N'Phạm Thị Bác Sĩ C', 'bacsi3@gmail.com', '1995-02-02', N'Nữ', '0901000004', '001090000004', N'Nhân viên'),
('ND005', N'Hoàng Văn Bán Hàng A', 'banhang1@gmail.com', '2000-10-10', N'Nam', '0901000005', '001090000005', N'Nhân viên'),
('ND006', N'Võ Thị Bán Hàng B', 'banhang2@gmail.com', '2001-11-11', N'Nữ', '0901000006', '001090000006', N'Nhân viên'),
('ND007', N'Đặng Văn Bán Hàng C', 'banhang3@gmail.com', '1999-12-12', N'Nam', '0901000007', '001090000007', N'Nhân viên'),
('ND008', N'Bùi Thị Tiếp Tân A', 'tieptan1@gmail.com', '2002-03-03', N'Nữ', '0901000008', '001090000008', N'Nhân viên'),
('ND009', N'Đỗ Văn Tiếp Tân B', 'tieptan2@gmail.com', '2003-04-04', N'Nam', '0901000009', '001090000009', N'Nhân viên'),
('ND010', N'Ngô Thị Tiếp Tân C', 'tieptan3@gmail.com', '2002-06-06', N'Nữ', '0901000010', '001090000010', N'Nhân viên'),
('KH001', N'Khách Hàng Một', 'kh1@gmail.com', '1995-01-01', N'Nam', '0902000001', '001095000001', N'Khách hàng'),
('KH002', N'Khách Hàng Hai', 'kh2@gmail.com', '1996-02-02', N'Nữ', '0902000002', '001096000002', N'Khách hàng'),
('KH003', N'Khách Hàng Ba', 'kh3@gmail.com', '1997-03-03', N'Nam', '0902000003', '001097000003', N'Khách hàng'),
('KH004', N'Khách Hàng Bốn', 'kh4@gmail.com', '1998-04-04', N'Nữ', '0902000004', '001098000004', N'Khách hàng'),
('KH005', N'Khách Hàng Năm', 'kh5@gmail.com', '1990-05-05', N'Nam', '0902000005', '001090000005', N'Khách hàng'),
('KH006', N'Khách Hàng Sáu', 'kh6@gmail.com', '1991-06-06', N'Nữ', '0902000006', '001091000006', N'Khách hàng'),
('KH007', N'Khách Hàng Bảy', 'kh7@gmail.com', '1992-07-07', N'Nam', '0902000007', '001092000007', N'Khách hàng'),
('KH008', N'Khách Hàng Tám', 'kh8@gmail.com', '1993-08-08', N'Nữ', '0902000008', '001093000008', N'Khách hàng'),
('KH009', N'Khách Hàng Chín', 'kh9@gmail.com', '1994-09-09', N'Nam', '0902000009', '001094000009', N'Khách hàng'),
('KH010', N'Khách Hàng Mười', 'kh10@gmail.com', '1989-10-10', N'Nữ', '0902000010', '001089000010', N'Khách hàng');

-- 8. Insert TÀI KHOẢN
INSERT INTO TaiKhoan (MaND, MatKhau, TrangThai) VALUES
('ND001', 'password123', N'Hoạt động'), ('ND002', 'password123', N'Hoạt động'),
('ND003', 'password123', N'Hoạt động'), ('ND004', 'password123', N'Hoạt động'),
('ND005', 'password123', N'Hoạt động'), ('ND006', 'password123', N'Hoạt động'),
('ND007', 'password123', N'Hoạt động'), ('ND008', 'password123', N'Hoạt động'),
('ND009', 'password123', N'Hoạt động'), ('ND010', 'password123', N'Hoạt động'),
('KH001', 'khach123', N'Hoạt động'), ('KH002', 'khach123', N'Hoạt động'),
('KH003', 'khach123', N'Hoạt động'), ('KH004', 'khach123', N'Hoạt động'),
('KH005', 'khach123', N'Hoạt động'), ('KH006', 'khach123', N'Hoạt động'),
('KH007', 'khach123', N'Hoạt động'), ('KH008', 'khach123', N'Khóa'),
('KH009', 'khach123', N'Hoạt động'), ('KH010', 'khach123', N'Hoạt động');

-- 9. Insert NHÂN VIÊN
INSERT INTO NhanVien (MaNV, NgayVaoLam, LuongCoBan, TrangThai, MaChucVu, MaCN) VALUES
('ND001', '2020-01-01', 20000000, N'Đang làm', 'CV001', 'CN001'), -- Quản lý
('ND002', '2021-02-01', 15000000, N'Đang làm', 'CV002', 'CN001'), -- Bác sĩ
('ND003', '2021-03-01', 15000000, N'Đang làm', 'CV002', 'CN002'), -- Bác sĩ
('ND004', '2021-04-01', 15000000, N'Đang làm', 'CV002', 'CN003'), -- Bác sĩ
('ND005', '2022-01-01', 8000000, N'Đang làm', 'CV003', 'CN001'), -- Bán hàng
('ND006', '2022-02-01', 8000000, N'Đang làm', 'CV003', 'CN002'), -- Bán hàng
('ND007', '2022-03-01', 8000000, N'Đang làm', 'CV003', 'CN003'), -- Bán hàng
('ND008', '2023-01-01', 7000000, N'Đang làm', 'CV004', 'CN001'), -- Tiếp tân
('ND009', '2023-02-01', 7000000, N'Đang làm', 'CV004', 'CN002'), -- Tiếp tân
('ND010', '2023-03-01', 7000000, N'Nghỉ việc', 'CV004', 'CN003'); -- Tiếp tân (Nghỉ)

-- 10. Insert KHÁCH HÀNG
INSERT INTO KhachHang (MaKH, LanCuoiToiCuaHang, MaLoaiTV, DiemLoyalty) VALUES
('KH001', '2025-01-01', 'LTV01', 10),
('KH002', '2025-01-02', 'LTV02', 150),
('KH003', '2025-01-03', 'LTV03', 500),
('KH004', '2025-01-04', 'LTV01', 0),
('KH005', '2025-01-05', 'LTV01', 20),
('KH006', '2025-01-06', 'LTV02', 120),
('KH007', '2025-01-07', 'LTV01', 5),
('KH008', NULL, 'LTV01', 0),
('KH009', '2025-01-09', 'LTV03', 600),
('KH010', '2025-01-10', 'LTV02', 200);

-- 11. Insert LOẠI THÚ CƯNG
INSERT INTO LoaiThuCung (MaLoaiTC, TenLoaiTC) VALUES
('LTC01', N'Chó'),
('LTC02', N'Mèo'),
('LTC03', N'Thỏ');

-- 12. Insert GIỐNG
INSERT INTO Giong (MaGiong, TenGiong, MaLoaiTC) VALUES
('G001', N'Poodle', 'LTC01'),
('G002', N'Corgi', 'LTC01'),
('G003', N'Husky', 'LTC01'),
('G004', N'Mèo Anh Lông Ngắn', 'LTC02'),
('G005', N'Mèo Ba Tư', 'LTC02'),
('G006', N'Mèo Mướp', 'LTC02'),
('G007', N'Thỏ Hà Lan', 'LTC03'),
('G008', N'Thỏ Sư Tử', 'LTC03'),
('G009', N'Chihuahua', 'LTC01'),
('G010', N'Golden Retriever', 'LTC01');

-- 13. Insert THÚ CƯNG
INSERT INTO ThuCung (MaTC, TenTC, MaGiong, NgaySinh, TinhTrangSucKhoe, MaKH, GioiTinh) VALUES
('TC001', N'Milu', 'G001', '2023-01-01', N'Khỏe mạnh', 'KH001', N'Đực'),
('TC002', N'Mimi', 'G004', '2022-05-15', N'Bệnh ngoài da', 'KH001', N'Cái'),
('TC003', N'Lu', 'G002', '2021-08-20', N'Khỏe mạnh', 'KH002', N'Đực'),
('TC004', N'Kitty', 'G005', '2023-03-10', N'Tiêu chảy', 'KH003', N'Cái'),
('TC005', N'Bunny', 'G007', '2024-01-01', N'Khỏe mạnh', 'KH004', N'Đực'),
('TC006', N'Rex', 'G003', '2020-12-12', N'Gãy chân', 'KH005', N'Đực'),
('TC007', N'Lucky', 'G010', '2019-06-01', N'Khỏe mạnh', 'KH006', N'Cái'),
('TC008', N'Bông', 'G001', '2023-09-09', N'Khỏe mạnh', 'KH007', N'Đực'),
('TC009', N'Mướp', 'G006', '2022-02-02', N'Bỏ ăn', 'KH009', N'Cái'),
('TC010', N'Tiny', 'G009', '2024-02-02', N'Khỏe mạnh', 'KH010', N'Đực');

-- 14. Insert GÓI TIÊM PHÒNG
INSERT INTO GoiTiemPhong (MaGoiTP, TenGoiTP, UuDaiGiamTien, ThoiHan) VALUES
('GTP01', N'Gói cho chó con', 10, 12),
('GTP02', N'Gói cho mèo con', 10, 12),
('GTP03', N'Gói toàn diện Chó', 15, 12),
('GTP04', N'Gói toàn diện Mèo', 15, 12),
('GTP05', N'Gói cơ bản Chó', 5, 6),
('GTP06', N'Gói cơ bản Mèo', 5, 6),
('GTP07', N'Gói dại hàng năm', 5, 12),
('GTP08', N'Gói 7 bệnh chó', 12, 12),
('GTP09', N'Gói 4 bệnh mèo', 12, 12),
('GTP10', N'Gói đặc biệt', 15, 12);

-- 15. Insert VẮC XIN
INSERT INTO VacXin (MaVacXin, TenVacXin, NgaySanXuat, DonViTinh, GiaVacXin) VALUES
('VX001', N'Rabisin (Dại)', '2024-01-01', 'ml', 100000),
('VX002', N'Recombitek (5 bệnh chó)', '2024-02-01', 'ml', 250000),
('VX003', N'Vanguard (7 bệnh chó)', '2024-03-01', 'ml', 300000),
('VX004', N'Tricat (3 bệnh mèo)', '2024-01-15', 'ml', 200000),
('VX005', N'Leucorifelin (Giảm bạch cầu)', '2024-02-15', 'ml', 180000),
('VX006', N'Biocan (Nấm)', '2024-03-15', 'ml', 150000),
('VX007', N'Nobivac Puppy', '2024-04-01', 'ml', 220000),
('VX008', N'Vaccine Care', '2024-05-01', 'ml', 120000),
('VX009', N'Rabies Vaccine', '2024-01-10', 'ml', 90000),
('VX010', N'Feline Vaccine', '2024-02-20', 'ml', 210000);

-- 16. Insert TỒN KHO VẮC XIN CHI NHÁNH
INSERT INTO VacXin_ChiNhanh (MaVacXin, MaCN, TonKho) VALUES
('VX001', 'CN001', 100), ('VX002', 'CN001', 50),
('VX001', 'CN002', 80),  ('VX003', 'CN001', 40),
('VX004', 'CN003', 60),  ('VX005', 'CN002', 70),
('VX006', 'CN001', 30),  ('VX007', 'CN004', 90),
('VX008', 'CN005', 100), ('VX009', 'CN001', 100);

-- 17. Insert TỒN KHO SẢN PHẨM CHI NHÁNH
INSERT INTO SPCuaTungCN (MaSP, MaCN, SoLuongTonKho) VALUES
('SP001', 'CN001', 50), ('SP002', 'CN001', 100),
('SP003', 'CN001', 200), ('SP004', 'CN001', 60),
('SP005', 'CN002', 40), ('SP006', 'CN002', 80),
('SP007', 'CN003', 100), ('SP008', 'CN001', 10),
('SP009', 'CN004', 30), ('SP010', 'CN005', 5);

-- 18. Insert DỊCH VỤ
INSERT INTO DichVu (MaDV, TenDV) VALUES
('DV001', N'Khám bệnh'),
('DV002', N'Tiêm Phòng'),
('DV003', N'Mua hàng');

-- 19. Insert CUNG CẤP DỊCH VỤ
INSERT INTO CungCapDV (MaCN, MaDV) VALUES
('CN001', 'DV001'), ('CN001', 'DV002'), ('CN001', 'DV003'),
('CN002', 'DV001'), ('CN002', 'DV003'),
('CN003', 'DV002'), ('CN003', 'DV003'),
('CN004', 'DV001'), ('CN004', 'DV002'),
('CN005', 'DV003');

-- 20. Insert ĐĂNG KÝ GÓI TIÊM PHÒNG
INSERT INTO DangKyGoiTP (MaDK, MaKH, MaGoiTP, ThoiGianBD, ThoiGianKT) VALUES
('DK001', 'KH001', 'GTP01', '2025-01-01', '2025-12-31'),
('DK002', 'KH002', 'GTP03', '2025-02-01', '2026-02-01'),
('DK003', 'KH003', 'GTP02', '2025-01-15', '2026-01-15'),
('DK004', 'KH004', 'GTP04', '2025-03-01', '2026-03-01'),
('DK005', 'KH005', 'GTP05', '2025-01-01', '2025-07-01'),
('DK006', 'KH006', 'GTP01', '2025-01-01', '2026-01-01'),
('DK007', 'KH007', 'GTP07', '2025-01-01', '2026-01-01'),
('DK008', 'KH009', 'GTP08', '2025-01-01', '2026-01-01'),
('DK009', 'KH010', 'GTP03', '2025-01-01', '2026-01-01'),
('DK010', 'KH001', 'GTP10', '2026-01-01', '2027-01-01');

-- 21. Insert THỜI GIAN TIÊM CHỈ ĐỊNH
-- Lưu ý Trigger: ThangTiem phải nằm trong khoảng BD và KT của MaDK
INSERT INTO ThoiGianTiemChiDinh (MaDK, MaVacXin, ThangTiem, LieuLuong) VALUES
('DK001', 'VX002', '2025-02-01', 1),
('DK001', 'VX003', '2025-03-01', 1),
('DK002', 'VX001', '2025-03-01', 1),
('DK003', 'VX004', '2025-02-15', 1),
('DK004', 'VX005', '2025-04-01', 1),
('DK005', 'VX002', '2025-02-01', 1),
('DK006', 'VX002', '2025-02-01', 1),
('DK007', 'VX001', '2025-06-01', 1),
('DK008', 'VX003', '2025-02-01', 1),
('DK009', 'VX002', '2025-02-01', 1);

-- 22. Insert PHIẾU ĐẶT DỊCH VỤ
-- PDV001-004: Khám, PDV005-007: Tiêm, PDV008-010: Mua
INSERT INTO PhieuDatDV (MaPhieuDV, NgayDatDV, MaKH, MaCN, MaDV, HinhThucDat, TrangThai, LoaiDichVu) VALUES
('PDV001', '2025-01-01 08:00:00', 'KH001', 'CN001', 'DV001', N'Online', N'Hoàn Thành', N'Khám bệnh'),
('PDV002', '2025-01-01 09:00:00', 'KH001', 'CN001', 'DV001', N'Tại quầy', N'Hoàn Thành', N'Khám bệnh'),
('PDV003', '2025-01-02 10:00:00', 'KH002', 'CN001', 'DV001', N'Online', N'Đang chờ', N'Khám bệnh'),
('PDV004', '2025-01-03 14:00:00', 'KH003', 'CN002', 'DV001', N'Online', N'Hủy', N'Khám bệnh'),
('PDV005', '2025-01-01 08:30:00', 'KH004', 'CN001', 'DV002', N'Online', N'Hoàn Thành', N'Tiêm Phòng'),
('PDV006', '2025-01-02 09:30:00', 'KH005', 'CN003', 'DV002', N'Tại quầy', N'Hoàn Thành', N'Tiêm Phòng'),
('PDV007', '2025-01-04 15:00:00', 'KH001', 'CN001', 'DV002', N'Online', N'Xác nhận', N'Tiêm Phòng'),
('PDV008', '2025-01-01 10:00:00', 'KH006', 'CN001', 'DV003', N'Tại quầy', N'Hoàn Thành', N'Mua hàng'),
('PDV009', '2025-01-01 11:00:00', 'KH007', 'CN001', 'DV003', N'Tại quầy', N'Hoàn Thành', N'Mua hàng'),
('PDV010', '2025-01-05 16:00:00', 'KH002', 'CN002', 'DV003', N'Online', N'Hoàn Thành', N'Mua hàng');

-- 23. Insert PHIẾU KHÁM BỆNH (Cho PDV001, PDV002)
-- BacSiPhuTrach phải là CV002 (ND002, ND003, ND004)
INSERT INTO PhieuDatDVKhamBenh (MaPhieuDV, NgayKham, MoTaTrieuChung, MoTaChuanDoan, NgayTaiKham, TongTienDonThuoc, MaTC, BacSiPhuTrach) VALUES
('PDV001', '2025-01-01 08:15:00', N'Ngứa, rụng lông', N'Viêm da', '2025-01-08 08:00:00', 650000, 'TC001', 'ND002'),
('PDV002', '2025-01-01 09:15:00', N'Ho khạc', N'Viêm phổi', NULL, 280000, 'TC002', 'ND002');

-- 24. Insert PHIẾU TIÊM PHÒNG (Cho PDV005, PDV006)
INSERT INTO PhieuDatDVTiemPhong (MaPhieuDV, NgayTiem, MaTC, MaDK, BacSiPhuTrach) VALUES
('PDV005', '2025-01-01 08:45:00', 'TC005', NULL, 'ND002'), -- Tiêm lẻ
('PDV006', '2025-01-02 09:45:00', 'TC006', 'DK005', 'ND004'); -- Tiêm theo gói

-- 25. Insert PHIẾU MUA HÀNG (Cho PDV008, PDV009, PDV010)
INSERT INTO PhieuDatDVMuaHang (MaPhieuDV, TongTien) VALUES
('PDV008', 380000),
('PDV009', 450000),
('PDV010', 800000);

-- 26. Insert ĐƠN THUỐC (Chi tiết cho PDV001, PDV002)
-- MaSP phải là thuốc (SP001-SP004) do trigger quy định
INSERT INTO DonThuoc (MaPhieuDV, MaSP, SoLuongMua, ThanhTien) VALUES
('PDV001', 'SP001', 1, 500000),
('PDV001', 'SP002', 1, 150000),
('PDV002', 'SP003', 2, 160000),
('PDV002', 'SP004', 1, 120000);

-- 27. Insert DANH SÁCH VACXIN (Chi tiết cho PDV005, PDV006)
INSERT INTO DanhSachVacXin (MaPhieuDV, MaVacXin, LieuLuong) VALUES
('PDV005', 'VX007', 1),
('PDV006', 'VX002', 1);

-- 28. Insert DANH SÁCH SẢN PHẨM MUA (Chi tiết cho PDV008, 009, 010)
INSERT INTO DanhSachSP (MaPhieuDV, MaSP, SoLuongMua) VALUES
('PDV008', 'SP005', 1), ('PDV008', 'SP006', 1),
('PDV009', 'SP008', 1),
('PDV010', 'SP010', 1);

-- 29. Insert ĐIỀU ĐỘNG (MaNVDieuDong phải là Quản lý ND001)
INSERT INTO DieuDong (MaCN, MaNV, NgayBD, NgayKT, MaNVDieuDong) VALUES
('CN002', 'ND002', '2024-01-01', '2024-06-01', 'ND001'),
('CN003', 'ND005', '2024-02-01', NULL, 'ND001'),
('CN001', 'ND003', '2024-03-01', NULL, 'ND001'),
('CN002', 'ND004', '2024-04-01', NULL, 'ND001'),
('CN003', 'ND006', '2024-05-01', NULL, 'ND001'),
('CN001', 'ND007', '2024-06-01', NULL, 'ND001'),
('CN002', 'ND008', '2024-07-01', NULL, 'ND001'),
('CN003', 'ND009', '2024-08-01', NULL, 'ND001'),
('CN001', 'ND010', '2024-09-01', '2024-12-01', 'ND001'),
('CN004', 'ND002', '2024-12-01', NULL, 'ND001');

-- 30. Insert HÓA ĐƠN
-- MaNVLap phải là Bán hàng (CV003: ND005, ND006, ND007)
INSERT INTO HoaDon (MaHoaDon, MaNVLap, MaKH, MaCN, MaKhuyenMai, NgayLap, TongTien, HinhThucThanhToan) VALUES
('HD001', 'ND005', 'KH001', 'CN001', NULL, '2025-01-01 09:00:00', 850000, N'Tiền mặt'), -- Cho PDV001 (650k) + công khám 200k
('HD002', 'ND005', 'KH001', 'CN001', 'KM001', '2025-01-01 10:00:00', 380000, N'Tiền mặt'), -- Cho PDV002 (280k) + công khám 100k
('HD003', 'ND005', 'KH004', 'CN001', NULL, '2025-01-01 09:00:00', 220000, N'Chuyển khoản'), -- Cho PDV005 (VX007 220k)
('HD004', 'ND006', 'KH006', 'CN001', NULL, '2025-01-01 10:15:00', 380000, N'Tiền mặt'), -- Cho PDV008
('HD005', 'ND005', 'KH007', 'CN001', 'KM003', '2025-01-01 11:15:00', 450000, N'Chuyển khoản'), -- Cho PDV009
('HD006', 'ND006', 'KH002', 'CN002', NULL, '2025-01-05 16:30:00', 800000, N'Chuyển khoản'), -- Cho PDV010
('HD007', 'ND007', 'KH001', 'CN001', NULL, '2025-01-06 09:00:00', 100000, N'Tiền mặt'), -- Mua lẻ
('HD008', 'ND005', 'KH003', 'CN001', NULL, '2025-01-07 10:00:00', 200000, N'Tiền mặt'), -- Mua lẻ
('HD009', 'ND006', 'KH005', 'CN002', NULL, '2025-01-08 11:00:00', 300000, N'Chuyển khoản'), -- Mua lẻ
('HD010', 'ND007', 'KH008', 'CN003', NULL, '2025-01-09 12:00:00', 150000, N'Tiền mặt'); -- Mua lẻ

-- 31. Insert CHI TIẾT HÓA ĐƠN
INSERT INTO ChiTietHoaDon (MaHoaDon, MaPhieuDV, TongTienTungDV) VALUES
('HD001', 'PDV001', 850000),
('HD002', 'PDV002', 380000),
('HD003', 'PDV005', 220000),
('HD004', 'PDV008', 380000),
('HD005', 'PDV009', 450000),
('HD006', 'PDV010', 800000);

-- 32. Insert ĐÁNH GIÁ
INSERT INTO DanhGia (MaPhieuDV, NgayDanhGia, MaKH, DiemDanhGia, ThaiDoNhanVien, MucDoHaiLong, BinhLuan) VALUES
('PDV001', '2025-01-02 08:00:00', 'KH001', 5, 5, N'Tuyệt vời', N'Bác sĩ rất tận tâm'),
('PDV005', '2025-01-02 09:00:00', 'KH004', 4, 4, N'Tốt', N'Tiêm nhanh, bé không khóc'),
('PDV008', '2025-01-01 12:00:00', 'KH006', 5, 5, N'Tuyệt vời', N'Hàng chất lượng'),
('PDV010', '2025-01-06 09:00:00', 'KH002', 3, 2, N'Ổn', N'Giao hàng hơi chậm'),
('PDV002', '2025-01-02 10:00:00', 'KH001', 5, 5, N'Tuyệt vời', N'Sạch sẽ'),
('PDV009', '2025-01-02 11:00:00', 'KH007', 4, 4, N'Tốt', N'Nhân viên thân thiện'),
('PDV006', '2025-01-03 10:00:00', 'KH005', 5, 5, N'Tuyệt vời', NULL),
('PDV007', '2025-01-05 10:00:00', 'KH001', 4, 4, N'Tốt', NULL),
('PDV003', '2025-01-03 10:00:00', 'KH002', 1, 1, N'Tệ', N'Chờ quá lâu'),
('PDV004', '2025-01-04 10:00:00', 'KH003', 2, 2, N'Chưa đạt', N'Hủy lịch không báo sớm');
GO