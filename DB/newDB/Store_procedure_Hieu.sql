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
from TaiKhoan tk 
join NguoiDung nd on nd.MaND = tk.MaND
join NhanVien nv on nv.Manv = nd.MaND