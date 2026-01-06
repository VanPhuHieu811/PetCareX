USE PetCareX; -- Hoặc db_ac329b_login
GO

/* ---------------------------------------------------------
   1. TRIGGER: KIỂM TRA NGÀY VÀO LÀM > NGÀY SINH
   (Giữ nguyên logic, chỉ đảm bảo tương thích)
   --------------------------------------------------------- */
IF OBJECT_ID('TR_NhanVien_CheckNgayVaoLam', 'TR') IS NOT NULL DROP TRIGGER TR_NhanVien_CheckNgayVaoLam;
GO
CREATE TRIGGER TR_NhanVien_CheckNgayVaoLam
ON NhanVien
AFTER INSERT, UPDATE
AS
BEGIN
    -- Chỉ kiểm tra nếu NgaySinh không NULL (vì DB mới cho phép NULL)
    IF EXISTS (
        SELECT 1 FROM inserted i
        JOIN NguoiDung nd ON i.MaNV = nd.MaND
        WHERE nd.NgaySinh IS NOT NULL AND i.NgayVaoLam <= nd.NgaySinh
    )
    BEGIN
        RAISERROR(N'Lỗi: Ngày vào làm phải lớn hơn ngày sinh.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

/* ---------------------------------------------------------
   2. TRIGGER: ĐIỀU ĐỘNG (Sửa: Check trực tiếp TenChucVu)
   --------------------------------------------------------- */
IF OBJECT_ID('TR_DieuDong_CheckQuanLy', 'TR') IS NOT NULL DROP TRIGGER TR_DieuDong_CheckQuanLy;
GO
CREATE TRIGGER TR_DieuDong_CheckQuanLy
ON DieuDong
AFTER INSERT, UPDATE
AS
BEGIN
    -- [SỬA] Không cần JOIN ChucVu, check thẳng cột TenChucVu
    IF EXISTS (
        SELECT 1 FROM inserted i
        JOIN NhanVien nv ON i.MaNVDieuDong = nv.MaNV
        WHERE nv.TenChucVu NOT LIKE N'%Quản lý%' -- DB mới dùng từ "Quản lý"
    )
    BEGIN
        RAISERROR(N'Lỗi: Người điều động phải là Quản lý.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM inserted WHERE MaNV = MaNVDieuDong)
    BEGIN
        RAISERROR(N'Lỗi: Không thể tự điều động chính mình.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

/* ---------------------------------------------------------
   3. TRIGGER: PHIẾU KHÁM (Sửa: Check 'Bác sĩ')
   --------------------------------------------------------- */
IF OBJECT_ID('TR_PhieuKham_CheckBacSi', 'TR') IS NOT NULL DROP TRIGGER TR_PhieuKham_CheckBacSi;
GO
CREATE TRIGGER TR_PhieuKham_CheckBacSi
ON PhieuDatDVKhamBenh
AFTER INSERT, UPDATE
AS
BEGIN

    IF EXISTS (
        SELECT 1 FROM inserted i
        JOIN NhanVien nv ON i.BacSiPhuTrach = nv.MaNV
        WHERE i.BacSiPhuTrach IS NOT NULL AND nv.TenChucVu <> N'Bác sĩ'
    )
    BEGIN
        RAISERROR(N'Lỗi: Người phụ trách phải là Bác sĩ.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- Check ngày khám >= ngày đặt
    IF EXISTS (
        SELECT 1 FROM inserted i
        JOIN PhieuDatDV pdv ON i.MaPhieuDV = pdv.MaPhieuDV
        WHERE i.NgayKham < pdv.NgayDatDV
    )
    BEGIN
        RAISERROR(N'Lỗi: Ngày khám phải sau ngày đặt.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

/* ---------------------------------------------------------
   4. TRIGGER: HÓA ĐƠN (Sửa: Check 'Bán hàng')
   --------------------------------------------------------- */
IF OBJECT_ID('TR_HoaDon_CheckNhanVien', 'TR') IS NOT NULL DROP TRIGGER TR_HoaDon_CheckNhanVien;
GO
CREATE TRIGGER TR_HoaDon_CheckNhanVien
ON HoaDon
AFTER INSERT, UPDATE
AS
BEGIN
    -- [SỬA] Check TenChucVu = 'Bán hàng' (theo DB mới)
    IF EXISTS (
        SELECT 1 FROM inserted i
        JOIN NhanVien nv ON i.MaNVLap = nv.MaNV
        WHERE nv.TenChucVu <> N'Bán hàng'
    )
    BEGIN
        RAISERROR(N'Lỗi: Người lập hóa đơn phải là nhân viên Bán hàng.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

/* ---------------------------------------------------------
   5. TRIGGER: ĐƠN THUỐC (Không đổi, giữ nguyên)
   --------------------------------------------------------- */
IF OBJECT_ID('TR_DonThuoc_CheckLoaiSP', 'TR') IS NOT NULL DROP TRIGGER TR_DonThuoc_CheckLoaiSP;
GO
CREATE TRIGGER TR_DonThuoc_CheckLoaiSP
ON DonThuoc
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1 FROM inserted i
        JOIN SanPham sp ON i.MaSP = sp.MaSP
        JOIN LoaiSP lsp ON sp.MaLoaiSP = lsp.MaLoaiSP
        WHERE lsp.TenLoaiSP <> N'Thuốc'
    )
    BEGIN
        RAISERROR(N'Lỗi: Đơn thuốc chỉ được kê Thuốc.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

/* ---------------------------------------------------------
   6. TRIGGER: GÓI TIÊM (Check NULL an toàn)
   --------------------------------------------------------- */
IF OBJECT_ID('TR_TGTiem_CheckThoiGian', 'TR') IS NOT NULL DROP TRIGGER TR_TGTiem_CheckThoiGian;
GO
CREATE TRIGGER TR_TGTiem_CheckThoiGian
ON ThoiGianTiemChiDinh
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1 FROM inserted i
        JOIN DangKyGoiTP dk ON i.MaDK = dk.MaDK
        WHERE i.ThangTiem IS NOT NULL 
          AND (i.ThangTiem < dk.ThoiGianBD OR i.ThangTiem >= dk.ThoiGianKT)
    )
    BEGIN
        RAISERROR(N'Lỗi: Thời gian tiêm phải nằm trong hạn gói.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

/* ---------------------------------------------------------
   7. TRIGGER: PHIẾU TIÊM (Không đổi)
   --------------------------------------------------------- */
IF OBJECT_ID('TR_PhieuTiem_CheckNgay', 'TR') IS NOT NULL DROP TRIGGER TR_PhieuTiem_CheckNgay;
GO
CREATE TRIGGER TR_PhieuTiem_CheckNgay
ON PhieuDatDVTiemPhong
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1 FROM inserted i
        JOIN PhieuDatDV pdv ON i.MaPhieuDV = pdv.MaPhieuDV
        WHERE i.NgayTiem < pdv.NgayDatDV
    )
    BEGIN
        RAISERROR(N'Lỗi: Ngày tiêm phải sau ngày đặt.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO