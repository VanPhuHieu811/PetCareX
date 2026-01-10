import sql from 'mssql';

const getInvoiceList = async (pool, { branchId, date, customerName }) => {
    try {
        const request = pool.request();
        // Gán tham số đầu vào cho câu lệnh SQL
        request.input('MaCN', sql.NVarChar, branchId);
        request.input('Ngay', sql.Date, date);
        request.input('TenKH', sql.NVarChar, `%${customerName || ''}%`);

        // Truy vấn lấy danh sách hóa đơn, kết hợp bảng NguoiDung để lấy tên khách hàng
        const query = `
            SELECT 
                hd.MaHoaDon, 
                hd.NgayLap, 
                nd.HoTen AS TenKhachHang, 
                hd.TongTien,
                hd.HinhThucThanhToan
            FROM HoaDon hd
            LEFT JOIN KhachHang kh ON hd.MaKH = kh.MaKH
            LEFT JOIN NguoiDung nd ON kh.MaKH = nd.MaND
            WHERE hd.MaCN = @MaCN
                  AND CAST(hd.NgayLap AS DATE) = @Ngay
                  AND (nd.HoTen LIKE @TenKH OR @TenKH = '%%')
            ORDER BY hd.NgayLap DESC
        `;
        
        const result = await request.query(query);
        return result.recordset;
    } catch (error) {
        throw error;
    }
};

export default { getInvoiceList };