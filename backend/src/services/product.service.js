export const getAllProducts = async (pool, page, limit, offset) => {
  try {
    const request = pool.request();
    const query = `
      select sp.MaSP, sp.TenSP, sp.GiaBan, sp.DonViTinh, lsp.TenLoaiSP
      from SanPham sp
      join LoaiSP lsp on sp.MaLoaiSP = lsp.MaLoaiSP
      order by MaSP
      offset @offset rows
      fetch next @limit rows only
    `;
    request.input('offset', offset);
    request.input('limit', limit);

    const result = await request.query(query);
    return {
      data: result.recordset,
      page: page,
      limit: limit
    }
  } catch (error) {
    throw new Error('Error fetching products: ' + error.message);
  }  
}