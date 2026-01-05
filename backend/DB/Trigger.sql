/* =========================================================
   PETCAREX - TRIGGERS SCRIPT (UNIVERSAL VERSION)
   Fix: Sửa lỗi "Incorrect syntax near OR" cho SQL Server bản cũ
   ========================================================= */

USE PetCareX;
GO

/* ---------------------------------------------------------
   1. TRIGGER: KIỂM TRA NGÀY VÀO LÀM > NGÀY SINH CỦA NHÂN VIÊN
   --------------------------------------------------------- */
-- Bước 1: Xóa trigger cũ nếu tồn tại
IF OBJECT_ID('TR_NhanVien_CheckNgayVaoLam', 'TR') IS NOT NULL
    DROP TRIGGER TR_NhanVien_CheckNgayVaoLam;
GO

-- Bước 2: Tạo trigger mới
CREATE TRIGGER TR_NhanVien_CheckNgayVaoLam
ON NhanVien
AFTER INSERT, UPDATE
AS
BEGIN
    -- Kiểm tra nếu có nhân viên nào mà Ngày vào làm <= Ngày sinh
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN NguoiDung nd ON i.MaNV = nd.MaND
        WHERE i.NgayVaoLam <= nd.NgaySinh
    )
    BEGIN
        RAISERROR(N'Lỗi: Ngày vào làm của nhân viên phải lớn hơn ngày sinh.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

/* ---------------------------------------------------------
   2. TRIGGER: RÀNG BUỘC ĐIỀU ĐỘNG NHÂN SỰ
   --------------------------------------------------------- */
IF OBJECT_ID('TR_DieuDong_CheckQuanLy', 'TR') IS NOT NULL
    DROP TRIGGER TR_DieuDong_CheckQuanLy;
GO

CREATE TRIGGER TR_DieuDong_CheckQuanLy
ON DieuDong
AFTER INSERT, UPDATE
AS
BEGIN
    -- 1. Kiểm tra Người điều động (MaNVDieuDong) phải có chức vụ chứa từ 'Quản lý'
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN NhanVien nv ON i.MaNVDieuDong = nv.MaNV
        JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu
        WHERE cv.TenChucVu NOT LIKE N'%Quản lý%'
    )
    BEGIN
        RAISERROR(N'Lỗi: Người thực hiện điều động phải là Quản lý chi nhánh.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- 2. Kiểm tra MaNVDieuDong không trùng với MaNV
    IF EXISTS (
        SELECT 1 FROM inserted WHERE MaNV = MaNVDieuDong
    )
    BEGIN
        RAISERROR(N'Lỗi: Người quản lý không thể tự điều động chính mình.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

/* ---------------------------------------------------------
   3. TRIGGER: KIỂM TRA BÁC SĨ PHỤ TRÁCH KHÁM BỆNH
   --------------------------------------------------------- */
IF OBJECT_ID('TR_PhieuKham_CheckBacSi', 'TR') IS NOT NULL
    DROP TRIGGER TR_PhieuKham_CheckBacSi;
GO

CREATE TRIGGER TR_PhieuKham_CheckBacSi
ON PhieuDatDVKhamBenh
AFTER INSERT, UPDATE
AS
BEGIN
    -- 1. Kiểm tra chức vụ Bác sĩ
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN NhanVien nv ON i.BacSiPhuTrach = nv.MaNV
        JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu
        WHERE cv.TenChucVu <> N'Bác sĩ thú y'
    )
    BEGIN
        RAISERROR(N'Lỗi: Người phụ trách khám bệnh phải có chức vụ là Bác sĩ thú y.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- 2. Kiểm tra Ngày khám >= Ngày đặt dịch vụ
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN PhieuDatDV pdv ON i.MaPhieuDV = pdv.MaPhieuDV
        WHERE i.NgayKham < pdv.NgayDatDV
    )
    BEGIN
        RAISERROR(N'Lỗi: Ngày khám bệnh phải sau hoặc bằng ngày đặt dịch vụ.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

/* ---------------------------------------------------------
   4. TRIGGER: KIỂM TRA NHÂN VIÊN LẬP HÓA ĐƠN
   --------------------------------------------------------- */
IF OBJECT_ID('TR_HoaDon_CheckNhanVien', 'TR') IS NOT NULL
    DROP TRIGGER TR_HoaDon_CheckNhanVien;
GO

CREATE TRIGGER TR_HoaDon_CheckNhanVien
ON HoaDon
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN NhanVien nv ON i.MaNVLap = nv.MaNV
        JOIN ChucVu cv ON nv.MaChucVu = cv.MaChucVu
        WHERE cv.TenChucVu <> N'Nhân viên bán hàng'
    )
    BEGIN
        RAISERROR(N'Lỗi: Người lập hóa đơn phải là Nhân viên bán hàng.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

/* ---------------------------------------------------------
   5. TRIGGER: KIỂM TRA SẢN PHẨM TRONG ĐƠN THUỐC
   --------------------------------------------------------- */
IF OBJECT_ID('TR_DonThuoc_CheckLoaiSP', 'TR') IS NOT NULL
    DROP TRIGGER TR_DonThuoc_CheckLoaiSP;
GO

CREATE TRIGGER TR_DonThuoc_CheckLoaiSP
ON DonThuoc
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN SanPham sp ON i.MaSP = sp.MaSP
        JOIN LoaiSP lsp ON sp.MaLoaiSP = lsp.MaLoaiSP
        WHERE lsp.TenLoaiSP <> N'Thuốc'
    )
    BEGIN
        RAISERROR(N'Lỗi: Sản phẩm trong đơn thuốc bắt buộc phải là Thuốc.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

/* ---------------------------------------------------------
   6. TRIGGER: KIỂM TRA THỜI GIAN GÓI TIÊM PHÒNG
   --------------------------------------------------------- */
IF OBJECT_ID('TR_TGTiem_CheckThoiGian', 'TR') IS NOT NULL
    DROP TRIGGER TR_TGTiem_CheckThoiGian;
GO

CREATE TRIGGER TR_TGTiem_CheckThoiGian
ON ThoiGianTiemChiDinh
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN DangKyGoiTP dk ON i.MaDK = dk.MaDK
        WHERE i.ThangTiem < dk.ThoiGianBD OR i.ThangTiem >= dk.ThoiGianKT
    )
    BEGIN
        RAISERROR(N'Lỗi: Tháng tiêm chỉ định phải nằm trong thời gian hiệu lực của gói đăng ký.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

/* ---------------------------------------------------------
   7. TRIGGER: KIỂM TRA NGÀY TIÊM PHÒNG
   --------------------------------------------------------- */
IF OBJECT_ID('TR_PhieuTiem_CheckNgay', 'TR') IS NOT NULL
    DROP TRIGGER TR_PhieuTiem_CheckNgay;
GO

CREATE TRIGGER TR_PhieuTiem_CheckNgay
ON PhieuDatDVTiemPhong
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN PhieuDatDV pdv ON i.MaPhieuDV = pdv.MaPhieuDV
        WHERE i.NgayTiem < pdv.NgayDatDV
    )
    BEGIN
        RAISERROR(N'Lỗi: Ngày tiêm phòng phải sau hoặc bằng ngày đặt dịch vụ.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO