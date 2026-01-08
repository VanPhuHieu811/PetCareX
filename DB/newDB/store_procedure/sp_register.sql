CREATE OR ALTER PROCEDURE sp_register
    @HoTen NVARCHAR(50),
    @Email NVARCHAR(255),
    @MatKhau VARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- check if email already exists
    IF EXISTS (SELECT 1 FROM NguoiDung WHERE Email = @Email)
    BEGIN
        RAISERROR(N'Email đã được sử dụng.', 16, 1);
        RETURN;
    END

    -- auto-generate MaND for new user (KHxxxxx)
    DECLARE @NewMaND VARCHAR(10);
    DECLARE @MaxMaND VARCHAR(10);
    DECLARE @MaxID INT;

    SELECT @MaxMaND = MAX(MaND) 
    FROM NguoiDung 
    WHERE MaND LIKE 'KH%';

    IF @MaxMaND IS NULL
    BEGIN
        SET @NewMaND = 'KH00001';
    END
    ELSE
    BEGIN
        SET @MaxID = CAST(SUBSTRING(@MaxMaND, 3, LEN(@MaxMaND) - 2) AS INT);
        SET @NewMaND = 'KH' + RIGHT('00000' + CAST(@MaxID + 1 AS VARCHAR(5)), 5);
    END

    -- insert thong tin vao 2 bang
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Insert bảng NguoiDung
        INSERT INTO NguoiDung (MaND, HoTen, Email, LoaiND)
        VALUES (@NewMaND, @HoTen, @Email, N'Khách hàng');

        -- Insert bảng TaiKhoan
        INSERT INTO TaiKhoan (MaND, MatKhau, TrangThai, VaiTro, NgayTao)
        VALUES (@NewMaND, @MatKhau, N'Hoạt động', N'Khách hàng', GETDATE());

        COMMIT TRANSACTION;

        SELECT 
            nd.MaND, 
            nd.HoTen, 
            nd.Email, 
            tk.VaiTro, 
            tk.TrangThai 
        FROM NguoiDung nd
        JOIN TaiKhoan tk ON nd.MaND = tk.MaND
        WHERE nd.MaND = @NewMaND;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO
