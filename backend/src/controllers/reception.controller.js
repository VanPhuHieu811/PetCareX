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
        const data = await receptionService.getCustomerInfo(pool, identifier);

        if (data.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin khách hàng' });
        }

        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error('Error in getCustomerDetails:', error);
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
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
export default { getCustomerDetails, getAppointmentBoard, getFreeDoctors };