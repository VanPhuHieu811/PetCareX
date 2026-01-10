import sql from 'mssql';

// 1. Lấy mã ND lớn nhất hiện tại của loại Khách hàng
const createCustomer = async (pool, customerData) => {
    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();
        const request = new sql.Request(transaction);

        // 1. Lấy mã ND lớn nhất hiện tại
        const lastIdResult = await request.query(`
            SELECT TOP 1 MaND 
            FROM NguoiDung 
            WHERE LoaiND = N'Khách hàng' AND MaND LIKE 'KH%'
            ORDER BY MaND DESC
        `);

        let nextId = 'KH001';
        if (lastIdResult.recordset.length > 0) {
            const lastId = lastIdResult.recordset[0].MaND;
            const currentNumber = parseInt(lastId.replace('KH', ''), 10);
            const nextNumber = currentNumber + 1;
            nextId = 'KH' + nextNumber.toString().padStart(3, '0');
        }
        
        // 2. Thêm vào bảng NguoiDung (Bổ sung NgaySinh, GioiTinh)
        await request
            .input('MaND', sql.NVarChar, nextId)
            .input('HoTen', sql.NVarChar, customerData.name)
            .input('Email', sql.NVarChar, customerData.email)
            .input('NgaySinh', sql.Date, customerData.birthDate) // Trùng với state frontend
            .input('GioiTinh', sql.NVarChar(10), customerData.gender)
            .input('SDT', sql.NVarChar, customerData.sdt)
            .input('CCCD', sql.NVarChar, customerData.cccd || null)
            .input('LoaiND', sql.NVarChar, 'Khách hàng')
            .query(`
                INSERT INTO NguoiDung (MaND, HoTen, Email, NgaySinh, GioiTinh, SDT, CCCD, LoaiND)
                VALUES (@MaND, @HoTen, @Email, @NgaySinh, @GioiTinh, @SDT, @CCCD, @LoaiND)
            `);

        // 3. Thêm vào bảng KhachHang
        await request.query(`
            INSERT INTO KhachHang (MaKH ,DiemLoyalty, MaLoaiTV)
            VALUES (@MaND,0, 'LTV01')
        `);

        await transaction.commit();
        return { maND: nextId, ...customerData }; // SỬA LỖI: Trả về nextId
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const getCustomerInfo = async (pool, identifier) => {
    try {
        // Tạo request từ pool đã được kết nối
        const request = pool.request();
        
        request.input('identifier', sql.NVarChar(50), identifier);

        const query = `SELECT * FROM dbo.FN_GetCustomerInfo(@identifier)`;
        
        const result = await request.query(query);
        return result.recordset;
    } catch (error) {
        throw error;
    }
};

const getCustomerStats = async (pool) => {
    const request = pool.request();
    const query = `
        select 
            count (case when kh.MaLoaiTV='LTV01' then 1 end ) as CoBan,
            count (case when kh.MaLoaiTV='LTV02' then 1 end ) as ThanThiet,
            count (case when kh.MaLoaiTV='LTV03' then 1  end ) as VIP
        from khachhang kh
    `;
    const result = await request.query(query);
    return result.recordset[0];
};

// 2. Lấy danh sách lịch hẹn và thống kê
const getAppointmentDashboard = async (pool, { date, status, search }) => {
    const request = pool.request();
    request.input('NgayLoc', sql.Date, date);
    request.input('TrangThai', sql.NVarChar, status);
    request.input('Search', sql.NVarChar, search);

    const [stats, list] = await Promise.all([
        request.query(`
            SELECT 
                COUNT(CASE WHEN p.TrangThai = N'Đang chờ' THEN 1 END) AS DangCho,
                COUNT(CASE WHEN p.TrangThai = N'Đã thanh toán' THEN 1 END) AS DaThanhToan,
                COUNT(CASE WHEN p.TrangThai = N'Hoàn thành' THEN 1 END) AS HoanThanh,
                COUNT(CASE WHEN p.TrangThai = N'Hủy' THEN 1 END) AS DaHuy
            FROM PhieuDatDV p 
            JOIN DichVu d on d.madv=p.madv
            WHERE CAST(p.NgayDatDV AS DATE) = @NgayLoc and d.tendv!=N'Mua hàng'
        `),
        request.query(`
                SELECT p.MaPhieuDV, p.NgayDatDV, p.TenThuCung, dv.TenDV, 
                        ndKH.HoTen AS TenKH, ndKH.sdt AS SdtKH, 
                        ndBS.HoTen AS TenBS, p.TrangThai
                FROM PhieuDatDV p
                JOIN NguoiDung ndKH ON p.MaKH = ndKH.MaND
                LEFT JOIN NhanVien bs ON p.BacSiPhuTrach = bs.MaNV
                LEFT JOIN NguoiDung ndBS ON bs.MaNV = ndBS.MaND
                JOIN DichVu dv ON p.MaDV = dv.MaDV
                WHERE CAST(p.NgayDatDV AS DATE) = @NgayLoc
                    AND dv.TenDV !=N'Mua hàng'
                    AND (@TrangThai = N'Tất cả' OR p.TrangThai = @TrangThai)
                    AND (ndKH.HoTen LIKE '%' + @Search + '%' OR p.TenThuCung LIKE '%' + @Search + '%')
                ORDER BY p.NgayDatDV ASC
        `)
    ]);

    return {
        stats: stats.recordset[0],
        appointments: list.recordset
    };
};

//3. Lấy danh sách các bác sĩ rãnh ở chi nhánh
const getAvailableDoctors=async(pool,{ branchID, date, time }) => {
   try{
    const request=pool.request();
    request.input('MaCN',sql.NVarChar(50),branchID);
    request.input('NgayDatDV',sql.DateTime,date);
    request.input('ThoiGian',sql.NVarChar(50),time);

    const query=`select * from dbo.FN_GetAvailableDoctors(@MaCN,@NgayDatDV,@ThoiGian)`;
    const result=await request.query(query);
    return result.recordset;}
    catch(error){
        throw error;
    }
}

export default { getCustomerInfo, getAppointmentDashboard, getAvailableDoctors, getCustomerStats , createCustomer};