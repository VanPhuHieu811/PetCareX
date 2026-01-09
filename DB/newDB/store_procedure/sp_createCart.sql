create or alter procedure sp_createCart 
  @customerId nvarchar(10), 
  @nameCustomer nvarchar(255),
  @productId nvarchar(10),
  @branchId nvarchar(10),
  @quantity int
as
begin 
  begin try
    BEGIN TRANSACTION;

    -- tao ma phieu dat dich vu
    declare @NewMaPDV varchar(10);
    declare @MaxMaPDV varchar(10);
    declare @MaxID int;

    select @MaxMaPDV = MAX(MaPhieuDV)
    from dbo.PhieuDatDV WITH (UPDLOCK, HOLDLOCK)
    where MaPhieuDV like 'PDV%';

    IF @MaxMaPDV IS NULL
    BEGIN
        SET @NewMaPDV = 'PDV000001';
    END
    ELSE
    BEGIN
        SET @MaxID = TRY_CAST(SUBSTRING(@MaxMaPDV, 4, LEN(@MaxMaPDV) - 3) AS INT);
        
        IF @MaxID IS NULL SET @MaxID = 0;

        SET @NewMaPDV = 'PDV' + RIGHT('000000' + CAST(@MaxID + 1 AS VARCHAR(6)), 6);
    END

      -- lay ten san pham va don gia
    declare @tenSP nvarchar(50)
    declare @DonGia float
    
    select 
      @tenSP = TenSP, 
      @DonGia = GiaBan 
    from SanPham 
    where MaSP = @productId

    -- tao phieu dat dich vu moi
    insert into PhieuDatDV values
    (@NewMaPDV, GETDATE(), @customerId, @nameCustomer, NULL, @branchId, 'DV03', 'Online', N'Đang chờ', N'Mua hàng', NULL)
    
    -- Tinh tong tien
    declare @tongTien float
    set @tongTien = @DonGia * @quantity

    -- them vao dat mua hang (Phai insert cai nay truoc DanhSachSP vi FK fk_danhsachsp_phieumua)
    insert into DatMuaHang values
    (@NewMaPDV, NULL, @tongTien)

    -- them san pham vao danh sach
    insert into DanhSachSP values 
    (@NewMaPDV, @productId, @branchId, @tenSP, @DonGia, @quantity)

    COMMIT TRANSACTION;
  end try
  begin catch
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    select error_number() as ErrorNumber, error_message() as ErrorMessage
  end catch
end
go