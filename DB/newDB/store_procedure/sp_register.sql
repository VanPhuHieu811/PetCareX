CREATE OR ALTER PROCEDURE sp_register
    @HoTen   NVARCHAR(50),
    @Email   NVARCHAR(255),
    @MatKhau VARCHAR(30),
    @CCCD    VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    IF @HoTen IS NULL OR LTRIM(RTRIM(@HoTen)) = N''
    BEGIN
        RAISERROR (N'Họ tên là bắt buộc.', 16, 1);
        RETURN;
    END

    IF @Email IS NULL OR LTRIM(RTRIM(@Email)) = N''
    BEGIN
        RAISERROR (N'Email là bắt buộc.', 16, 1);
        RETURN;
    END

    IF @MatKhau IS NULL OR LTRIM(RTRIM(@MatKhau)) = ''
    BEGIN
        RAISERROR (N'Mật khẩu là bắt buộc.', 16, 1);
        RETURN;
    END

    IF @CCCD IS NULL OR LTRIM(RTRIM(@CCCD)) = ''
    BEGIN
        RAISERROR (N'CCCD là bắt buộc.', 16, 1);
        RETURN;
    END

    IF @CCCD LIKE '%[^0-9]%'
    BEGIN
        RAISERROR (N'CCCD chỉ được chứa chữ số.', 16, 1);
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM dbo.NguoiDung WITH (READCOMMITTEDLOCK) WHERE Email = @Email)
    BEGIN
        RAISERROR (N'Email đã được sử dụng.', 16, 1);
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM dbo.NguoiDung WITH (READCOMMITTEDLOCK) WHERE CCCD = @CCCD)
    BEGIN
        RAISERROR (N'CCCD đã tồn tại.', 16, 1);
        RETURN;
    END

    DECLARE @NewMaND VARCHAR(10);
    DECLARE @MaxMaND VARCHAR(10);
    DECLARE @MaxID  INT;

    BEGIN TRY
        BEGIN TRANSACTION;

        SELECT @MaxMaND = MAX(MaND)
        FROM dbo.NguoiDung WITH (UPDLOCK, HOLDLOCK)
        WHERE MaND LIKE 'KH%';

        IF @MaxMaND IS NULL
        BEGIN
            SET @NewMaND = 'KH00001';
        END
        ELSE
        BEGIN
            SET @MaxID = TRY_CAST(SUBSTRING(@MaxMaND, 3, LEN(@MaxMaND) - 2) AS INT);

            IF @MaxID IS NULL
                SET @MaxID = 0;

            SET @NewMaND = 'KH' + RIGHT('00000' + CAST(@MaxID + 1 AS VARCHAR(5)), 5);
        END

        INSERT INTO dbo.NguoiDung (MaND, HoTen, Email, CCCD, LoaiND)
        VALUES (@NewMaND, @HoTen, @Email, @CCCD, N'Khách hàng');

        INSERT INTO dbo.TaiKhoan (MaND, MatKhau, TrangThai, VaiTro, NgayTao)
        VALUES (@NewMaND, @MatKhau, N'Hoạt động', N'Khách hàng', GETDATE());

        COMMIT TRANSACTION;

        SELECT 
            nd.MaND,
            nd.HoTen,
            nd.Email,
            nd.CCCD,
            nd.LoaiND,
            tk.VaiTro,
            tk.TrangThai,
            tk.NgayTao
        FROM dbo.NguoiDung nd
        JOIN dbo.TaiKhoan tk ON nd.MaND = tk.MaND
        WHERE nd.MaND = @NewMaND;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR (@ErrorMessage, 16, 1);
        RETURN;
    END CATCH
END;
GO
