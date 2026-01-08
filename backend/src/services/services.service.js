export const getDoctorQueue = async (pool, doctorId) => {
  try {
    // Sử dụng hàm SQL bạn đã viết để lấy danh sách khám/tiêm trong ngày
    const query = `
      SELECT * FROM dbo.fn_LayDanhSachKhamTrongNgay(@MaBS) 
      ORDER BY GioDat ASC
    `;

    const result = await pool.request()
      .input('MaBS', doctorId) // Truyền MaBS từ tham số API vào SQL
      .query(query);

    return result.recordset;
  } catch (err) {
    throw new Error(`Lỗi truy vấn hàng đợi: ${err.message}`);
  }
};

export const searchMedicines = async (pool, branchId) => {
  try {
    const result = await pool.request()
      .input('MaCN', branchId)
      .execute('sp_LayDanhSachThuocTrongChiNhanh');
      
    return result.recordset; // Trả về danh sách thuốc giống mockMedicines
  } catch (err) {
    throw new Error(`Lỗi tra cứu thuốc: ${err.message}`);
  }
};

export const createPrescription = async (pool, data) => {
  const { MaPhieuDV, MaCN, NgayTaiKham, medicines } = data;

  try {
    // Lặp qua từng loại thuốc trong đơn để lưu vào DB
    for (const item of medicines) {
      await pool.request()
        .input('MaPhieuDV', MaPhieuDV)
        .input('MaSP', item.MaSP)
        .input('MaCN', MaCN)
        .input('SoLuongMua', parseInt(item.soLuong))
        .input('TanSuat', item.tanSuat)
        .input('LieuDung', item.lieuDung)
        .input('NgayTaiKham', NgayTaiKham)
        .execute('sp_TaoDonThuoc'); // Gọi SP có logic Trừ kho & Snapshot
    }
    return { success: true };
  } catch (err) {
    throw new Error(`Lỗi khi lưu đơn thuốc: ${err.message}`);
  }
};

export const updateRevisitDate = async (pool, maPhieuDV, ngayTaiKham) => {
  try {
    await pool.request()
      .input('MaPhieuDV', maPhieuDV)
      .input('NgayTaiKham', ngayTaiKham)
      .execute('sp_CapNhatNgayTaiKham');
    return { success: true, message: 'Cập nhật ngày tái khám thành công' };
  } catch (err) {
    throw new Error(`Lỗi Service: ${err.message}`);
  }
};

