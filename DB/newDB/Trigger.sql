USE db_ac35db_new;
GO

/* =========================================================
   NHÓM 1: AUTOMATION TRIGGERS (TỰ ĐỘNG HÓA DỮ LIỆU)
   Mục đích: Đảm bảo tính nhất quán cho dữ liệu Phi chuẩn hóa
   ========================================================= */

-- 1. Tự động điền TenGiong, TenLoaiTC vào bảng ThuCung khi thêm mới/update
CREATE OR ALTER TRIGGER TR_ThuCung_AutoFillNames
ON ThuCung
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE tc
    SET 
        tc.TenGiong = g.TenGiong,
        tc.TenLoaiTC = ltc.TenLoaiTC
    FROM ThuCung tc
    JOIN inserted i ON tc.MaTC = i.MaTC
    JOIN Giong g ON tc.MaGiong = g.MaGiong
    JOIN LoaiThuCung ltc ON g.MaLoaiTC = ltc.MaLoaiTC;
END;
GO

-- 2. Tự động điền TenKhachHang, TenThuCung vào PhieuDatDV
CREATE OR ALTER TRIGGER TR_PhieuDatDV_AutoFillNames
ON PhieuDatDV
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    -- Cập nhật Tên Khách Hàng
    UPDATE p
    SET p.TenKhachHang = nd.HoTen
    FROM PhieuDatDV p
    JOIN inserted i ON p.MaPhieuDV = i.MaPhieuDV
    JOIN NguoiDung nd ON p.MaKH = nd.MaND;

    -- Cập nhật Tên Thú Cưng (Nếu là Khám hoặc Tiêm)
    -- Lấy MaTC từ bảng con DatKhamBenh hoặc DatTiemPhong thì chưa có lúc Insert PhieuDatDV
    -- Nên logic này cần app truyền hoặc cập nhật sau. 
    -- Tuy nhiên, ta có thể update ngược lại khi bảng con DatKham/DatTiem được Insert.
END;
GO

-- 2b. (Bổ sung) Khi Insert DatKhamBenh -> Update TenThuCung vào bảng cha PhieuDatDV
CREATE OR ALTER TRIGGER TR_DatKham_UpdateParentName
ON DatKhamBenh
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE p
    SET p.TenThuCung = tc.TenTC
    FROM PhieuDatDV p
    JOIN inserted i ON p.MaPhieuDV = i.MaPhieuDV
    JOIN ThuCung tc ON i.MaTC = tc.MaTC;
END;
GO

-- 2c. (Bổ sung) Khi Insert DatTiemPhong -> Update TenThuCung vào bảng cha PhieuDatDV
CREATE OR ALTER TRIGGER TR_DatTiem_UpdateParentName
ON DatTiemPhong
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE p
    SET p.TenThuCung = tc.TenTC
    FROM PhieuDatDV p
    JOIN inserted i ON p.MaPhieuDV = i.MaPhieuDV
    JOIN ThuCung tc ON i.MaTC = tc.MaTC;
END;
GO

-- 3. SNAPSHOT: Tự động lưu Giá và Tên SP vào DonThuoc (Khi kê đơn hoặc sửa số lượng)
CREATE OR ALTER TRIGGER TR_DonThuoc_Snapshot
ON DonThuoc
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Chỉ xử lý khi Insert hoặc Update cột SoLuongMua/MaSP
    IF UPDATE(SoLuongMua) OR UPDATE(MaSP) OR NOT EXISTS(SELECT 1 FROM deleted)
    BEGIN
        UPDATE dt
        SET 
            -- Nếu là Insert thì lấy giá hiện tại, nếu Update thì giữ nguyên giá lúc mua (trừ khi muốn update lại theo giá mới)
            -- Ở đây logic chuẩn là: Giữ nguyên DonGia_LucMua nếu chỉ sửa số lượng.
            dt.DonGia_LucMua = CASE 
                                WHEN d.MaSP IS NULL THEN sp.GiaBan -- Trường hợp Insert mới
                                ELSE dt.DonGia_LucMua -- Trường hợp Update thì giữ giá cũ
                               END,
            dt.TenSP_SnapShot = CASE 
                                 WHEN d.MaSP IS NULL THEN sp.TenSP 
                                 ELSE dt.TenSP_SnapShot 
                                END,
            -- Tính lại thành tiền = Đơn giá (đang có) * Số lượng (mới)
            dt.ThanhTien = i.SoLuongMua * (CASE 
                                            WHEN d.MaSP IS NULL THEN sp.GiaBan 
                                            ELSE dt.DonGia_LucMua 
                                           END)
        FROM DonThuoc dt
        JOIN inserted i ON dt.MaPhieuDV = i.MaPhieuDV AND dt.MaSP = i.MaSP
        LEFT JOIN deleted d ON dt.MaPhieuDV = d.MaPhieuDV AND dt.MaSP = d.MaSP
        JOIN SanPham sp ON i.MaSP = sp.MaSP;
    END
END;
GO

-- 4. SNAPSHOT: Tự động lưu Giá và Tên SP vào DanhSachSP (Khi mua hàng)
CREATE OR ALTER TRIGGER TR_DanhSachSP_Snapshot
ON DanhSachSP
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE ds
    SET 
        ds.DonGia_LucMua = sp.GiaBan,
        ds.TenSP_SnapShot = sp.TenSP
    FROM DanhSachSP ds
    JOIN inserted i ON ds.MaPhieuDV = i.MaPhieuDV AND ds.MaSP = i.MaSP
    JOIN SanPham sp ON i.MaSP = sp.MaSP;
END;
GO

-- 5. SNAPSHOT: Tự động lưu Giá Vacxin vào DanhSachVacXin
CREATE OR ALTER TRIGGER TR_DanhSachVX_Snapshot
ON DanhSachVacXin
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE ds
    SET ds.DonGia = vx.GiaVacXin
    FROM DanhSachVacXin ds
    JOIN inserted i ON ds.MaPhieuDV = i.MaPhieuDV AND ds.MaVacXin = i.MaVacXin
    JOIN VacXin vx ON i.MaVacXin = vx.MaVacXin;
END;
GO

/* =========================================================
   NHÓM 2: VALIDATION TRIGGERS (RÀNG BUỘC NGHIỆP VỤ)
   ========================================================= */

-- 6. Kiểm tra Ngày vào làm > Ngày sinh (NhanVien)
CREATE OR ALTER TRIGGER TR_NhanVien_CheckNgayVaoLam
ON NhanVien
AFTER INSERT, UPDATE
AS
BEGIN
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

-- 7. Kiểm tra Người điều động phải là Quản lý
CREATE OR ALTER TRIGGER TR_DieuDong_CheckQuanLy
ON DieuDong
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (
        SELECT 1 FROM inserted i
        JOIN NhanVien nv ON i.MaNVDieuDong = nv.MaNV
        WHERE nv.TenChucVu NOT LIKE N'%Quản lý%'
    )
    BEGIN
        RAISERROR(N'Lỗi: Người điều động phải là Quản lý.', 16, 1);
        ROLLBACK TRANSACTION;
    END
    -- Check tự điều động
    IF EXISTS (SELECT 1 FROM inserted WHERE MaNV = MaNVDieuDong)
    BEGIN
        RAISERROR(N'Lỗi: Không thể tự điều động chính mình.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

-- 8. Kiểm tra Logic PhieuDatDV (Bác sĩ, Ngày đặt) - Đã cập nhật theo cấu trúc mới
CREATE OR ALTER TRIGGER TR_PhieuDatDV_Validation
ON PhieuDatDV
AFTER INSERT, UPDATE
AS
BEGIN
    -- Check: Nếu là Khám hoặc Tiêm thì Bác sĩ không được để trống và phải có chức vụ Bác sĩ
    IF EXISTS (
        SELECT 1 FROM inserted i
        LEFT JOIN NhanVien nv ON i.BacSiPhuTrach = nv.MaNV
        WHERE i.LoaiDichVu IN (N'Khám bệnh', N'Tiêm Phòng')
          AND (i.BacSiPhuTrach IS NULL OR nv.TenChucVu <> N'Bác sĩ')
    )
    BEGIN
        RAISERROR(N'Lỗi: Dịch vụ Khám/Tiêm yêu cầu Bác sĩ phụ trách hợp lệ.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- Check: Nếu là Mua Hàng thì Bác sĩ phải NULL (Logic tùy chọn, nhưng nên sạch dữ liệu)
    IF EXISTS (
        SELECT 1 FROM inserted WHERE LoaiDichVu = N'Mua hàng' AND BacSiPhuTrach IS NOT NULL
    )
    BEGIN
        RAISERROR(N'Lỗi: Phiếu mua hàng không cần Bác sĩ phụ trách.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

-- 9. Kiểm tra Ngày Khám >= Ngày Đặt (Bảng DatKhamBenh)
CREATE OR ALTER TRIGGER TR_DatKham_CheckDate
ON DatKhamBenh
AFTER INSERT, UPDATE
AS
BEGIN
	if update(NgayKham)
	begin
		IF EXISTS (
			SELECT 1 FROM inserted i
			JOIN PhieuDatDV p ON i.MaPhieuDV = p.MaPhieuDV
			WHERE i.NgayKham < p.NgayDatDV
		)
		BEGIN
			RAISERROR(N'Lỗi: Ngày khám phải sau hoặc bằng ngày đặt.', 16, 1);
			ROLLBACK TRANSACTION;
		END
	end
END;
GO

-- 10. Kiểm tra Người lập Hóa đơn phải là Bán hàng
CREATE OR ALTER TRIGGER TR_HoaDon_CheckNhanVien
ON HoaDon
AFTER INSERT, UPDATE
AS
BEGIN
    -- Chỉ kiểm tra khi có thông tin nhân viên (MaNVLap KHÁC NULL)
    IF EXISTS (
        SELECT 1 
        FROM inserted i
        JOIN NhanVien nv ON i.MaNVLap = nv.MaNV
        WHERE i.MaNVLap IS NOT NULL -- Chỉ check nếu có người lập
          AND nv.TenChucVu <> N'Bán hàng'
    )
    BEGIN
        RAISERROR(N'Lỗi: Nếu có người lập hóa đơn, người đó phải là nhân viên Bán hàng.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

-- 11. Đơn thuốc chỉ được kê loại sản phẩm là 'Thuốc'
CREATE OR ALTER TRIGGER TR_DonThuoc_CheckLoaiSP
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
        RAISERROR(N'Lỗi: Đơn thuốc chỉ được phép kê sản phẩm loại Thuốc.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

-- 12. Kiểm tra thời gian tiêm phải nằm trong hạn Gói Tiêm (Nếu dùng gói)
CREATE OR ALTER TRIGGER TR_TGTiem_CheckThoiGian
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
        RAISERROR(N'Lỗi: Thời gian tiêm phải nằm trong thời hạn của gói.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

-- 13. Tự động cộng dồn tiền từ Đơn Thuốc lên Phiếu Khám
CREATE OR ALTER TRIGGER TR_DonThuoc_UpdateTongTien
ON DonThuoc
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Cập nhật cho các phiếu có thay đổi
    UPDATE dk
    SET dk.TongTienDonThuoc = (
        SELECT ISNULL(SUM(dt.ThanhTien), 0)
        FROM DonThuoc dt
        WHERE dt.MaPhieuDV = dk.MaPhieuDV
    )
    FROM DatKhamBenh dk
    WHERE dk.MaPhieuDV IN (SELECT MaPhieuDV FROM inserted UNION SELECT MaPhieuDV FROM deleted);
END;
GO

-- 14. Mỗi khi khách hàng thanh toán hóa đơn thì tự động cộng điểm 
CREATE OR ALTER TRIGGER TR_HoaDon_AddLoyalty
ON HoaDon
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Cộng điểm tích lũy: 50.000 VNĐ = 1 điểm
    UPDATE kh
    SET kh.DiemLoyalty = kh.DiemLoyalty + (i.TongTien / 50000)
    FROM KhachHang kh
    INNER JOIN inserted i ON kh.MaKH = i.MaKH;
END;
GO


-- 15. Tự động cập nhật bác sĩ phụ trách vào bảng DatKhamBenh
CREATE OR ALTER TRIGGER TR_DatKham_AutoFillDoctor
ON DatKhamBenh
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Update bảng DatKhamBenh dựa trên thông tin từ PhieuDatDV
    UPDATE dk
    SET dk.BacSiPhuTrach = p.BacSiPhuTrach
    FROM DatKhamBenh dk
    INNER JOIN inserted i ON dk.MaPhieuDV = i.MaPhieuDV -- Chỉ tác động vào dòng vừa thêm
    INNER JOIN PhieuDatDV p ON dk.MaPhieuDV = p.MaPhieuDV; -- Lấy thông tin từ bảng cha
END;
GO

-- 16. Tự động cập nhật Bác sĩ phụ trách cho bảng DatTiemPhong
CREATE OR ALTER TRIGGER TR_DatTiem_AutoFillDoctor
ON DatTiemPhong
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Update bảng DatTiemPhong dựa trên thông tin từ PhieuDatDV
    UPDATE dt
    SET dt.BacSiPhuTrach = p.BacSiPhuTrach
    FROM DatTiemPhong dt
    INNER JOIN inserted i ON dt.MaPhieuDV = i.MaPhieuDV -- Chỉ tác động vào dòng vừa thêm
    INNER JOIN PhieuDatDV p ON dt.MaPhieuDV = p.MaPhieuDV; -- Lấy thông tin từ bảng cha
END;
GO

-- 17. Trigger trừ kho khi Phiếu Dịch Vụ chuyển trạng thái thành 'Hoàn thành' hoặc 'Đã thanh toán'
CREATE OR ALTER TRIGGER TR_PhieuDatDV_UpdateStock
ON PhieuDatDV
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Chỉ thực hiện khi trạng thái chuyển sang 'Hoàn thành' hoặc 'Đã thanh toán'
    -- VÀ trạng thái cũ KHÔNG PHẢI là 2 trạng thái này (để tránh trừ kho 2 lần)
    IF EXISTS (
        SELECT 1 
        FROM inserted i 
        JOIN deleted d ON i.MaPhieuDV = d.MaPhieuDV
        WHERE i.TrangThai IN (N'Hoàn thành', N'Đã thanh toán') 
          AND d.TrangThai NOT IN (N'Hoàn thành', N'Đã thanh toán')
    )
    BEGIN
        -- 1. Trừ kho Sản Phẩm từ Đơn Thuốc (Dịch vụ Khám bệnh)
        UPDATE kho
        SET kho.SoLuongTonKho = kho.SoLuongTonKho - dt.SoLuongMua
        FROM SPCuaTungCN kho
        JOIN DonThuoc dt ON kho.MaSP = dt.MaSP AND kho.MaCN = dt.MaCN
        JOIN inserted i ON dt.MaPhieuDV = i.MaPhieuDV
        WHERE i.TrangThai IN (N'Hoàn thành', N'Đã thanh toán');

        -- 2. Trừ kho Sản Phẩm từ DanhSachSP (Dịch vụ Mua hàng)
        UPDATE kho
        SET kho.SoLuongTonKho = kho.SoLuongTonKho - ds.SoLuongMua
        FROM SPCuaTungCN kho
        JOIN DanhSachSP ds ON kho.MaSP = ds.MaSP AND kho.MaCN = ds.MaCN
        JOIN inserted i ON ds.MaPhieuDV = i.MaPhieuDV
        WHERE i.TrangThai IN (N'Hoàn thành', N'Đã thanh toán');

        -- 3. Trừ kho Vắc-xin (Dịch vụ Tiêm phòng)
        -- Lưu ý: Giả định 1 lần tiêm trong DanhSachVacXin là trừ 1 đơn vị tồn kho
        -- Nếu cột LieuLuong mang ý nghĩa số lượng lọ (vial), hãy thay '1' bằng 'dsvx.LieuLuong'
        UPDATE vx_kho
        SET vx_kho.TonKho = vx_kho.TonKho - 1 
        FROM VacXin_ChiNhanh vx_kho
        JOIN DanhSachVacXin dsvx ON vx_kho.MaVacXin = dsvx.MaVacXin
        JOIN inserted i ON dsvx.MaPhieuDV = i.MaPhieuDV
        WHERE vx_kho.MaCN = i.MaCN -- PhieuDatDV chứa MaCN thực hiện
          AND i.TrangThai IN (N'Hoàn thành', N'Đã thanh toán');
    END
END;
GO

--________________________________________________
-- Kiểm các trigger đang có
GO
SELECT 
    name,
    type_desc,
    create_date
FROM sys.triggers
WHERE parent_class_desc = 'OBJECT_OR_COLUMN'; -- Chỉ lấy trigger gắn vào bảng