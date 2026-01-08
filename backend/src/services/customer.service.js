export const getAllCustomers = async (pool, page, limit, offset) => {
  try {
    const request = pool.request();
    const query = `
      select *
      from KhachHang kh
      join NguoiDung nd on kh.MaKH = nd.MaND
      order by kh.MaKH
      offset @Offset rows
      fetch next @Limit rows only
    `;
    request.input('Offset', offset);
    request.input('Limit', limit);

    const result = await request.query(query);

    // Get total number of customers for pagination
    const countRequest = pool.request();
    const countQuery = `
      select count(*) as total
      from KhachHang
    `;
    const countResult = await countRequest.query(countQuery);
    const total = countResult.recordset[0]?.total ?? 0;

    return {
      data: result.recordset,
      page: page,
      limit: limit,
      total: total
    }
  }
  catch (err) {
    throw new Error(`Database query failed: ${err.message}`);
  }
}

export const getCurrentCustomer = async (pool, customerId) => {
  try {
    const request = pool.request();
    const query = `
    select tk.MaND, nd.HoTen, nd.Email, nd.NgaySinh, nd.GioiTinh, nd.SDT, nd.CCCD, nd.LoaiND, tk.NgayTao, tk.TrangThai
    from TaiKhoan tk
    join NguoiDung nd on tk.MaND = nd.MaND
    where tk.MaND = @MaND
    `;
    request.input('MaND', customerId);

    const result = await request.query(query);
    return result.recordset[0];
  }
  catch (err) {
    throw new Error(`Database query failed: ${err.message}`);
  }
}

export const updateCurrentCustomer = async (pool, customerId, updateData) => {
  try {
    const request = pool.request();
    
    const allowedFields = ['HoTen', 'NgaySinh', 'GioiTinh', 'SDT', 'CCCD'];
    let updateFields = [];
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined && updateData[field] !== null) {
        request.input(field, updateData[field]);
        updateFields.push(`${field} = @${field}`);
      }
    });

    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }

    const query = `
      UPDATE NguoiDung
      SET ${updateFields.join(', ')}
      WHERE MaND = @MaND
    `;
    request.input('MaND', customerId);

    await request.query(query);

    return await getCurrentCustomer(pool, customerId);
  }
  catch (err) {
    throw new Error(`Database update failed: ${err.message}`);
  }
}

export const getCustomerReceipts = async (pool, customerId) => {
  try {
    const request = pool.request();
    const query = `
      select *
      from HoaDon hd
      where hd.MaKH = @MaKH
    `
    request.input('MaKH', customerId);

    const result = await request.query(query);
    return result.recordset;
  }
  catch (err) {
    throw new Error(`Database query failed: ${err.message}`);
  }
}

export const getReceiptDetails = async (pool, receiptId, customerId) => {
  try {
    // Header thông tin hóa đơn
    const reqHeader = pool.request();
    reqHeader.input('MaHoaDon', receiptId);
    if (customerId) reqHeader.input('MaKH', customerId);

    const headerSql = `
      SELECT 
        hd.MaHoaDon AS MaHD,
        hd.MaNVLap,
        ndNV.HoTen AS TenNVLap,
        hd.MaKH,
        ndKH.HoTen AS TenKH,
        hd.NgayLap AS NgayLapDon,
        hd.MaKhuyenMai,
        hd.TongTien,
        hd.HinhThucThanhToan,
        cn.TenCN
      FROM HoaDon hd
      JOIN NhanVien nv       ON nv.MaNV = hd.MaNVLap
      JOIN NguoiDung ndNV    ON ndNV.MaND = nv.MaNV
      JOIN NguoiDung ndKH    ON ndKH.MaND = hd.MaKH
      JOIN ChiNhanh cn       ON cn.MaCN = hd.MaCN
      WHERE hd.MaHoaDon = @MaHoaDon
      ${customerId ? 'AND hd.MaKH = @MaKH' : ''}
    `;
    const headerRs = await reqHeader.query(headerSql);
    if (!headerRs.recordset?.length) throw new Error('Receipt not found');

    const reqServices = pool.request();
    reqServices.input('MaHoaDon', receiptId);
    const servicesSql = `
      SELECT 
        cthd.MaPhieuDV,
        pd.LoaiDichVu,
        pd.TrangThai,
        pd.NgayDatDV,
        pd.MaCN,
        pd.TenKhachHang,
        pd.TenThuCung,
        ndBS.HoTen AS TenBacSi
      FROM ChiTietHoaDon cthd
      JOIN PhieuDatDV pd           ON pd.MaPhieuDV = cthd.MaPhieuDV
      LEFT JOIN NhanVien bs        ON bs.MaNV = pd.BacSiPhuTrach
      LEFT JOIN NguoiDung ndBS     ON ndBS.MaND = bs.MaNV
      WHERE cthd.MaHoaDon = @MaHoaDon
      ORDER BY cthd.MaPhieuDV
    `;
    const servicesRs = await reqServices.query(servicesSql);
    const serviceIds = servicesRs.recordset.map(r => r.MaPhieuDV);

    // Nếu không có dịch vụ thì trả về header
    if (serviceIds.length === 0) {
      return { header: headerRs.recordset[0], services: [] };
    }

    // Tạo danh sách param cho mệnh đề IN
    const inParams = serviceIds.map((_, i) => `@id${i}`).join(',');
    const reqItems = pool.request();
    serviceIds.forEach((id, i) => reqItems.input(`id${i}`, id));

    const muaHangSql = `
      SELECT 
        ds.MaPhieuDV,
        ds.MaSP,
        ds.TenSP_SnapShot,
        ds.DonGia_LucMua,
        ds.SoLuongMua,
        (ds.DonGia_LucMua * ds.SoLuongMua) AS ThanhTien
      FROM DanhSachSP ds
      WHERE ds.MaPhieuDV IN (${inParams})
    `;
    const khamBenhSql = `
      SELECT 
        dt.MaPhieuDV,
        dt.MaSP,
        dt.TenSP_SnapShot,
        dt.DonGia_LucMua,
        dt.SoLuongMua,
        dt.ThanhTien
      FROM DonThuoc dt
      WHERE dt.MaPhieuDV IN (${inParams})
    `;
    const tiemPhongSql = `
      SELECT 
        dvx.MaPhieuDV,
        dvx.MaVacXin,
        dvx.LieuLuong,
        dvx.DonGia
      FROM DanhSachVacXin dvx
      WHERE dvx.MaPhieuDV IN (${inParams})
    `;

    const [muaHangRs, khamBenhRs, tiemPhongRs] = await Promise.all([
      reqItems.query(muaHangSql),
      reqItems.query(khamBenhSql),
      reqItems.query(tiemPhongSql),
    ]);

    const groupByPhieu = (rows) =>
      rows.reduce((acc, r) => {
        acc[r.MaPhieuDV] = acc[r.MaPhieuDV] || [];
        acc[r.MaPhieuDV].push(r);
        return acc;
      }, {});

    const mapMuaHang   = groupByPhieu(muaHangRs.recordset);
    const mapKhamBenh  = groupByPhieu(khamBenhRs.recordset);
    const mapTiemPhong = groupByPhieu(tiemPhongRs.recordset);

    const services = servicesRs.recordset.map(s => {
      let items = [];
      if (s.LoaiDichVu === 'Mua hàng')     items = mapMuaHang[s.MaPhieuDV]  || [];
      else if (s.LoaiDichVu === 'Khám bệnh') items = mapKhamBenh[s.MaPhieuDV] || [];
      else if (s.LoaiDichVu === 'Tiêm phòng') items = mapTiemPhong[s.MaPhieuDV] || [];
      return { ...s, items };
    });

    return { header: headerRs.recordset[0], services };
  } catch (err) {
    throw new Error(`Database query failed: ${err.message}`);
  }
};