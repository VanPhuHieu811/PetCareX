import sql from 'mssql';

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
                COUNT(CASE WHEN p.TrangThai = N'Đang thanh toán' THEN 1 END) AS DaThanhToan,
                COUNT(CASE WHEN p.TrangThai = N'Hoàn thành' THEN 1 END) AS HoanThanh,
                COUNT(CASE WHEN p.TrangThai = N'Hủy' THEN 1 END) AS DaHuy
            FROM PhieuDatDV p 
            WHERE CAST(p.NgayDatDV AS DATE) = @NgayLoc
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

export default { getCustomerInfo, getAppointmentDashboard, getAvailableDoctors };