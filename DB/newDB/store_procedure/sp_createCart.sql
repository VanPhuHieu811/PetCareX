create procedure sp_createCart 
  @customerId nvarchar(10), 
  @nameCustomer nvarchar(255),
  @productId nvarchar(10),
  @branchId nvarchar(10)
as
begin 
  begin try
    -- Procedure logic to create a cart for the customer with the specified product
    -- tao phieu dat dich vu
    insert into PhieuDatDV values
    ('PDV00000', GETDATE(), @customerId, @nameCustomer, NULL, @branchId, @productId, 'Online', N'Đang chờ', N'Mua hàng', NULL)

    -- them vao dat mua hang
    insert into DatMuaHang values
    ('PDV00000', NULL, 0)


  end try
  begin catch
    select error_number() as ErrorNumber, error_message() as ErrorMessage
  end catch
end