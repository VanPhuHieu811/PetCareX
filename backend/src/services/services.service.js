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

export const getVaccinesInStock = async (pool, branchId) => {
  try {
    const result = await pool.request()
      .input('MaCN', branchId)
      .execute('sp_LayDanhSachVacxinTrongChiNhanh');
      
    return result.recordset;
  } catch (err) {
    throw new Error(`Lỗi lấy danh sách vắc-xin: ${err.message}`);
  }
};

export const createExamAppointment = async (pool, data) => {
  try {
    const result = await pool.request()
      .input('MaKH', data.maKH)
      .input('MaCN', data.maCN)
      .input('MaDV', data.maDV)
      .input('HinhThucDat', data.hinhThucDat)
      .input('BacSiPhuTrach', data.bacSiPhuTrach)
      .input('MaTC', data.maTC)
      .input('NgayKham', data.ngayKham) // Định dạng ISO: "2026-01-10T09:30:00"
      .execute('sp_TaoLichHenKhamBenh');
      
    return result.recordset[0];
  } catch (err) {
    throw new Error(`Lỗi đặt lịch khám: ${err.message}`);
  }
};

export const createVaccineAppointment = async (pool, data) => {
    const result = await pool.request()
        .input('MaKH', data.maKH)
        .input('MaCN', data.maCN)
        .input('MaDV', data.maDV)
        .input('HinhThucDat', data.hinhThucDat)
        .input('BacSiPhuTrach', data.bacSiPhuTrach)
        .input('MaTC', data.maTC)
        .input('NgayTiem', data.ngayTiem)
        .input('MaDK', data.maDK || null)
        .execute('sp_TaoLichHenTiemPhong');
    return result.recordset[0];
};

// src/services/medical.service.js
export const getServiceDetail = async (pool, maPhieuDV) => {
  try {
    const result = await pool.request()
      .input('MaPhieuDV', maPhieuDV)
      .execute('sp_LayChiTietDichVu');

    if (result.recordsets[0].length === 0) return null;

    const generalInfo = result.recordsets[0][0];
    const detailInfo = result.recordsets[1][0] || {};
    const subList = result.recordsets[2] || []; 

    return {
      ...generalInfo,
      details: detailInfo,
      items: subList
    };
  } catch (err) {
    throw new Error(`Lỗi lấy chi tiết dịch vụ: ${err.message}`);
  }
};

export const cancelAppointment = async (pool, maPhieuDV) => {
  try {
    const result = await pool.request()
      .input('MaPhieuDV', maPhieuDV)
      .execute('sp_HuyLichHenDichVu');
      
    return { success: true, message: result.recordset[0].Message };
  } catch (err) {
    throw new Error(`Lỗi khi hủy lịch: ${err.message}`);
  }
};
