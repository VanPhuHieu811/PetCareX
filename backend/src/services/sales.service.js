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


export const getDailySalesStatistics = async (pool, branchId, targetDate) => {
    try {
        const query = `
            SELECT 
                COALESCE(SUM(hd.TongTien), 0) AS DoanhThuNgay,
                COUNT(hd.MaHoaDon) AS SoLuongHoaDon
            FROM HoaDon hd
            WHERE 
                -- 1. Lọc theo chi nhánh (Nếu null thì lấy hết)
                (@MaCN IS NULL OR hd.MaCN = @MaCN)
                
                -- 2. Lọc theo ngày (Nếu targetDate null thì lấy hôm nay)
                AND CAST(hd.NgayLap AS DATE) = COALESCE(@Ngay, CAST(GETDATE() AS DATE))
        `;

        const result = await pool.request()
            .input('MaCN', sql.VarChar, branchId || null)
            // Truyền ngày vào (định dạng YYYY-MM-DD hoặc null)
            .input('Ngay', sql.Date, targetDate || null)
            .query(query);

        return result.recordset[0];
    } catch (error) {
        throw new Error(`Lỗi lấy thống kê doanh thu: ${error.message}`);
    }
};


export const createPOSOrder = async (pool, { branchId, staffId, customerId, items, paymentMethod }) => {
    try {
        const itemsJson = JSON.stringify(items);

        const result = await pool.request()
            .input('MaCN', sql.VarChar, branchId)
            .input('MaNV', sql.VarChar, staffId)
            .input('MaKH', sql.VarChar, customerId || null)
            .input('ItemsJson', sql.NVarChar, itemsJson)
            .input('PaymentMethod', sql.NVarChar, paymentMethod === 'card' ? 'Chuyển khoản' : 'Tiền mặt')
            .execute('sp_seller');

        return result.recordset[0];
    } catch (error) {
        throw new Error(`Lỗi tạo đơn hàng: ${error.message}`);
    }
};

export default { getInvoiceList, getDailySalesStatistics, createPOSOrder };