create or alter procedure sp_seller
    @MaKH varchar(10),
    @MaCN varchar(10),
    @MaNV varchar(10),
    @ItemsJson nvarchar(MAX),
    @PaymentMethod nvarchar(15)
as
begin
    set nocount on;
    begin try
        begin transaction;

        -- tao ma phieu dat dich vu
        declare @NewMaPDV varchar(10);
        declare @MaxMaPDV varchar(10);
        declare @MaxID int;

        select @MaxMaPDV = max(MaPhieuDV) from dbo.PhieuDatDV with (UPDLOCK, HOLDLOCK) where MaPhieuDV like 'PDV%';
        if @MaxMaPDV is null set @NewMaPDV = 'PDV000001';
        else
        begin
            set @MaxID = try_cast(substring(@MaxMaPDV, 4, len(@MaxMaPDV) - 3) as int);
            if @MaxID is null set @MaxID = 0;
            set @NewMaPDV = 'PDV' + right('000000' + cast(@MaxID + 1 as varchar(6)), 6);
        end

        -- neu khach hang ko co tai khoan, dat ten la khach vang lai
        declare @TenKhachHang nvarchar(50) = N'Khách vãng lai';
        if @MaKH is not null and @MaKH <> ''
        begin
            select @TenKhachHang = HoTen from NguoiDung where MaND = @MaKH;
        end
        else
        begin
             set @MaKH = null;
        end

        -- lay thong tin san pham ma khach hang mua
        create table #ParsedItems (
            MaSP varchar(10),
            SoLuong int
        );

        insert into #ParsedItems (MaSP, SoLuong)
        select MaSP, SoLuong
        from openjson(@ItemsJson) with (
            MaSP varchar(10) '$.id',
            SoLuong int '$.qty'
        );

        -- tinh tong tien
        declare @TongTien int = 0;
        select @TongTien = sum(p.SoLuong * sp.GiaBan)
        from #ParsedItems p
        join SanPham sp on p.MaSP = sp.MaSP;

        if @TongTien is null set @TongTien = 0;

        -- tao phieu dat dich vu
        insert into PhieuDatDV (MaPhieuDV, NgayDatDV, MaKH, TenKhachHang, MaCN, MaDV, HinhThucDat, TrangThai, LoaiDichVu, BacSiPhuTrach)
        values (@NewMaPDV, getdate(), @MaKH, @TenKhachHang, @MaCN, 'DV03', N'Tại quầy', N'Đã thanh toán', N'Mua hàng', null);

        -- tao phieu dat mua hang
        insert into DatMuaHang (MaPhieuDV, DiaChiNhanHang, TongTien)
        values (@NewMaPDV, null, @TongTien);

        -- tao danh sach san pham
        insert into DanhSachSP (MaPhieuDV, MaSP, MaCN, TenSP_SnapShot, DonGia_LucMua, SoLuongMua)
        select @NewMaPDV, p.MaSP, @MaCN, sp.TenSP, sp.GiaBan, p.SoLuong
        from #ParsedItems p
        join SanPham sp on p.MaSP = sp.MaSP;

        -- tao hoa don va ma hoa don moi
        declare @NewMaHD varchar(10);
        declare @MaxMaHD varchar(10);
        declare @MaxID_HD int;

        select @MaxMaHD = max(MaHoaDon) from dbo.HoaDon with (UPDLOCK, HOLDLOCK) where MaHoaDon like 'HD%';
        if @MaxMaHD is null set @NewMaHD = 'HD000001';
        else
        begin
            set @MaxID_HD = try_cast(substring(@MaxMaHD, 3, len(@MaxMaHD) - 2) as int);
            if @MaxID_HD is null set @MaxID_HD = 0;
            set @NewMaHD = 'HD' + right('000000' + cast(@MaxID_HD + 1 as varchar(6)), 6);
        end

        -- insert hoa don
        insert into HoaDon (MaHoaDon, MaNVLap, MaKH, MaCN, MaKhuyenMai, NgayLap, TongTien, HinhThucThanhToan)
        values (@NewMaHD, @MaNV, @MaKH, @MaCN, null, getdate(), @TongTien, @PaymentMethod);

        -- tao chi tiet hoa don
        insert into ChiTietHoaDon (MaHoaDon, MaPhieuDV, TongTienDV)
        values (@NewMaHD, @NewMaPDV, @TongTien);

        -- tra ve thong tin hoa don
        select * from HoaDon where MaHoaDon = @NewMaHD;

        commit transaction;
    end try
    begin catch
        if @@TRANCOUNT > 0 rollback transaction;
        declare @ErrorMessage nvarchar(4000) = error_message();
        raiserror(@ErrorMessage, 16, 1);
    end catch
end;