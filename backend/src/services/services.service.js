export const getDoctorDashboard = async (pool, doctorId) => {
  try {
    const result = await pool.request()
      .input('MaBS', doctorId)
      .execute('sp_LayDashboardBacSi');

    return {
      stats: result.recordsets[0][0], // Lấy dòng đầu tiên của tập kết quả 1
      queue: result.recordsets[1]     // Lấy toàn bộ tập kết quả 2
    };
  } catch (err) {
    throw new Error(`Lỗi lấy dữ liệu Dashboard: ${err.message}`);
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

// src/services/medical.service.js
export const updateExamDiagnosis = async (pool, data) => {
  try {
    const { maPhieuDV, trieuChung, chuanDoan } = data;
    
    await pool.request()
      .input('MaPhieuDV', maPhieuDV)
      .input('MoTaTrieuChung', trieuChung)
      .input('MoTaChuanDoan', chuanDoan)
      .execute('sp_CapNhatChuanDoanKham');

    return { success: true, message: 'Cập nhật chẩn đoán thành công' };
  } catch (err) {
    throw new Error(`Lỗi cập nhật khám bệnh: ${err.message}`);
  }
};

