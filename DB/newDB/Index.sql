-- 1. Tối ưu cho bác sĩ lấy danh sách khám và tính doanh thu (T1) - Mạnh
CREATE NONCLUSTERED INDEX IX_PhieuDatDV_BacSi_TrangThai_LoaiDV 
ON PhieuDatDV (BacSiPhuTrach, TrangThai, LoaiDichVu)
INCLUDE (TenKhachHang, TenThuCung); 

CREATE NONCLUSTERED INDEX IX_NhanVien_TenChucVu 
ON NhanVien (TenChucVu); 

CREATE NONCLUSTERED INDEX IX_ChiTietHoaDon_MaPhieuDV_Include_TongTien
ON ChiTietHoaDon (MaPhieuDV)
INCLUDE (TongTienDV);

-- 2. Tối ưu tra cứu theo ngày thực tế (T3) - Huy
CREATE NONCLUSTERED INDEX IX_PhieuDatDV_BacSi_TrangThai_LoaiDV 
ON PhieuDatDV (BacSiPhuTrach, TrangThai, LoaiDichVu)
INCLUDE (TenKhachHang, TenThuCung); 

CREATE NONCLUSTERED INDEX IX_DatKhamBenh_NgayKham 
ON DatKhamBenh (NgayKham);

CREATE NONCLUSTERED INDEX IX_DatTiemPhong_NgayTiem 
ON DatTiemPhong (NgayTiem);

-- 3. Tối ưu tra cứu lịch sử thú cưng của khách hàng (T4) - Hiệu
CREATE NONCLUSTERED INDEX IX_ThuCung_MaKH_Include_Info
ON ThuCung (MaKH)
INCLUDE (TenTC, TenGiong, NgaySinh, GioiTinh);

-- 4. Tối ưu tìm kiếm sản phẩm và tồn kho tại chi nhánh (T5) - Hảo
CREATE NONCLUSTERED INDEX IX_SPCuaTungCN_MaCN_TonKho 
ON SPCuaTungCN (MaCN, SoLuongTonKho);

CREATE NONCLUSTERED INDEX IX_SanPham_TenSP
ON SanPham (TenSP); 

CREATE NONCLUSTERED INDEX IX_LoaiSP_TenLoaiSP
ON LoaiSP (TenLoaiSP); 

-- 5. Tối ưu cho khách hàng tra cứu lịch sử khám của thú cưng (T2) - Cường
CREATE NONCLUSTERED INDEX IX_DatKhamBenh_MaTC_MaPhieuDV
ON DatKhamBenh (MaTC, MaPhieuDV)
INCLUDE (MoTaChuanDoan, MoTaTrieuChung, NgayKham, NgayTaiKham, TongTienDonThuoc);


-- 1. Tạo hàm phân vùng theo năm (Ví dụ cho năm 2025, 2026)
CREATE PARTITION FUNCTION pf_HoaDon_NgayLap (DATETIME)
AS RANGE RIGHT FOR VALUES ('2025-01-01', '2026-01-01');

-- 2. Tạo sơ đồ phân vùng
CREATE PARTITION SCHEME ps_HoaDon_NgayLap
AS PARTITION pf_HoaDon_NgayLap ALL TO ([PRIMARY]);

-- 3. Cài đặt bảng HoaDon lên vùng đã phân (Lưu ý: NgayLap phải là một phần của khóa chính)
-- Ví dụ tái cấu trúc bảng HoaDon:
-- ALTER TABLE HoaDon DROP CONSTRAINT PK_HoaDon;
-- ALTER TABLE HoaDon ADD CONSTRAINT PK_HoaDon PRIMARY KEY (MaHoaDon, NgayLap) ON ps_HoaDon_NgayLap(NgayLap);


-- 1. Tạo hàm phân vùng theo danh sách mã chi nhánh (Giả định MaCN từ CN01 đến CN10)
CREATE PARTITION FUNCTION pf_SPCuaTungCN_MaCN (VARCHAR(10))
AS RANGE LEFT FOR VALUES ('CN02', 'CN04', 'CN06', 'CN08', 'CN10');

-- 2. Tạo sơ đồ phân vùng
CREATE PARTITION SCHEME ps_SPCuaTungCN_MaCN
AS PARTITION pf_SPCuaTungCN_MaCN ALL TO ([PRIMARY]);

-- 3. Áp dụng cho bảng tồn kho
-- ALTER TABLE SPCuaTungCN DROP CONSTRAINT PK_SPCuaTungCN;
-- ALTER TABLE SPCuaTungCN ADD CONSTRAINT PK_SPCuaTungCN PRIMARY KEY (MaSP, MaCN) ON ps_SPCuaTungCN_MaCN(MaCN);
