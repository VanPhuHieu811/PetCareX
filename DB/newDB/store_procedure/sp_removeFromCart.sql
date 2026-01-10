create or alter procedure sp_removeFromCart
    @cartId varchar(10),
    @productId varchar(10)
as
begin
    set nocount on;
    begin try
        begin transaction;

        -- 0. Lay TenSP truoc khi xoa
        declare @TenSP nvarchar(50);
        select @TenSP = TenSP_SnapShot 
        from dbo.DanhSachSP 
        where MaPhieuDV = @cartId and MaSP = @productId;

        -- xoa san pham trong DanhSachSP
        delete from dbo.DanhSachSP
        where MaPhieuDV = @cartId and MaSP = @productId;

        -- Kiem tra xem gio hang con san pham nao khong
        declare @ItemCount int;
        declare @DeletedCartId varchar(10) = NULL;

        select @ItemCount = count(*) from dbo.DanhSachSP where MaPhieuDV = @cartId;

        if @ItemCount = 0
        begin
            -- NNeu rong -> XXoa luon phieu va thong tin dat mua
            delete from dbo.DatMuaHang where MaPhieuDV = @cartId;
            delete from dbo.PhieuDatDV where MaPhieuDV = @cartId;
            set @DeletedCartId = @cartId;
        end
        else
        begin
            -- Neu con -> Cap nhat lai tong tien
            declare @TongTien float;
            select @TongTien = sum(SoLuongMua * DonGia_LucMua)
            from dbo.DanhSachSP
            where MaPhieuDV = @cartId;

            update dbo.DatMuaHang
            set TongTien = @TongTien
            where MaPhieuDV = @cartId;
        end

        -- Return info
        SELECT @TenSP as ProductName, @DeletedCartId as DeletedCartId;

        commit transaction;
    end try
    begin catch
        if @@trancount > 0 rollback transaction;
        declare @ErrorMessage nvarchar(4000) = error_message();
        raiserror(@ErrorMessage, 16, 1);
    end catch
end;