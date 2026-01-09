use db_ac35db_new
GO
--Function to get information of customer. 
--Input: sđt/cccd of customer. Output: customer information and list of pets.
CREATE FUNCTION dbo.FN_GetCustomerInfo (@identifier NVARCHAR(50))
RETURNS TABLE
AS
RETURN
(
    SELECT 
        nd.HoTen,
        nd.sdt,
        nd.Email,
        kh.DiemLoyalty,
        COUNT(tt.MaTC) OVER (PARTITION BY kh.makh) AS SoLuongThuCung,
        tt.TenTC,
        tt.GioiTinh,
        tt.NgaySinh,
        tt.TenGiong,
        tt.TinhTrangSucKhoe,
        tt.TenLoaiTC,
        tt.MaGiong
    FROM NguoiDung nd
    JOIN khachhang kh ON nd.MaND = kh.makh
    LEFT JOIN thucung tt ON kh.makh = tt.makh
    WHERE (nd.sdt = @identifier OR nd.cccd = @identifier or nd.Email = @identifier)
      AND nd.LoaiND = N'Khách hàng'
);

GO
drop function dbo.FN_GetCustomerInfo

SELECT *
from khachhang kh
join NguoiDung nd on kh.makh = nd.MaND
join thucung tt on kh.makh = tt.makh
--Example usage:
SELECT * FROM dbo.FN_GetCustomerInfo('743816851924');

SELECT 
                COUNT(CASE WHEN p.TrangThai = N'Đang chờ' THEN 1 END) AS DangCho,
                COUNT(CASE WHEN p.TrangThai = N'Đang thanh toán' THEN 1 END) AS DaThanhToan,
                COUNT(CASE WHEN p.TrangThai = N'Hoàn thành' THEN 1 END) AS HoanThanh,
                COUNT(CASE WHEN p.TrangThai = N'Hủy' THEN 1 END) AS DaHuy
FROM PhieuDatDV p 
WHERE CAST(p.NgayDatDV AS DATE) = @NgayLoc
SELECT p.NgayDatDV, count(*) as SoLuongPhieuDat
from PhieuDatDV p
group by p.NgayDatDV
ORDER by SoLuongPhieuDat desc
-- Lấy danh sách lịch hẹn theo ngày, trạng thái và từ khóa tìm kiếm

SELECT p.MaPhieuDV, p.NgayDatDV, p.TenThuCung, dv.TenDV, 
        ndKH.HoTen AS TenKH, ndKH.sdt AS SdtKH, 
        ndBS.HoTen AS TenBS, p.TrangThai
FROM PhieuDatDV p
JOIN NguoiDung ndKH ON p.MaKH = ndKH.MaND
LEFT JOIN NhanVien bs ON p.BacSiPhuTrach = bs.MaNV
LEFT JOIN NguoiDung ndBS ON bs.MaNV = ndBS.MaND
JOIN DichVu dv ON p.MaDV = dv.MaDV
WHERE CAST(p.NgayDatDV AS DATE) = @NgayLoc
    AND (@TrangThai = N'Tất cả' OR p.TrangThai = @TrangThai)
    AND (ndKH.HoTen LIKE '%' + @Search + '%' OR p.TenThuCung LIKE '%' + @Search + '%')
ORDER BY p.NgayDatDV ASC
GO
--Function to get list of doctors available for a specific date and time slot at a branch
CREATE FUNCTION dbo.FN_GetAvailableDoctors (
    @branchId NVARCHAR(50),
    @appointmentDate DATETIME,
    @timeSlot NVARCHAR(50)
)
RETURNS TABLE
AS
RETURN
(
    SELECT 
        nv.MaNV,
        nd.HoTen,
        nd.sdt,
        nd.Email
    FROM NhanVien nv
    JOIN NguoiDung nd ON nv.MaNV= nd.MaND
    WHERE nv.MaCN = @branchId
      AND nv.TenChucVu = N'Bác sĩ'
      AND nv.MaNV NOT IN (
          SELECT p.BacSiPhuTrach
          FROM PhieuDatDV p
          WHERE CAST(p.NgayDatDV AS DATE) = CAST(@appointmentDate AS DATE)
            AND cast(p.NgayDatDV as time) = @timeSlot
            AND p.TrangThai != N'Hủy'
      )
);

GO
--Example usage:
SELECT * FROM dbo.FN_GetAvailableDoctors('CN003', '2024-07-01', '10:00:00');

select p.* 
from PhieuDatDV p
join DichVu d on p.MaDV = d.MaDV
where d.TenDV=N'khám bệnh'

go

SELECT 
    hd.MaHoaDon, 
    hd.NgayLap, 
    nd.HoTen AS TenKhachHang, 
    hd.TongTien,
    hd.HinhThucThanhToan
FROM HoaDon hd
LEFT JOIN KhachHang kh ON hd.MaKH = kh.MaKH
LEFT JOIN NguoiDung nd ON kh.MaKH = nd.MaND
WHERE hd.MaCN = 'CN003'
    -- AND CAST(hd.NgayLap AS DATE) = @Ngay
    -- AND (nd.HoTen LIKE @TenKH OR @TenKH = '%%')
ORDER BY hd.NgayLap DESC
GO
--function get invoice details by invoice id
CREATE FUNCTION dbo.FN_GetInvoiceDetails (@invoiceId NVARCHAR(50))
RETURNS TABLE
AS
RETURN
(
    /* ========= 1. MUA HÀNG ========= */
    SELECT
        hd.MaHoaDon,
        hd.MaNVLap,
        hd.NgayLap,
        dv.TenDV,
        p.MaPhieuDV,
        N'Sản phẩm' AS LoaiChiTiet,
        sp.TenSP AS TenChiTiet,
        ds.SoLuongMua AS SoLuong,
        sp.GiaBan AS DonGia,
        ds.SoLuongMua * sp.GiaBan AS ThanhTien
    FROM HoaDon hd
    JOIN ChiTietHoaDon ct ON hd.MaHoaDon = ct.MaHoaDon
    JOIN PhieuDatDV p ON ct.MaPhieuDV = p.MaPhieuDV
    JOIN DichVu dv ON p.MaDV = dv.MaDV
    JOIN DatMuaHang d ON d.MaPhieuDV = p.MaPhieuDV
    JOIN DanhSachSP ds ON ds.MaPhieuDV = d.MaPhieuDV
    JOIN SanPham sp ON sp.MaSP = ds.MaSP
    WHERE hd.MaHoaDon = @invoiceId
      AND dv.TenDV = N'Mua hàng'

    UNION ALL

    /* ========= 2. TIÊM PHÒNG – GÓI ========= */
    SELECT
        hd.MaHoaDon,
        hd.MaNVLap,
        hd.NgayLap,
        dv.TenDV,
        p.MaPhieuDV,
        N'Gói tiêm',
        gtp.TenGoiTP,
        NULL,
        SUM(vx.GiaVacxin),
        SUM(vx.GiaVacxin)
    FROM HoaDon hd
    JOIN ChiTietHoaDon ct ON hd.MaHoaDon = ct.MaHoaDon
    JOIN PhieuDatDV p ON ct.MaPhieuDV = p.MaPhieuDV
    JOIN DichVu dv ON p.MaDV = dv.MaDV
    JOIN DatTiemPhong dtp ON dtp.MaPhieuDV = p.MaPhieuDV
    JOIN DangKyGoiTP dkg ON dkg.MaDK = dtp.MaDK
    JOIN GoiTiemPhong gtp ON gtp.MaGoiTP = dkg.MaGoiTP
    JOIN ThoiGianTiemChiDinh tgtd ON tgtd.MaDK = dkg.MaDK
    JOIN Vacxin vx ON vx.MaVacxin = tgtd.MaVacxin
    WHERE hd.MaHoaDon = @invoiceId
      AND dv.TenDV = N'Tiêm phòng'
    GROUP BY
        hd.MaHoaDon, hd.MaNVLap, hd.NgayLap,
        dv.TenDV, p.MaPhieuDV, gtp.TenGoiTP

    UNION ALL

    /* ========= 3. TIÊM PHÒNG – LẺ ========= */
    SELECT
        hd.MaHoaDon,
        hd.MaNVLap,
        hd.NgayLap,
        dv.TenDV,
        p.MaPhieuDV,
        N'Vắc-xin lẻ',
        vx.TenVacxin,
        1,
        vx.GiaVacxin,
        vx.GiaVacxin
    FROM HoaDon hd
    JOIN ChiTietHoaDon ct ON hd.MaHoaDon = ct.MaHoaDon
    JOIN PhieuDatDV p ON ct.MaPhieuDV = p.MaPhieuDV
    JOIN DichVu dv ON p.MaDV = dv.MaDV
    JOIN DatTiemPhong dtp ON dtp.MaPhieuDV = p.MaPhieuDV
    JOIN DanhSachVacXin dsvx ON dsvx.MaPhieuDV = dtp.MaPhieuDV
    JOIN Vacxin vx ON vx.MaVacxin = dsvx.MaVacxin
    WHERE hd.MaHoaDon = @invoiceId
      AND dv.TenDV = N'Tiêm phòng'
      AND dtp.MaDK IS NULL

    UNION ALL

    /* ========= 4. KHÁM BỆNH ========= */
    SELECT
        hd.MaHoaDon,
        hd.MaNVLap,
        hd.NgayLap,
        dv.TenDV,
        p.MaPhieuDV,
        N'Dịch vụ',
        N'Khám bệnh',
        1,
        ct.TongTienDV,
        ct.TongTienDV
    FROM HoaDon hd
    JOIN ChiTietHoaDon ct ON hd.MaHoaDon = ct.MaHoaDon
    JOIN PhieuDatDV p ON ct.MaPhieuDV = p.MaPhieuDV
    JOIN DichVu dv ON p.MaDV = dv.MaDV
    WHERE hd.MaHoaDon = @invoiceId
      AND dv.TenDV = N'Khám bệnh'
);
go
--example usage:
SELECT * FROM dbo.FN_GetInvoiceDetails('HD000008');
SELECT * FROM dbo.FN_GetInvoiceDetails('HD000013');
SELECT * FROM dbo.FN_GetInvoiceDetails('HD000047');
SELECT * FROM dbo.FN_GetInvoiceDetails('HD000001');
go
select* from HoaDon hd
join ChiTietHoaDon ct on hd.MaHoaDon = ct.MaHoaDon
join PhieuDatDV p on ct.MaPhieuDV = p.MaPhieuDV
join DichVu dv on p.MaDV = dv.MaDV
where dv.TenDV=N'Khám bệnh'

select *
from NguoiDung
join TaiKhoan  t on NguoiDung.MaND = T.MaND
where hoten like N'%Hảo%'

go
--function to receive feedback from customer
CREATE FUNCTION dbo.FN_SubmitFeedback (
    @MaPhieuDV NVARCHAR(50),
    @NgayDanhGia DATETIME,
    @DiemDanhGia INT,
    @ThaiDoNhanVien INT,
    @MucDoHaiLong NVARCHAR,
    @BinhLuan NVarchar(500),
    @MaKH NVARCHAR(50)
)
RETURNS TABLE
AS
RETURN
(   
    if @DiemDanhGia <0 or @DiemDanhGia >10 
    begin
        raiserror('DiemDanhGia phai trong khoang 0-10',16,1)
        return
    end
    if @ThaiDoNhanVien <0 or @ThaiDoNhanVien >10
    begin
        raiserror('ThaiDoNhanVien phai trong khoang 0-10',16,1)
        return
    end

    INSERT INTO DanhGia (MaPhieuDV, NgayDanhGia, DiemDanhGia, ThaiDoNhanVien, MucDoHaiLong, BinhLuan, MaKH )
    VALUES (@MaPhieuDV, @NgayDanhGia, @DiemDanhGia, @ThaiDoNhanVien, @MucDoHaiLong, @BinhLuan, @MaKH);

    SELECT 
        ph.MaPhanHoi,
        ph.MaKH,
        ph.MaDV,
        ph.Rating,
        ph.Comments,
        ph.NgayPhanHoi
    FROM PhanHoiKH ph
    WHERE ph.MaKH = @customerId AND ph.MaDV = @serviceId
      AND ph.NgayPhanHoi = CAST(GETDATE() AS DATE)
);

go
select *
from DanhGia
where MaPhieuDV='PDV000001' and MaKH='KH01655'
