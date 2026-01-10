import salesService from '../services/sales.service.js';

const getInvoices = async (req, res) => {
    try {
        const pool = req.db;
        let { branchId, date, customerName } = req.query;

        if (!branchId) {
            return res.status(400).json({ success: false, message: 'Thiếu mã chi nhánh (branchId)' });
        }

        if (!date) {
            date = new Date(new Date().getTime() + 7 * 60 * 60 * 1000).toISOString().split('T')[0];
        }

        const data = await salesService.getInvoiceList(pool, { branchId, date, customerName });

        res.status(200).json({
            success: true,
            appliedDate: date,
            total: data.length,
            invoices: data
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getSalesStats = async (req, res) => {
    try {
        const { branchId, date } = req.query;

        const stats = await salesService.getDailySalesStatistics(req.db, branchId, date);

        const dateDisplay = date ? new Date(date) : new Date();

        res.status(200).json({
            success: true,
            date: dateDisplay.toLocaleDateString('vi-VN'), 
            filter: {
                branch: branchId ? `Chi nhánh ${branchId}` : 'Toàn hệ thống',
                date: date || 'Hôm nay (Mặc định)'
            },
            data: {
                revenue: stats.DoanhThuNgay,
                invoiceCount: stats.SoLuongHoaDon
            }
        });

    } catch (error) {
        res.status(500).json({ 
            error: 'Lấy thống kê thất bại', 
            details: error.message 
        });
    }
};

export default { getInvoices, getSalesStats };