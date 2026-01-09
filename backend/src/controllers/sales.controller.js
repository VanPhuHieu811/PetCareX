import salesService from '../services/sales.service.js';

const getInvoices = async (req, res) => {
    try {
        const pool = req.db; // Lấy kết nối từ middleware
        let { branchId, date, customerName } = req.query;

        if (!branchId) {
            return res.status(400).json({ success: false, message: 'Thiếu mã chi nhánh (branchId)' });
        }

        // Nếu không truyền ngày, mặc định là ngày hiện tại 08-01-2026
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

export default { getInvoices };