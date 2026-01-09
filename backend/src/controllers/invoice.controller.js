import invoiceService from '../services/invoices.service.js';

const getFullDetails = async (req, res) => {
    try {
        // Lấy pool từ middleware (thông thường là req.pool hoặc req.db)
        // Bạn hãy kiểm tra file sqlserver.config.js xem bạn đặt tên là gì nhé
        const pool = req.pool || req.db; 
        const { invoiceId } = req.body;

        if (!invoiceId) {
            return res.status(400).json({ success: false, message: "Thiếu invoiceId" });
        }

        // Truyền pool vào service
        const data = await invoiceService.getDetailsFromDB(pool, invoiceId);
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getGroupedDetails = async (req, res) => {
    try {
        const pool = req.pool || req.db;
        const { invoiceId } = req.body;

        const rawData = await invoiceService.getDetailsFromDB(pool, invoiceId);
        
        const grouped = rawData.reduce((acc, item) => {
            const key = item.TenDV;
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});

        res.status(200).json({ success: true, data: grouped });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getInvoiceSummary = async (req, res) => {
    try {
        const pool = req.pool || req.db;
        const { invoiceId } = req.body;

        const data = await invoiceService.getDetailsFromDB(pool, invoiceId);
        
        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn" });
        }

        const summary = {
            MaHoaDon: data[0].MaHoaDon,
            TongTien: data.reduce((sum, item) => sum + (item.ThanhTien || 0), 0),
            NhanVien: data[0].MaNVLap,
            NgayLap: data[0].NgayLap
        };

        res.status(200).json({ success: true, data: summary });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export default { getFullDetails, getGroupedDetails, getInvoiceSummary };