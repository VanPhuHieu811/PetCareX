USE db_ac35db_new;
GO

/* =========================================================
   NHÓM 1: AUTOMATION TRIGGERS (TỰ ĐỘNG HÓA DỮ LIỆU)
   Mục đích: Đảm bảo tính nhất quán cho dữ liệu Phi chuẩn hóa
   ========================================================= */

-- 1. Tự động điền TenGiong, TenLoaiTC vào bảng ThuCung khi thêm mới/update
CREATE TRIGGER TR_ThuCung_AutoFillNames
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
CREATE TRIGGER TR_PhieuDatDV_AutoFillNames
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
CREATE TRIGGER TR_DatKham_UpdateParentName
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
CREATE TRIGGER TR_DatTiem_UpdateParentName
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
CREATE TRIGGER TR_DonThuoc_Snapshot
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
CREATE TRIGGER TR_DanhSachSP_Snapshot
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
CREATE TRIGGER TR_DanhSachVX_Snapshot
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
CREATE TRIGGER TR_NhanVien_CheckNgayVaoLam
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
CREATE TRIGGER TR_DieuDong_CheckQuanLy
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
CREATE TRIGGER TR_PhieuDatDV_Validation
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
CREATE TRIGGER TR_DatKham_CheckDate
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
CREATE TRIGGER TR_HoaDon_CheckNhanVien
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
        RAISERROR(N'Lỗi: Đơn thuốc chỉ được phép kê sản phẩm loại Thuốc.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

-- 12. Kiểm tra thời gian tiêm phải nằm trong hạn Gói Tiêm (Nếu dùng gói)
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
        RAISERROR(N'Lỗi: Thời gian tiêm phải nằm trong thời hạn của gói.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

-- 13. Tự động cộng dồn tiền từ Đơn Thuốc lên Phiếu Khám
CREATE TRIGGER TR_DonThuoc_UpdateTongTien
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
CREATE TRIGGER TR_HoaDon_AddLoyalty
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

-- 15. Kiểm tra và thăng hạng thành viên (nếu đủ điều kiện) của khách hàng sau khi thanh toán hóa đơn
CREATE TRIGGER TR_HoaDon_UpgradeMembership_Yearly
ON HoaDon
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NamHienTai INT = YEAR(GETDATE());

    -- 1. Tính tổng chi tiêu CỦA NĂM NAY (Bao gồm cả hóa đơn vừa thêm)
    DECLARE @ChiTieuNamNay TABLE (MaKH VARCHAR(10), TongTienNamNay BIGINT);
    
    INSERT INTO @ChiTieuNamNay (MaKH, TongTienNamNay)
    SELECT h.MaKH, SUM(h.TongTien)
    FROM HoaDon h
    WHERE h.MaKH IN (SELECT MaKH FROM inserted) 
      AND YEAR(h.NgayLap) = @NamHienTai -- Chỉ lấy hóa đơn trong năm nay
    GROUP BY h.MaKH;

    -- 2. Cập nhật thăng hạng (CHỈ TĂNG, KHÔNG GIẢM)
    -- Mốc xét hạng: VIP (12tr), Thân thiết (5tr)
    UPDATE kh
    SET MaLoaiTV = CASE 
        -- Nếu năm nay tiêu >= 12tr và chưa phải VIP -> Lên VIP (LTV03)
        WHEN ct.TongTienNamNay >= 12000000 AND kh.MaLoaiTV IN ('LTV01', 'LTV02') THEN 'LTV03'
        
        -- Nếu năm nay tiêu >= 5tr và đang là Cơ bản -> Lên Thân thiết (LTV02)
        WHEN ct.TongTienNamNay >= 5000000 AND kh.MaLoaiTV = 'LTV01' THEN 'LTV02'
        
        -- Các trường hợp khác: Giữ nguyên (Không hạ cấp lúc này)
        ELSE kh.MaLoaiTV
    END
    FROM KhachHang kh
    JOIN @ChiTieuNamNay ct ON kh.MaKH = ct.MaKH;
END;
GO