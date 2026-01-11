import feedbackService from '../services/feedback.service.js';

const postFeedback = async (req, res) => {
    try {
        // Lấy pool từ middleware đã cài đặt (thường là req.pool hoặc req.db)
        const pool = req.pool || req.db; 

        // Lấy đầy đủ các input từ body của request
        const { 
            maPhieuDV, 
            ngayDanhGia, 
            diemDanhGia, 
            thaiDoNhanVien, 
            mucDoHaiLong, 
            binhLuan, 
            maKH 
        } = req.body;

        // Kiểm tra sơ bộ các trường bắt buộc (nếu cần)
        if (!maPhieuDV || !diemDanhGia) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu thông tin mã phiếu hoặc điểm đánh giá." 
            });
        }

        // Truyền pool và object chứa các input vào Service
        const result = await feedbackService.createFeedback(pool, { 
            maPhieuDV, 
            ngayDanhGia, 
            diemDanhGia, 
            thaiDoNhanVien, 
            mucDoHaiLong, 
            binhLuan, 
            maKH 
        });
        
        res.status(201).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export default { postFeedback };