create or alter function f_getAllBranchRevenue(
	@macn varchar(10)
)
returns table
as
return (
	select p.LoaiDichVu, isnull(sum(cast(ct.TongTienDV as bigint)), 0) as DoanhThu
	from ChiTietHoaDon ct, PhieuDatDV p
	where ct.MaPhieuDV = p.MaPhieuDV
		and p.MaCN = @macn
	group by p.LoaiDichVu
)
go

create or alter function f_countServiceUsage(
	@macn varchar(10)
)
returns table
as
return (
	select p.LoaiDichVu, count(p.MaPhieuDV) as SoLanDung
	from PhieuDatDV p
	where p.MaCN = 'CN001'
	group by p.LoaiDichVu
)
go

CREATE OR ALTER FUNCTION f_getDoctorStatistics (
    @macn VARCHAR(10)
)
RETURNS TABLE
AS
RETURN (
    SELECT
        nv.MaNV,
        nd.HoTen,
        -- Đếm số ca
        SUM(CASE WHEN p.LoaiDichVu = N'Khám bệnh' THEN 1 ELSE 0 END) AS SoCaKhamBenh,
        SUM(CASE WHEN p.LoaiDichVu = N'Tiêm phòng' THEN 1 ELSE 0 END) AS SoCaTiemPhong,
        -- Tính tổng tiền (Sử dụng ISNULL để tránh giá trị NULL)
        ISNULL(SUM(cast(ct.tongtiendv as bigint)), 0) as TongDoanhThu
    FROM NhanVien nv
    INNER JOIN NguoiDung nd ON nv.MaNV = nd.MaND
    LEFT JOIN PhieuDatDV p ON nv.MaNV = p.BacSiPhuTrach
    LEFT JOIN ChiTietHoaDon ct ON p.MaPhieuDV = ct.MaPhieuDV
    WHERE nv.TenChucVu = N'Bác sĩ'
      AND nv.MaCN = @macn
    GROUP BY nv.MaNV, nd.HoTen
);
GO

create or alter function f_getDateStatistics(
	@macn varchar(10),
	@ngay int,
	@thang int,
	@nam int
)
returns @dateInfo table (
	NgayDat date,
	SoPhieuKham int,
	SoPhieuTiem int
)
begin
	if @thang = 0
	begin
		insert into @dateInfo
		select 
			cast(p.NgayDatDV as date),
			SUM(CASE WHEN p.LoaiDichVu = N'Khám bệnh' THEN 1 ELSE 0 END) AS SoCaKhamBenh,
			SUM(CASE WHEN p.LoaiDichVu = N'Tiêm phòng' THEN 1 ELSE 0 END) AS SoCaTiemPhong
		from PhieuDatDV p
		where p.MaCN = @macn
			and YEAR(p.NgayDatDV) = @nam
		group by cast(p.NgayDatDV as date)
	end
	if @ngay = 0
	begin
		insert into @dateInfo
		select 
			cast(p.NgayDatDV as date),
			SUM(CASE WHEN p.LoaiDichVu = N'Khám bệnh' THEN 1 ELSE 0 END) AS SoCaKhamBenh,
			SUM(CASE WHEN p.LoaiDichVu = N'Tiêm phòng' THEN 1 ELSE 0 END) AS SoCaTiemPhong
		from PhieuDatDV p
		where p.MaCN = @macn
			and YEAR(p.NgayDatDV) = @nam
			and MONTH(p.NgayDatDV) = @thang
		group by cast(p.NgayDatDV as date)
	end
	insert into @dateInfo
	select 
		cast(p.NgayDatDV as date),
		SUM(CASE WHEN p.LoaiDichVu = N'Khám bệnh' THEN 1 ELSE 0 END) AS SoCaKhamBenh,
		SUM(CASE WHEN p.LoaiDichVu = N'Tiêm phòng' THEN 1 ELSE 0 END) AS SoCaTiemPhong
	from PhieuDatDV p
	where p.MaCN = @macn
		and YEAR(p.NgayDatDV) = @nam
		and MONTH(p.NgayDatDV) = @thang
		and DAY(p.NgayDatDV) = @ngay
	group by cast(p.NgayDatDV as date)
	return
end
go

create or alter function f_getVaccineByBranch (
	@pagenumber int = 1,
	@pagesize int = 20,
	@macn varchar(10)
)
returns table
as
return (
	select vx.MaVacXin, vx.TenVacXin, vx.NgaySanXuat, vx.GiaVacXin, vx.DonViTinh, vxcn.TonKho
	from VacXin_ChiNhanh vxcn, VacXin vx
	where vxcn.MaCN = @macn
		and vx.MaVacXin = vxcn.MaVacXin
)
go

select * from TaiKhoan t join NguoiDung n on t.MaND = n.MaND where n.MaND = 'NV0001'

select * from VacXin


select * from NhanVien
select * from PhieuDatDV where BacSiPhuTrach = 'NV0002'
select * from VacXin_ChiNhanh where MaCN = 'CN001'

select vc.MaVacXin, vc.TenVacXin, count(distinct tp.MaPhieuDV) as LuotSuDung
from vacxin vc, danhsachvacxin ds, phieudatdv tp
where ds.MaPhieuDV = tp.MaPhieuDV
	and ds.MaVacXin = vc.MaVacXin
	and (tp.TrangThai = N'Đã thanh toán' or tp.TrangThai = N'Đang thực hiện')
	and tp.MaCN = 'CN001'
group by vc.MaVacXin, vc.TenVacXin

-- Lấy sản phẩm của 1 chi nhánh
select sp.MaSP, 
	sp.TenSP, 
	lsp.TenLoaiSP, 
	sp.GiaBan, 
	sp.DonViTinh, 
	spcn.SoLuongTonKho
from SanPham sp, LoaiSP lsp, SPCuaTungCN spcn
where sp.MaLoaiSP = lsp.MaLoaiSP
	and sp.MaSP = spcn.MaSP
	and spcn.MaCN = 'CN001'

select top 1 sp.MaSP
from SanPham sp
order by sp.MaSP desc