create or alter procedure F_HoaDon_tinhTongTien
	@output varchar(30)
as
begin
	declare @sum decimal(30,0)
	select @sum = isnull(sum(cast(hd.tongtien as decimal(20, 0))), 0)
	from HoaDon hd
	
	set @output = cast(@sum as varchar(30))
end
go