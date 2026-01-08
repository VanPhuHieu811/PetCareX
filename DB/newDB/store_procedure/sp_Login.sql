create procedure sp_login 
  @email nvarchar(255), 
  @password nvarchar(30)
as
begin
  begin try
    select nd.MaND, nd.HoTen, nd.Email, tk.VaiTro
    from NguoiDung nd
    join TaiKhoan tk on nd.MaND = tk.MaND
    where nd.Email = @email and tk.MatKhau = @password
  end try
  begin catch
    select error_number() as ErrorNumber, error_message() as ErrorMessage
  end catch
end