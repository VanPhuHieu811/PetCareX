CREATE NONCLUSTERED INDEX IX_PhieuDatDV_BacSi_TrangThai_LoaiDV 
ON PhieuDatDV (BacSiPhuTrach, TrangThai, LoaiDichVu)
INCLUDE (TenKhachHang, TenThuCung); 

CREATE NONCLUSTERED INDEX IX_NhanVien_TenChucVu 
ON NhanVien (TenChucVu); 

CREATE NONCLUSTERED INDEX IX_ThuCung_MaKH_Include_Info
ON ThuCung (MaKH)
INCLUDE (TenTC, TenGiong, NgaySinh, GioiTinh);

CREATE NONCLUSTERED INDEX IX_SPCuaTungCN_MaCN_TonKho 
ON SPCuaTungCN (MaCN, SoLuongTonKho);

CREATE NONCLUSTERED INDEX IX_SanPham_TenSP
ON SanPham (TenSP); 

CREATE NONCLUSTERED INDEX IX_LoaiSP_TenLoaiSP
ON LoaiSP (TenLoaiSP); 

CREATE NONCLUSTERED INDEX IX_DatKhamBenh_MaTC_MaPhieuDV
ON DatKhamBenh (MaTC, MaPhieuDV)
INCLUDE (MoTaChuanDoan, MoTaTrieuChung, NgayKham, NgayTaiKham, TongTienDonThuoc);