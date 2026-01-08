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

    return {
      data: result.recordset,
      page: page,
      limit: limit
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
    select *
    from KhachHang kh
    join NguoiDung nd on kh.MaKH = nd.MaND
    where kh.MaKH = @MaND
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
    let updateFields = [];
    
    if (updateData.HoTen) {
      request.input('HoTen', updateData.HoTen);
      updateFields.push('HoTen = @HoTen');
    }
    if (updateData.NgaySinh) {
      request.input('NgaySinh', updateData.NgaySinh);
      updateFields.push('NgaySinh = @NgaySinh');
    }
    if (updateData.GioiTinh) {
      request.input('GioiTinh', updateData.GioiTinh);
      updateFields.push('GioiTinh = @GioiTinh');
    }
    if (updateData.SDT) {
      request.input('SDT', updateData.SDT);
      updateFields.push('SDT = @SDT');
    }
    if (updateData.CCCD) {
      request.input('CCCD', updateData.CCCD);
      updateFields.push('CCCD = @CCCD');
    }

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