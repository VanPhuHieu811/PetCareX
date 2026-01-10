import sql from 'mssql';

export const getAllStaff = async (pool, page, limit, offset, branchId = null) => {
  try {
    const request = pool.request();
    
    let query = `
      SELECT 
        nv.MaNV, 
        nd.HoTen, 
        nd.Email, 
        nd.SDT, 
        nv.TenChucVu,  
        nv.NgayVaoLam, 
        nv.TrangThai, 
        cn.TenCN
      FROM NhanVien nv
      JOIN NguoiDung nd ON nv.MaNV = nd.MaND
      LEFT JOIN ChiNhanh cn ON nv.MaCN = cn.MaCN
      WHERE 1=1
    `;

    if (branchId) {
      query += ` AND nv.MaCN = @BranchId`;
      request.input('BranchId', branchId);
    }

    query += `
      ORDER BY nv.MaNV
      OFFSET @Offset ROWS
      FETCH NEXT @Limit ROWS ONLY
    `;

    request.input('Offset', parseInt(offset));
    request.input('Limit', parseInt(limit));

    const result = await request.query(query);

    const countRequest = pool.request();
    let countQuery = `
      SELECT count(*) as total
      FROM NhanVien nv
      WHERE 1=1
    `;

    if (branchId) {
      countQuery += ` AND nv.MaCN = @BranchId`;
      countRequest.input('BranchId', branchId);
    }

    const countResult = await countRequest.query(countQuery);
    const total = countResult.recordset[0]?.total ?? 0;

    return {
      data: result.recordset,
      page: parseInt(page),
      limit: parseInt(limit),
      total: total
    };
  } catch (err) {
    throw new Error(`Database query failed: ${err.message}`);
  }
};

export const getCurrentStaff = async (pool, staffId) => {
  try {
    const request = pool.request();
    
    const query = `
      SELECT 
        tk.MaND, 
        nd.HoTen, 
        nd.Email, 
        nd.NgaySinh, 
        nd.GioiTinh, 
        nd.SDT, 
        nd.CCCD, 
        tk.NgayTao, 
        tk.TrangThai AS TrangThaiTaiKhoan, 
        tk.VaiTro,
        nv.TenChucVu,  
        nv.NgayVaoLam, 
        nv.LuongCoBan, 
        nv.TrangThai AS TrangThaiLamViec,
        cn.TenCN,
        cn.MaCN
      FROM TaiKhoan tk
      JOIN NguoiDung nd ON tk.MaND = nd.MaND
      JOIN NhanVien nv ON nv.MaNV = nd.MaND
      LEFT JOIN ChiNhanh cn ON nv.MaCN = cn.MaCN
      WHERE tk.MaND = @MaND
    `;
    request.input('MaND', staffId);

    const result = await request.query(query);
    return result.recordset[0];
  } catch (err) {
    throw new Error(`Database query failed: ${err.message}`);
  }
};

export const updateCurrentStaff = async (pool, staffId, updateData) => {
  try {
    const request = pool.request();

    const allowedUserFields = ['HoTen', 'NgaySinh', 'GioiTinh', 'SDT', 'CCCD'];
    let userUpdateFields = [];

    allowedUserFields.forEach(field => {
      if (updateData[field] !== undefined && updateData[field] !== null) {
        if (field === 'NgaySinh' || field === 'GioiTinh') {
             request.input(field, updateData[field]);
        } else {
             request.input(field, updateData[field]);
        }
        userUpdateFields.push(`${field} = @${field}`);
      }
    });

    if (userUpdateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    const userQuery = `
      UPDATE NguoiDung
      SET ${userUpdateFields.join(', ')}
      WHERE MaND = @MaND
    `;
    
    request.input('MaND', staffId); 
    await request.query(userQuery);

    return await getCurrentStaff(pool, staffId);
  } catch (err) {
    if (err.message.includes('UQ_NguoiDung_CCCD')) {
        throw new Error('CCCD đã tồn tại trong hệ thống.');
    }
    throw new Error(`Database update failed: ${err.message}`);
  }
};

export default {
    getAllStaff,
    getCurrentStaff,
    updateCurrentStaff
};