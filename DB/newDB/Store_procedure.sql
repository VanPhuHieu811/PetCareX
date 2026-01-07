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
