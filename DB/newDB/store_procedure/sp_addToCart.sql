create or alter procedure sp_addToCart
    @cartId varchar(10),
    @productId varchar(10),
    @branchId varchar(10),
    @quantity int
as
begin
    set nocount on;
    begin try
        begin transaction;

        -- 1. Kiểm tra sản phẩm và lấy giá
        declare @DonGia float, @TenSP nvarchar(50);
        select @DonGia = GiaBan, @TenSP = TenSP 
        from dbo.SanPham 
        where MaSP = @productId;

        if @DonGia is null
        begin
            raiserror(N'Sản phẩm không tồn tại.', 16, 1);
            rollback transaction;
            return;
        end
        -- 2. Kiểm tra xem sản phẩm đã có trong giỏ hàng (DanhSachSP) chưa
        if exists (select 1 from dbo.DanhSachSP where MaPhieuDV = @cartId and MaSP = @productId)
        begin
            -- Update số lượng
            update dbo.DanhSachSP
            set SoLuongMua = SoLuongMua + @quantity
            where MaPhieuDV = @cartId and MaSP = @productId;
        end
        else
        begin
            -- Insert mới vào DanhSachSP
            insert into dbo.DanhSachSP (MaPhieuDV, MaSP, MaCN, TenSP_SnapShot, DonGia_LucMua, SoLuongMua)
            values (@cartId, @productId, @branchId, @TenSP, @DonGia, @quantity);
        end

        -- 3. Cập nhật tổng tiền trong DatMuaHang
        declare @TongTien float;
        select @TongTien = sum(SoLuongMua * DonGia_LucMua)
        from dbo.DanhSachSP
        where MaPhieuDV = @cartId;

        update dbo.DatMuaHang
        set TongTien = @TongTien
        where MaPhieuDV = @cartId;

        select @TenSP as TenSP; -- return product name for confirmation

        commit transaction;
    end try
    begin catch
        if @@TRANCOUNT > 0 rollback transaction;
        declare @ErrorMessage nvarchar(4000) = error_message();
        raiserror(@ErrorMessage, 16, 1);
    end catch
END;
