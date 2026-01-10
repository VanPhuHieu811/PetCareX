create or alter procedure sp_checkout
    @cartId varchar(10),
    @branchId varchar(10)
as
begin
    set nocount on;
    begin try
        begin transaction;

        declare @paymentMethod nvarchar(15) = N'Chuyển khoản';

        -- 1. Lấy thông tin cần thiết từ PhieuDatDV và DatMuaHang
        declare @TongTien int, @CustomerId varchar(10);
        
        -- Check trạng thái phiếu
        if exists (select 1 from dbo.PhieuDatDV where MaPhieuDV = @cartId and TrangThai <> N'Đang chờ')
        begin
             raiserror(N'Phiếu dịch vụ không ở trạng thái Đang chờ.', 16, 1);
        end

        select @CustomerId = MaKH 
        from dbo.PhieuDatDV 
        where MaPhieuDV = @cartId;

        select @TongTien = TongTien 
        from dbo.DatMuaHang 
        where MaPhieuDV = @cartId;

        if @TongTien is null set @TongTien = 0;

        -- 2. Sinh Mã Hóa Đơn (HDxxxxx)
        declare @NewMaHD varchar(10);
        declare @MaxMaHD varchar(10);
        declare @MaxID int;

        select @MaxMaHD = max(MaHoaDon) 
        from dbo.HoaDon with (updlock, holdlock) 
        where MaHoaDon like 'HD%';

        if @MaxMaHD is null
            set @NewMaHD = 'HD000001';
        else
        begin
            set @MaxID = try_cast(substring(@MaxMaHD, 3, len(@MaxMaHD) - 2) as int);
            if @MaxID is null set @MaxID = 0;
            set @NewMaHD = 'HD' + right('000000' + cast(@MaxID + 1 as varchar(6)), 6);
        end

        -- 3. Tạo Hóa Đơn
        insert into dbo.HoaDon (MaHoaDon, MaNVLap, MaKH, MaCN, MaKhuyenMai, NgayLap, TongTien, HinhThucThanhToan)
        values (@NewMaHD, null, @CustomerId, null, null, getdate(), @TongTien, @paymentMethod);

        -- 4. Tạo Chi Tiết Hóa Đơn
        insert into dbo.ChiTietHoaDon (MaHoaDon, MaPhieuDV, TongTienDV)
        values (@NewMaHD, @cartId, @TongTien);

        -- 5. Cập nhật trạng thái PhieuDatDV
        update dbo.PhieuDatDV
        set TrangThai = N'Đã thanh toán'
        where MaPhieuDV = @cartId;

        -- -- 6. Trừ Tồn Kho (SPCuaTungCN)
        -- update Kho
        -- set Kho.SoLuongTonKho = Kho.SoLuongTonKho - Gio.SoLuongMua
        -- from dbo.SPCuaTungCN Kho
        -- inner join dbo.DanhSachSP Gio on Kho.MaSP = Gio.MaSP and Kho.MaCN = Gio.MaCN
        -- where Gio.MaPhieuDV = @cartId;

        -- -- Kiểm tra nếu tồn kho bị âm -> Rollback
        -- if exists (select 1 from dbo.SPCuaTungCN where SoLuongTonKho < 0)
        -- begin
        --      raiserror(N'Số lượng tồn kho không đủ để thanh toán.', 16, 1);
        --      rollback transaction;
        --      return;
        -- end

        -- Return newly created Invoice
        select * from dbo.HoaDon where MaHoaDon = @NewMaHD;

        commit transaction;
    end try
    begin catch
        if @@trancount > 0 rollback transaction;
        declare @ErrorMessage nvarchar(4000) = error_message();
        raiserror(@ErrorMessage, 16, 1);
    end catch
end;
