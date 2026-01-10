IF OBJECT_ID('SP_XetHangThanhVien_CuoiNam', 'P') IS NOT NULL DROP PROCEDURE SP_XetHangThanhVien_CuoiNam;
GO
--Xét hạng thành viên của khách hàng vào mỗi cuối năm
CREATE PROCEDURE SP_XetHangThanhVien_CuoiNam
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @NamCanXet INT = YEAR(GETDATE()); 
    
    -- 1. Tính tổng chi tiêu TRONG NĂM NAY của tất cả khách hàng
    WITH ChiTieuNamNay AS (
        SELECT MaKH, SUM(TongTien) AS TienNamNay
        FROM HoaDon
        WHERE YEAR(NgayLap) = @NamCanXet
        GROUP BY MaKH
    )
    -- 2. Hạ cấp (Downgrade) nếu không đạt mức duy trì
    UPDATE kh
    SET MaLoaiTV = CASE 
        -- Đang là VIP (LTV03) mà tiêu < 8tr -> Xuống Thân thiết (LTV02)
        WHEN kh.MaLoaiTV = 'LTV03' AND ISNULL(ct.TienNamNay, 0) < 8000000 THEN 'LTV02'
        
        -- Đang là Thân thiết (LTV02) mà tiêu < 3tr -> Xuống Cơ bản (LTV01)
        WHEN kh.MaLoaiTV = 'LTV02' AND ISNULL(ct.TienNamNay, 0) < 3000000 THEN 'LTV01'
        
        -- Còn lại giữ nguyên
        ELSE kh.MaLoaiTV
    END
    FROM KhachHang kh
    LEFT JOIN ChiTieuNamNay ct ON kh.MaKH = ct.MaKH
    WHERE kh.MaLoaiTV IN ('LTV02', 'LTV03'); -- Chỉ xét những người đang có hạng

    PRINT N'Đã hoàn tất xét duyệt hạng thành viên cho năm ' + CAST(@NamCanXet AS NVARCHAR(10));
END;
GO


-- Thủ tục cập nhật hạng thành viên khách hàng dựa trên mức chi tiêu trong năm hiện tại
CREATE PROCEDURE SP_CapNhatHangThanhVien
    @MaKH_Input varchar(10) = NULL -- Nếu NULL thì chạy cho toàn bộ khách hàng, ngược lại chạy cho 1 người
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @NamHienTai INT = YEAR(GETDATE());

    -- Sử dụng bảng tạm hoặc CTE để tính tổng chi tiêu trong năm nay
    ;WITH ChiTieuNamNay AS (
        SELECT 
            MaKH, 
            SUM(TongTien) AS TongTienNamNay
        FROM HoaDon
        WHERE YEAR(NgayLap) = @NamHienTai
          AND (@MaKH_Input IS NULL OR MaKH = @MaKH_Input) -- Lọc theo khách nếu có tham số
        GROUP BY MaKH
    )
    -- Thực hiện update
    UPDATE kh
    SET MaLoaiTV = CASE 
        -- Nâng lên VIP (LTV03) nếu >= 12tr và chưa phải VIP
        WHEN ct.TongTienNamNay >= 12000000 AND kh.MaLoaiTV IN ('LTV01', 'LTV02') THEN 'LTV03'
        
        -- Nâng lên Thân thiết (LTV02) nếu >= 5tr và đang là Cơ bản
        WHEN ct.TongTienNamNay >= 5000000 AND kh.MaLoaiTV = 'LTV01' THEN 'LTV02'
        
        -- Giữ nguyên
        ELSE kh.MaLoaiTV
    END
    FROM KhachHang kh
    JOIN ChiTieuNamNay ct ON kh.MaKH = ct.MaKH
    WHERE 
        -- Chỉ update những dòng có sự thay đổi hạng để tối ưu performance
        (ct.TongTienNamNay >= 12000000 AND kh.MaLoaiTV IN ('LTV01', 'LTV02'))
        OR 
        (ct.TongTienNamNay >= 5000000 AND kh.MaLoaiTV = 'LTV01');
    
    -- Trả về số lượng khách hàng vừa được thăng hạng (Optional)
    SELECT @@ROWCOUNT AS SoKhachHangDuocThangHang;
END;
GO


-- Thủ tục thêm một thú cưng vào bảng
CREATE OR ALTER PROCEDURE SP_ThemThuCung
    @TenTC nvarchar(50),
    @MaGiong varchar(10),
    @NgaySinh date,
    @TinhTrangSucKhoe nvarchar(100),
    @MaKH varchar(10),
    @GioiTinh nvarchar(3)
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Tự động sinh mã Thu Cưng mới (Dạng TCxxxxx)
    DECLARE @MaxID varchar(10);
    DECLARE @NewID varchar(10);
    DECLARE @NumberPart int;

    -- Lấy mã lớn nhất hiện tại (Ví dụ: TC00015)
    SELECT TOP 1 @MaxID = MaTC 
    FROM ThuCung 
    ORDER BY MaTC DESC;

    IF @MaxID IS NULL
    BEGIN
        SET @NewID = 'TC00001'; -- Nếu chưa có thì bắt đầu từ 1
    END
    ELSE
    BEGIN
        SET @NumberPart = CAST(SUBSTRING(@MaxID, 3, LEN(@MaxID) - 2) AS INT) + 1;
        SET @NewID = 'TC' + RIGHT('00000' + CAST(@NumberPart AS varchar(5)), 5);
    END

    -- 2. Thực hiện Insert
    INSERT INTO ThuCung (MaTC, TenTC, MaGiong, NgaySinh, TinhTrangSucKhoe, MaKH, GioiTinh)
    VALUES (@NewID, @TenTC, @MaGiong, @NgaySinh, @TinhTrangSucKhoe, @MaKH, @GioiTinh);

    -- 3. Trả về thông tin thú cưng vừa tạo (để Backend hiển thị)
    SELECT * FROM ThuCung WHERE MaTC = @NewID;
END;
GO

select *
from LoaiThanhVien

select nd.MaND, nd.HoTen, nd.Email, tk.MatKhau
from NguoiDung nd 
join TaiKhoan tk on tk.MaND = nd.MaND
join KhachHang k on k.MaKH = nd.MaND
where nd.MaND = 'kh02251' or nd.HoTen = N'Văn Phú Hiệu'

select nd.MaND, nd.HoTen, nd.Email, tk.MatKhau, hd.MaHoaDon, count(p.MaPhieuDV)
from NguoiDung nd 
join TaiKhoan tk on tk.MaND = nd.MaND
join KhachHang k on k.MaKH = nd.MaND
join HoaDon hd on hd.MaKH = k.MaKH
join ChiTietHoaDon cthd on cthd.MaHoaDon = hd.MaHoaDon
join PhieuDatDV p on p.MaPhieuDV = cthd.MaPhieuDV
where nd.MaND = 'kh02251' or nd.HoTen = N'Văn Phú Hiệu'
group by nd.MaND, nd.HoTen, nd.Email, tk.MatKhau, hd.MaHoaDon




BEGIN TRANSACTION;
BEGIN TRY

    -- ======================================================================================
    -- 1. LOGIC TỰ ĐỘNG SINH MÃ (AUTO INCREMENT ID)
    -- ======================================================================================
    
    -- A. Lấy số lớn nhất hiện tại của PhieuDatDV (Cắt bỏ 3 ký tự đầu 'PDV', lấy 6 số đuôi)
    DECLARE @MaxID_PDV int;
    SELECT @MaxID_PDV = ISNULL(MAX(CAST(RIGHT(MaPhieuDV, 6) AS INT)), 0) FROM PhieuDatDV;

    -- B. Lấy số lớn nhất hiện tại của HoaDon (Cắt bỏ 2 ký tự đầu 'HD', lấy 6 số đuôi)
    DECLARE @MaxID_HD int;
    SELECT @MaxID_HD = ISNULL(MAX(CAST(RIGHT(MaHoaDon, 6) AS INT)), 0) FROM HoaDon;

    -- C. Tạo 3 mã Phiếu Dịch Vụ mới (Tăng dần liên tiếp)
    DECLARE @MaPDV_Kham varchar(10) = 'PDV' + FORMAT(@MaxID_PDV + 1, '000000');
    DECLARE @MaPDV_Tiem varchar(10) = 'PDV' + FORMAT(@MaxID_PDV + 2, '000000');
    DECLARE @MaPDV_Mua  varchar(10) = 'PDV' + FORMAT(@MaxID_PDV + 3, '000000');

    -- D. Tạo 1 mã Hóa Đơn mới
    DECLARE @MaHoaDon   varchar(10) = 'HD' + FORMAT(@MaxID_HD + 1, '000000');

    PRINT N'--- Các mã sẽ được tạo: ' + @MaPDV_Kham + ', ' + @MaPDV_Tiem + ', ' + @MaPDV_Mua + ' thuộc HĐ: ' + @MaHoaDon;

    -- ======================================================================================
    -- 2. CHUẨN BỊ DỮ LIỆU NỀN (KHÁCH, BÁC SĨ...)
    -- ======================================================================================
    DECLARE @MaKH varchar(10) = 'KH05004'; -- Khách hàng mục tiêu
    DECLARE @NgayHienTai datetime = GETDATE();
    
    -- Tự động lấy 1 Chi nhánh, Bác sĩ, Nhân viên bán hàng bất kỳ
    DECLARE @MaCN varchar(10) = (SELECT TOP 1 MaCN FROM ChiNhanh);
    DECLARE @BacSi varchar(10) = (SELECT TOP 1 MaNV FROM NhanVien WHERE TenChucVu = N'Bác sĩ' AND MaCN = @MaCN);
    DECLARE @NVBanHang varchar(10) = (SELECT TOP 1 MaNV FROM NhanVien WHERE TenChucVu = N'Bán hàng' AND MaCN = @MaCN);
    
    -- Tự động lấy 1 Thú cưng của khách này
    DECLARE @MaTC varchar(10) = (SELECT TOP 1 MaTC FROM ThuCung WHERE MaKH = @MaKH);
    IF @MaTC IS NULL SET @MaTC = (SELECT TOP 1 MaTC FROM ThuCung); -- Fallback nếu khách chưa có pet

    -- Biến tính tiền
    DECLARE @TienKham int = 0;
    DECLARE @TienTiem int = 0;
    DECLARE @TienMua  int = 0;

    -- ======================================================================================
    -- 3. TẠO PHIẾU 1: KHÁM BỆNH (ID: @MaPDV_Kham)
    -- ======================================================================================
    INSERT INTO PhieuDatDV (MaPhieuDV, NgayDatDV, MaKH, MaCN, MaDV, HinhThucDat, TrangThai, LoaiDichVu, BacSiPhuTrach)
    VALUES (@MaPDV_Kham, @NgayHienTai, @MaKH, @MaCN, 'DV01', N'Tại quầy', N'Hoàn thành', N'Khám bệnh', @BacSi);

    INSERT INTO DatKhamBenh (MaPhieuDV, NgayKham, MoTaTrieuChung, MoTaChuanDoan, TongTienDonThuoc, MaTC)
    VALUES (@MaPDV_Kham, @NgayHienTai, N'Sốt cao, ho', N'Viêm phổi nhẹ', 0, @MaTC);

    -- Kê thuốc
    DECLARE @Thuoc1 varchar(10) = (SELECT TOP 1 MaSP FROM SanPham WHERE MaLoaiSP = 'LSP01');
    -- Lấy đơn vị tính để điền liều dùng hợp lý
    DECLARE @DVT nvarchar(20) = (SELECT DonViTinh FROM SanPham WHERE MaSP = @Thuoc1);
    DECLARE @LieuDung nvarchar(50) = CASE WHEN @DVT IN (N'Viên', N'Hộp') THEN N'1 viên' ELSE N'5 ml' END;

    INSERT INTO DonThuoc (MaPhieuDV, MaSP, MaCN, SoLuongMua, ThanhTien, TanSuat, LieuDung)
    VALUES (@MaPDV_Kham, @Thuoc1, @MaCN, 2, 200000, 2, @LieuDung);
    
    SET @TienKham = 200000 + 200000; -- Tiền thuốc + Công khám

    -- ======================================================================================
    -- 4. TẠO PHIẾU 2: TIÊM PHÒNG (ID: @MaPDV_Tiem)
    -- ======================================================================================
    INSERT INTO PhieuDatDV (MaPhieuDV, NgayDatDV, MaKH, MaCN, MaDV, HinhThucDat, TrangThai, LoaiDichVu, BacSiPhuTrach)
    VALUES (@MaPDV_Tiem, @NgayHienTai, @MaKH, @MaCN, 'DV02', N'Tại quầy', N'Hoàn thành', N'Tiêm phòng', @BacSi);

    INSERT INTO DatTiemPhong (MaPhieuDV, NgayTiem, MaTC, MaDK)
    VALUES (@MaPDV_Tiem, @NgayHienTai, @MaTC, NULL);

    DECLARE @Vacxin1 varchar(10) = (SELECT TOP 1 MaVacXin FROM VacXin);
    INSERT INTO DanhSachVacXin (MaPhieuDV, MaVacXin, LieuLuong, DonGia)
    VALUES (@MaPDV_Tiem, @Vacxin1, 1, 150000);

    SET @TienTiem = 150000;

    -- ======================================================================================
    -- 5. TẠO PHIẾU 3: MUA HÀNG (ID: @MaPDV_Mua)
    -- ======================================================================================
    INSERT INTO PhieuDatDV (MaPhieuDV, NgayDatDV, MaKH, MaCN, MaDV, HinhThucDat, TrangThai, LoaiDichVu, BacSiPhuTrach)
    VALUES (@MaPDV_Mua, @NgayHienTai, @MaKH, @MaCN, 'DV03', N'Tại quầy', N'Hoàn thành', N'Mua hàng', NULL);

    INSERT INTO DatMuaHang (MaPhieuDV, TongTien) VALUES (@MaPDV_Mua, 0);

    DECLARE @SanPham1 varchar(10) = (SELECT TOP 1 MaSP FROM SanPham WHERE MaLoaiSP != 'LSP01');
    INSERT INTO DanhSachSP (MaPhieuDV, MaSP, MaCN, SoLuongMua)
    VALUES (@MaPDV_Mua, @SanPham1, @MaCN, 1);
    
    DECLARE @GiaSP int = (SELECT GiaBan FROM SanPham WHERE MaSP = @SanPham1);
    UPDATE DatMuaHang SET TongTien = @GiaSP WHERE MaPhieuDV = @MaPDV_Mua;
    
    SET @TienMua = @GiaSP;

    -- ======================================================================================
    -- 6. TẠO HÓA ĐƠN TỔNG (ID: @MaHoaDon)
    -- ======================================================================================
    DECLARE @TongTienHD bigint = @TienKham + @TienTiem + @TienMua;

    INSERT INTO HoaDon (MaHoaDon, MaNVLap, MaKH, MaCN, MaKhuyenMai, NgayLap, TongTien, HinhThucThanhToan)
    VALUES (@MaHoaDon, @NVBanHang, @MaKH, @MaCN, NULL, @NgayHienTai, @TongTienHD, N'Tiền mặt');

    INSERT INTO ChiTietHoaDon (MaHoaDon, MaPhieuDV, TongTienDV) VALUES 
    (@MaHoaDon, @MaPDV_Kham, @TienKham),
    (@MaHoaDon, @MaPDV_Tiem, @TienTiem),
    (@MaHoaDon, @MaPDV_Mua,  @TienMua);

    -- Cập nhật trạng thái "Đã thanh toán"
    UPDATE PhieuDatDV 
    SET TrangThai = N'Đã thanh toán' 
    WHERE MaPhieuDV IN (@MaPDV_Kham, @MaPDV_Tiem, @MaPDV_Mua);

    COMMIT TRANSACTION;
    PRINT N'✅ ĐÃ TẠO THÀNH CÔNG HÓA ĐƠN: ' + @MaHoaDon;
    
    -- Xem kết quả
    SELECT * FROM HoaDon WHERE MaHoaDon = @MaHoaDon;
    SELECT * FROM ChiTietHoaDon WHERE MaHoaDon = @MaHoaDon;

END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    PRINT N'❌ LỖI: ' + ERROR_MESSAGE();
END CATCH;


