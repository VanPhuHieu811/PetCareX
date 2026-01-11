GO
CREATE OR ALTER FUNCTION fn_LayDanhSachKhamTrongNgay(
    @MaBS varchar(10)
)
RETURNS TABLE
AS
RETURN
(
    SELECT 
        p.MaPhieuDV,
        CONVERT(VARCHAR(5), ISNULL(k.NgayKham, t.NgayTiem), 108) AS GioDat, 
		ISNULL(k.MaTC, t.MaTC) as MaTC,
		p.MaKH,
        p.TenKhachHang, 
        p.TenThuCung, 
        p.TrangThai,
        p.LoaiDichVu,
        p.MaCN
    FROM PhieuDatDV p
    LEFT JOIN DatKhamBenh k ON p.MaPhieuDV = k.MaPhieuDV 
    LEFT JOIN DatTiemPhong t ON p.MaPhieuDV = t.MaPhieuDV 
    WHERE p.BacSiPhuTrach = @MaBS 
      AND p.TrangThai != N'Hủy' and TrangThai != N'Hoàn thành' and p.TrangThai != N'Đã thanh toán'
      AND (
          (p.LoaiDichVu = N'Khám bệnh' AND k.NgayKham > = CAST(GETDATE() AS DATE) AND k.NgayKham < DATEADD (DAY, 1, CAST(GETDATE() AS DATE))) 
          OR 
          (p.LoaiDichVu = N'Tiêm phòng' AND t.NgayTiem > = CAST(GETDATE() AS DATE) AND t.NgayTiem < DATEADD (DAY, 1, CAST(GETDATE() AS DATE))) 
      )
);
go
----------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_LayDashboardBacSi
    @MaBS VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    -- Tập 1: Thống kê các con số (dashboardStats)
    SELECT 
        -- 1. Tổng lịch hẹn: Đếm tất cả các ca được giao trong ngày (chỉ bỏ lịch Hủy)
        COUNT(p.MaPhieuDV) AS totalAppointments,

        -- 2. Số ca đang chờ: Chỉ đếm những ca có trạng thái 'Đang chờ'
        SUM(CASE WHEN p.TrangThai = N'Đang chờ' THEN 1 ELSE 0 END) AS waitingCount,

        -- 3. Số ca khám bệnh: Chỉ đếm ca khám bệnh đang trong danh sách hoạt động
        SUM(CASE WHEN p.LoaiDichVu = N'Khám bệnh' 
                  AND p.TrangThai = N'Đang chờ' THEN 1 ELSE 0 END) AS clinicalCount,

        -- 4. Số ca tiêm phòng: Chỉ đếm ca tiêm phòng đang trong danh sách hoạt động
        SUM(CASE WHEN p.LoaiDichVu = N'Tiêm phòng' 
                  AND p.TrangThai = N'Đang chờ' THEN 1 ELSE 0 END) AS vaccinationCount
    FROM PhieuDatDV p
    LEFT JOIN DatKhamBenh k ON p.MaPhieuDV = k.MaPhieuDV 
    LEFT JOIN DatTiemPhong t ON p.MaPhieuDV = t.MaPhieuDV 
    WHERE p.BacSiPhuTrach = @MaBS 
      AND p.TrangThai != N'Hủy' -- Vẫn loại bỏ lịch Hủy để con số tổng thực tế hơn
      AND (
          (p.LoaiDichVu = N'Khám bệnh' AND k.NgayKham >= CAST(GETDATE() AS DATE) AND k.NgayKham < DATEADD(DAY, 1, CAST(GETDATE() AS DATE))) 
          OR 
          (p.LoaiDichVu = N'Tiêm phòng' AND t.NgayTiem >= CAST(GETDATE() AS DATE) AND t.NgayTiem < DATEADD(DAY, 1, CAST(GETDATE() AS DATE))) 
      );

    -- Tập 2: Danh sách hàng đợi (Chỉ hiện các ca cần xử lý)
    -- Sử dụng hàm fn_LayDanhSachKhamTrongNgay đã có của bạn
    SELECT * FROM dbo.fn_LayDanhSachKhamTrongNgay(@MaBS) 
    ORDER BY GioDat ASC;
END;
GO
----------------------------------------------------------
CREATE OR ALTER PROCEDURE sp_LayDanhSachThuocTrongChiNhanh
    @MaCN VARCHAR(10)             -- Mã chi nhánh của bác sĩ đang trực
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        sp.MaSP,
        sp.TenSP,
        sctc.SoLuongTonKho AS Ton,
        sp.DonViTinh AS DonVi,
        sp.GiaBan -- Cần để hiển thị cho bác sĩ và làm snapshot đơn thuốc sau này
    FROM SanPham sp
    INNER JOIN LoaiSP lsp ON sp.MaLoaiSP = lsp.MaLoaiSP
    INNER JOIN SPCuaTungCN sctc ON sp.MaSP = sctc.MaSP
    WHERE 
        sctc.MaCN = @MaCN -- Bắt buộc lọc theo chi nhánh [cite: 141, 146]
        AND lsp.TenLoaiSP LIKE N'%Thuốc%' -- Đảm bảo chỉ lấy thuốc, không lấy thức ăn/đồ chơi
		and sctc.SoLuongTonKho > 0
    ORDER BY sp.TenSP ASC;
END;

GO
CREATE OR ALTER PROCEDURE sp_TaoDonThuoc
    @MaPhieuDV VARCHAR(10),
    @MaSP VARCHAR(10),
    @MaCN VARCHAR(10),
    @SoLuongMua INT,
    @TanSuat INT, -- Đổi sang NVARCHAR để nhập text
    @LieuDung NVARCHAR(100),
	@NgayTaiKham date = null
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
	select * from DatKhamBenh
    BEGIN TRY
        -- 1. Tự động lấy Snapshot từ bảng gốc để đảm bảo chính xác 
        
        DECLARE @TonKhoHienTai INT;

        -- 2. Kiểm tra tồn kho tại chi nhánh cụ thể 
        SELECT @TonKhoHienTai = SoLuongTonKho 
        FROM SPCuaTungCN WHERE MaSP = @MaSP AND MaCN = @MaCN; 

        IF @TonKhoHienTai IS NULL OR @TonKhoHienTai < @SoLuongMua
        BEGIN
            ROLLBACK;
            RAISERROR(N'Số lượng tồn kho tại chi nhánh không đủ để kê đơn.', 16, 1);
            RETURN;
        END

        -- 3. Chèn vào bảng DonThuoc (Lưu Snapshot dữ liệu giao dịch) [cite: 13]
        INSERT INTO DonThuoc (
            MaPhieuDV, MaSP, SoLuongMua, MaCN, TanSuat, LieuDung
        )
        VALUES (
            @MaPhieuDV, 
            @MaSP, 
            @SoLuongMua, 
            @MaCN,
            @TanSuat,
            @LieuDung
        );
		-- 4. Cập nhật ngày tái khám vào bảng DatKhamBenh (nếu có)
        IF @NgayTaiKham IS NOT NULL
        BEGIN
            UPDATE DatKhamBenh 
            SET NgayTaiKham = @NgayTaiKham 
            WHERE MaPhieuDV = @MaPhieuDV; 
        END

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END;
GO
------------------------
CREATE OR ALTER PROCEDURE sp_LayThongTinGoiTiemThuCung
    @PetId VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON

    -- Tập 1: Thông tin tổng quan gói tiêm đã đăng ký
    -- Lấy thông tin từ bảng DangKyGoiTP và GoiTiemPhong
    SELECT 
        dk.MaDK,
        g.TenGoiTP AS tenGoi,
		CAST(dk.ThoiGianBD AS DATE) AS ngayBatDau,
        (SELECT COUNT(*) FROM ThoiGianTiemChiDinh WHERE MaDK = dk.MaDK) AS tongMui,
        (SELECT COUNT(*) FROM ThoiGianTiemChiDinh WHERE MaDK = dk.MaDK AND TrangThai = N'Đã tiêm') AS muiDaTiem,
        -- Tính % tiến trình
        CAST(
            (SELECT COUNT(*) FROM ThoiGianTiemChiDinh WHERE MaDK = dk.MaDK AND TrangThai = N'Đã tiêm') * 100.0 / 
            NULLIF((SELECT COUNT(*) FROM ThoiGianTiemChiDinh WHERE MaDK = dk.MaDK), 0) 
        AS INT) AS tienTrinh
    FROM DangKyGoiTP dk
    JOIN GoiTiemPhong g ON dk.MaGoiTP = g.MaGoiTP
    -- Tìm mã đăng ký mới nhất của thú cưng này
    WHERE dk.MaDK = (
        SELECT TOP 1 MaDK 
        FROM DatTiemPhong 
        WHERE MaTC = @PetId 
        ORDER BY MaDK DESC
    );
    -- Tập 2: Danh sách chi tiết các mũi tiêm trong gói
    SELECT 
		tg.MaDK,
        v.TenVacXin AS tenVacxin,
        tg.TrangThai AS trangThai,
        cast(tg.ThangTiem as date) AS ngayDuKien, -- Ngày dự kiến theo lộ trình gói
        cast (dt.NgayTiem as date) AS ngayThucHien -- Ngày thực tế tiêm (Lấy từ phiếu đặt dịch vụ)
    FROM ThoiGianTiemChiDinh tg
    JOIN Vacxin v ON tg.MaVacxin = v.MaVacxin
    LEFT JOIN DatTiemPhong dt ON tg.MaDK = dt.MaDK /*AND tg.MaVacxin = (
        -- Khớp mũi tiêm thực tế dựa trên mã vắc xin và mã đăng ký
        SELECT TOP 1 dv.MaVacxin 
        FROM DanhSachVacxin dv 
        WHERE dv.MaPhieuDV = dt.MaPhieuDV AND dv.MaVacxin = tg.MaVacxin
    )*/
    WHERE tg.MaDK = (
        SELECT TOP 1 MaDK 
        FROM DatTiemPhong 
        WHERE MaTC = @PetId 
        ORDER BY MaDK DESC
    ) AND dt.MaTC = @PetId 
    ORDER BY tg.ThangTiem ASC;
END;
GO
---------------------------------------
CREATE OR ALTER PROCEDURE sp_CapNhatNgayTaiKham
    @MaPhieuDV VARCHAR(10),
    @NgayTaiKham DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Kiểm tra phiếu có tồn tại trong bảng khám bệnh không
    IF EXISTS (SELECT 1 FROM DatKhamBenh WHERE MaPhieuDV = @MaPhieuDV)
    BEGIN
        UPDATE DatKhamBenh
        SET NgayTaiKham = @NgayTaiKham
        WHERE MaPhieuDV = @MaPhieuDV;
        
        PRINT 'Cập nhật ngày tái khám thành công.';
    END
    ELSE
    BEGIN
        RAISERROR(N'Không tìm thấy thông tin khám bệnh cho mã phiếu này.', 16, 1);
    END
END;
GO
--------------------------------------
CREATE OR ALTER PROCEDURE sp_DangKyGoiTiem
    @MaKH VARCHAR(10),
    @MaGoiTP VARCHAR(10),
    @MaPhieuDV VARCHAR(10) -- Phiếu đặt tiêm phòng hiện tại
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Lấy thời hạn của gói (6 hoặc 12 tháng) từ bảng GoiTiemPhong
        DECLARE @ThoiHan INT;
        SELECT @ThoiHan = ThoiHan FROM GoiTiemPhong WHERE MaGoiTP = @MaGoiTP;

        -- Kiểm tra nếu không tìm thấy gói
        IF @ThoiHan IS NULL
        BEGIN
            ROLLBACK;
            RAISERROR(N'Gói tiêm không tồn tại.', 16, 1);
            RETURN;
        END

        -- 2. Tạo mã đăng ký mới (MaDK)
        DECLARE @NewMaDK VARCHAR(10);
        SELECT @NewMaDK = 'DK' + RIGHT('00000' + CAST(ISNULL(MAX(CAST(SUBSTRING(MaDK, 3, 5) AS INT)), 0) + 1 AS VARCHAR), 5)
        FROM DangKyGoiTP;

        -- 3. Thiết lập ngày bắt đầu và tính toán ngày kết thúc
        DECLARE @NgayBD DATE = CAST(GETDATE() AS DATE);
        DECLARE @NgayKT DATE = DATEADD(MONTH, @ThoiHan, @NgayBD);

        -- 4. Thêm vào bảng DangKyGoiTP với thông tin ngày bắt đầu và kết thúc
        -- Giả sử bảng DangKyGoiTP của bạn có cột ThoiGianKT
        INSERT INTO DangKyGoiTP (MaDK, MaGoiTP, ThoiGianBD, ThoiGianKT, MaKH)
        VALUES (@NewMaDK, @MaGoiTP, @NgayBD, @NgayKT, @MaKH);

        -- 5. Cập nhật MaDK vào bảng DatTiemPhong để liên kết phiếu tiêm với gói
        UPDATE DatTiemPhong
        SET MaDK = @NewMaDK
        WHERE MaPhieuDV = @MaPhieuDV;

        COMMIT TRANSACTION;
        
        -- Trả về thông tin để Backend/Frontend hiển thị
        SELECT @NewMaDK AS MaDK, @NgayBD AS NgayBatDau, @NgayKT AS NgayKetThuc;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END;
GO
-------------------------------------
CREATE OR ALTER PROCEDURE sp_ThemLichTiemVaccine
    @MaDK VARCHAR(10),
	@MaVacXin VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Lấy thông tin ngày bắt đầu, ngày kết thúc và mã gói từ bảng đăng ký
        DECLARE @NgayBD DATE, @NgayKT DATE, @MaGoiTP VARCHAR(10);
        SELECT @NgayBD = ThoiGianBD, @NgayKT = ThoiGianKT, @MaGoiTP = MaGoiTP 
        FROM DangKyGoiTP WHERE MaDK = @MaDK;

		DECLARE @ThangTiem DATE;
		SELECT @ThangTiem = dateadd (month, 2, max(ThangTiem))
		FROM ThoiGianTiemChiDinh
		where MaDK = @MaDK
		

		if @ThangTiem is null
		begin
			set @ThangTiem = @NgayBD
		end

            -- Đảm bảo không vượt quá ngày kết thúc của gói
        IF @ThangTiem <= @NgayKT
        BEGIN
            INSERT INTO ThoiGianTiemChiDinh(MaDK, MaVacxin, ThangTiem, TrangThai, LieuLuong)
            VALUES (@MaDK, @MaVacxin, @ThangTiem, N'Chưa tiêm', 1);
        END


        COMMIT TRANSACTION;
        SELECT N'Đã lập lộ trình tiêm thành công' AS Message;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END;
GO
---------------------------------------
CREATE OR ALTER PROCEDURE sp_CapNhatChuanDoanKham
    @MaPhieuDV VARCHAR(10),
    @MoTaTrieuChung NVARCHAR(255),
    @MoTaChuanDoan NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Cập nhật bảng DatKhamBenh
        UPDATE DatKhamBenh
        SET MoTaTrieuChung = @MoTaTrieuChung,
            MoTaChuanDoan = @MoTaChuanDoan
        WHERE MaPhieuDV = @MaPhieuDV;

        -- 2. Tự động chuyển trạng thái PhieuDatDV sang 'Hoàn thành' nếu cần
        UPDATE PhieuDatDV
        SET TrangThai = N'Hoàn thành'
        WHERE MaPhieuDV = @MaPhieuDV;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        THROW;
    END CATCH
END;
GO

--------------------------------------------
CREATE OR ALTER PROCEDURE sp_LayDanhSachVacxinTrongChiNhanh
    @MaCN VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        v.MaVacxin,
        v.TenVacXin,
        v.NgaySanXuat,
        v.GiaVacXin,
        vc.TonKho AS SoLuongTon
    FROM Vacxin v
    INNER JOIN Vacxin_ChiNhanh vc ON v.MaVacXin = vc.MaVacxin
    WHERE vc.MaCN = @MaCN
      AND vc.TonKho > 0 -- Chỉ lấy vắc-xin còn trong kho
    ORDER BY v.TenVacXin ASC;
END;
GO
---------------------------------
CREATE OR ALTER PROCEDURE sp_TaoLichHenKhamBenh
    @MaKH VARCHAR(10),
    @MaCN VARCHAR(10),
    @MaDV VARCHAR(10),
    @HinhThucDat NVARCHAR(50),
    @BacSiPhuTrach VARCHAR(10),
    @MaTC VARCHAR(10),
    @NgayKham DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Sinh mã phiếu mới (VD: PDV00001)
        DECLARE @NewMaPhieu VARCHAR(10);
        SELECT @NewMaPhieu = 'PDV' + RIGHT('000000' + CAST(ISNULL(MAX(CAST(SUBSTRING(MaPhieuDV, 4, 7) AS INT)), 0) + 1 AS VARCHAR), 7)
        FROM PhieuDatDV;

        -- 2. Thêm vào bảng PhieuDatDV (Thông tin chung)
        INSERT INTO PhieuDatDV (MaPhieuDV, NgayDatDV, MaKH, MaCN, MaDV, HinhThucDat, TrangThai, LoaiDichVu, BacSiPhuTrach)
        VALUES (@NewMaPhieu, GETDATE(), @MaKH, @MaCN, @MaDV, @HinhThucDat, N'Đang chờ', N'Khám bệnh', @BacSiPhuTrach);

        -- 3. Thêm vào bảng DatKhamBenh (Thông tin chi tiết khám)
        INSERT INTO DatKhamBenh (MaPhieuDV, NgayKham, MaTC)
        VALUES (@NewMaPhieu, @NgayKham, @MaTC);

        COMMIT TRANSACTION;
        SELECT @NewMaPhieu AS MaPhieuDV; -- Trả về mã phiếu để in biên nhận
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END;
GO
-----------------------------------
CREATE OR ALTER PROCEDURE sp_TaoLichHenTiemPhong
    @MaKH VARCHAR(10),
    @MaCN VARCHAR(10),
    @MaDV VARCHAR(10),
    @HinhThucDat NVARCHAR(50),
    @BacSiPhuTrach VARCHAR(10),
    @MaTC VARCHAR(10),
    @NgayTiem DATETIME,
    @MaDK VARCHAR(10) = NULL -- Mã gói tiêm nếu có
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    BEGIN TRY
        -- 1. Sinh mã phiếu mới PDVXXXXXXX
        DECLARE @NewMaPhieu VARCHAR(10);
        SELECT @NewMaPhieu = 'PDV' + RIGHT('000000' + CAST(ISNULL(MAX(CAST(SUBSTRING(MaPhieuDV, 4, 7) AS INT)), 0) + 1 AS VARCHAR), 7)
        FROM PhieuDatDV;

        -- 2. Thêm vào bảng PhieuDatDV (Trạng thái: Chờ xác nhận)
        INSERT INTO PhieuDatDV (MaPhieuDV, NgayDatDV, MaKH, MaCN, MaDV, HinhThucDat, TrangThai, LoaiDichVu, BacSiPhuTrach)
        VALUES (@NewMaPhieu, GETDATE(), @MaKH, @MaCN, @MaDV, @HinhThucDat, N'Đang chờ', N'Tiêm phòng', @BacSiPhuTrach);

        -- 3. Thêm vào bảng DatTiemPhong
        INSERT INTO DatTiemPhong (MaPhieuDV, NgayTiem, MaTC, MaDK)
        VALUES (@NewMaPhieu, @NgayTiem, @MaTC, @MaDK);

        COMMIT TRANSACTION;
        SELECT @NewMaPhieu AS MaPhieuDV;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        THROW;
    END CATCH
END;
GO
------------------------------------------
CREATE OR ALTER PROCEDURE sp_LayChiTietDichVu
    @MaPhieuDV VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    -- Lấy loại dịch vụ của phiếu
    DECLARE @LoaiDV NVARCHAR(50);
    SELECT @LoaiDV = LoaiDichVu FROM PhieuDatDV WHERE MaPhieuDV = @MaPhieuDV;

    IF @LoaiDV IS NULL
    BEGIN
        RAISERROR(N'Không tìm thấy phiếu dịch vụ này.', 16, 1);
        RETURN;
    END

    -- Tập 1: Thông tin chung (Dùng cho tất cả các loại)
    SELECT * FROM PhieuDatDV WHERE MaPhieuDV = @MaPhieuDV;

    -- Tập 2 & 3: Chi tiết theo từng loại dịch vụ cụ thể
    IF @LoaiDV = N'Khám bệnh'
    BEGIN
        SELECT k.*, tc.TenTC FROM DatKhamBenh k 
        LEFT JOIN ThuCung tc ON k.MaTC = tc.MaTC
        WHERE k.MaPhieuDV = @MaPhieuDV;
        
        SELECT * FROM DonThuoc WHERE MaPhieuDV = @MaPhieuDV;
    END
    ELSE IF @LoaiDV = N'Tiêm phòng'
    BEGIN
        SELECT t.*, tc.TenTC FROM DatTiemPhong t
        LEFT JOIN ThuCung tc ON t.MaTC = tc.MaTC
        WHERE t.MaPhieuDV = @MaPhieuDV;
        
        SELECT * FROM DanhSachVacxin WHERE MaPhieuDV = @MaPhieuDV;
    END
    ELSE IF @LoaiDV = N'Mua hàng' -- BỔ SUNG CHO MUA HÀNG
    BEGIN
        -- Tập 2: Thông tin giao hàng và tổng tiền
        SELECT * FROM DatMuaHang WHERE MaPhieuDV = @MaPhieuDV;
        
        -- Tập 3: Danh sách sản phẩm trong đơn hàng (Lấy từ bảng Snapshot)
        SELECT 
            MaSP, 
            TenSP_SnapShot AS TenSP, 
            SoLuongMua, 
            DonGia_LucMua AS GiaBan,
            (SoLuongMua * DonGia_LucMua) AS ThanhTien
        FROM DanhSachSP 
        WHERE MaPhieuDV = @MaPhieuDV;
    END
END;
GO
-----------------------------------------------
CREATE OR ALTER PROCEDURE sp_HuyLichHenDichVu
    @MaPhieuDV VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Kiểm tra trạng thái hiện tại của phiếu
    DECLARE @CurrentStatus NVARCHAR(50);
    SELECT @CurrentStatus = TrangThai FROM PhieuDatDV WHERE MaPhieuDV = @MaPhieuDV;

	DECLARE @typeService NVARCHAR(50);
	select @typeService = LoaiDichVu
	from PhieuDatDV
	where MaPhieuDV = @MaPhieuDV;

    IF @CurrentStatus IS NULL
    BEGIN
        RAISERROR(N'Không tìm thấy mã phiếu dịch vụ này.', 16, 1);
        RETURN;
    END

    -- Chỉ cho phép hủy nếu phiếu chưa hoàn thành hoặc chưa thanh toán
    IF @CurrentStatus IN (N'Hoàn thành', N'Đã thanh toán', N'Đang thực hiện')
    BEGIN
        RAISERROR(N'Không thể hủy phiếu đã hoàn thành hoặc đang trong quá trình thực hiện.', 16, 1);
        RETURN;
    END

	if @typeService = N'Mua hàng'
	begin 
		raiserror(N'Không thể hủy phiếu thuộc loại mua hàng.', 16, 1);
		return;
	end

    -- Cập nhật trạng thái thành 'Hủy'
    UPDATE PhieuDatDV
    SET TrangThai = N'Hủy'
    WHERE MaPhieuDV = @MaPhieuDV;

    SELECT N'Đã hủy lịch thành công' AS Message;
END;
GO