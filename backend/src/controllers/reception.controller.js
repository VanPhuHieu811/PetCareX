import receptionService from '../services/reception.service.js';

const getCustomerDetails = async (req, res) => {
    try {
        const { identifier } = req.query;

        // Lấy connection pool từ middleware (thường là req.db hoặc req.pool)
        // Bạn hãy kiểm tra trong file sqlserver.config.js xem biến này tên là gì
        const pool = req.db; 

        if (!identifier) {
            return res.status(400).json({ message: 'Vui lòng cung cấp SĐT hoặc CCCD' });
        }

        // Truyền pool vào service
        const records = await receptionService.getCustomerInfo(pool, identifier);

        if (!records || records.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin khách hàng' });
        }

        res.status(200).json({
            success: true,
            data: records
        });
    } catch (error) {
        console.error('Error in getCustomerDetails:', error);
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
};

const getCustomerStatistics = async (req, res) => {
    try {
        const pool = req.db;
        const stats = await receptionService.getCustomerStats(pool);
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy thống kê', error: error.message });
    }
};

// Xử lý Dashboard lịch hẹn (Mặc định hôm nay)
const getAppointmentBoard = async (req, res) => {
    try {
        let { date, status, search } = req.query;

        // Tự động lấy ngày hôm nay nếu trống (Múi giờ VN)
        if (!date) {
            date = new Date(new Date().getTime() + 7 * 60 * 60 * 1000).toISOString().split('T')[0];
        }

        const result = await receptionService.getAppointmentDashboard(req.db, {
            date,
            status: status || 'Tất cả',
            search: search || ''
        });

        res.status(200).json({ success: true, date, ...result });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi tải dashboard', error: error.message });
    }
};

// Lấy danh sách bác sĩ rãnh
const getFreeDoctors = async (req, res) => {
    try {
        const { branchId, date, time } = req.query;

        if (!branchId || !date || !time) {
            return res.status(400).json({ 
                message: 'Vui lòng cung cấp đầy đủ: chi nhánh, ngày và giờ.' 
            });
        }

        const doctors = await receptionService.getAvailableDoctors(req.db, {
            branchId,
            date,
            time
        });

        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy danh sách bác sĩ', error: error.message });
    }
};
// Thêm vào file reception.controller.js
const addCustomer = async (req, res) => {
    try {
        const pool = req.db;
        const customerData = req.body;

        if (!customerData.name || !customerData.sdt) {
            return res.status(400).json({ message: 'Tên và Số điện thoại là bắt buộc' });
        }

        const newCustomer = await receptionService.createCustomer(pool, customerData);
        res.status(201).json({ success: true, data: newCustomer });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm khách hàng', error: error.message });
    }
};
export default { getCustomerDetails, getAppointmentBoard, getFreeDoctors , getCustomerStatistics, addCustomer};