import sql from 'mssql';

const createFeedback = async (pool, { maPhieuDV, ngayDanhGia, diemDanhGia, thaiDoNhanVien, mucDoHaiLong, binhLuan, maKH }) => {
    try {
        const request = pool.request();
        
        // Gán tham số đầu vào
        request.input('maPhieuDV', sql.NVarChar, maPhieuDV);
        request.input('ngayDanhGia', sql.DateTime, ngayDanhGia);
        request.input('diemDanhGia', sql.Int, diemDanhGia);
        request.input('thaiDoNhanVien', sql.Int, thaiDoNhanVien);
        request.input('mucDoHaiLong', sql.NVarChar, mucDoHaiLong);
        request.input('binhLuan', sql.NVarChar, binhLuan);
        request.input('maKH', sql.NVarChar, maKH);

        const query = `
            INSERT INTO DanhGia (maPhieuDV, ngayDanhGia, diemDanhGia, thaiDoNhanVien, mucDoHaiLong, binhLuan, maKH)
            VALUES (@maPhieuDV, @ngayDanhGia, @diemDanhGia, @thaiDoNhanVien, @mucDoHaiLong, @binhLuan, @maKH)
        `;
        await request.query(query);
        return { message: "Ghi nhận đánh giá thành công" };
    } catch (error) {
        throw new Error("Lỗi tại Feedback Service: " + error.message);
    }
};

export default { createFeedback };