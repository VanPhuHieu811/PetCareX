export const getPackageRegistration = async (pool, petId) => {
    try {
        const result = await pool.request()
            .input('PetId', petId)
            .execute('sp_LayThongTinGoiTiemThuCung');

        // Nếu không tìm thấy gói đăng ký nào
        if (result.recordsets[0].length === 0) return null;

        const packageInfo = result.recordsets[0][0];
        const vaccineList = result.recordsets[1];

        return {
            ...packageInfo,
            danhSachMui: vaccineList
        };
    } catch (err) {
        throw new Error(`Lỗi tra cứu gói tiêm: ${err.message}`);
    }
};

export const getAllPackages = async (pool) => {
  try {
    // Truy vấn lấy danh sách các gói tiêm từ bảng GoiTiemPhong
    const query = `
      SELECT *
      FROM GoiTiemPhong 
      ORDER BY TenGoiTP ASC
    `;
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    throw new Error(`Lỗi khi lấy danh sách gói tiêm: ${err.message}`);
  }
};

export const registerPackage = async (pool, data) => {
  try {
    const { MaKH, MaGoiTP, MaPhieuDV } = data;
    
    const result = await pool.request()
      .input('MaKH', MaKH)
      .input('MaGoiTP', MaGoiTP)
      .input('MaPhieuDV', MaPhieuDV)
      .execute('sp_DangKyGoiTiem');

    return {
      success: true,
      maDK: result.recordset[0].MaDK,
      message: 'Đăng ký gói tiêm thành công'
    };
  } catch (err) {
    throw new Error(`Lỗi đăng ký gói: ${err.message}`);
  }
};

export const createVaccineSchedule = async (pool, maDK, maVaccine) => {
  try {
    const result = await pool.request()
      .input('MaDK', maDK)
      .input('MaVacXin', maVaccine)
      .execute('sp_ThemLichTiemVaccine');
    return result.recordset[0];
  } catch (err) {
    throw new Error(`Lỗi tạo lộ trình tiêm: ${err.message}`);
  }
};