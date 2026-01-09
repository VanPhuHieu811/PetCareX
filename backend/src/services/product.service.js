export const getAllProducts = async (pool, page, limit, offset) => {
  try {
    const request = pool.request();
    const query = `
      with ProductList as (
        select sp.MaSP, sp.TenSP, sp.GiaBan, sp.DonViTinh, lsp.TenLoaiSP,
               ROW_NUMBER() OVER (ORDER BY sp.MaSP) AS RowNum
        from SanPham sp
        join LoaiSP lsp on sp.MaLoaiSP = lsp.MaLoaiSP
      )

      select pl.MaSP, pl.TenSP, pl.GiaBan, pl.DonViTinh, pl.TenLoaiSP,
             spc.MaCN, spc.SoLuongTonKho
      from ProductList pl
      left join SPCuaTungCN spc on spc.MaSP = pl.MaSP
      where pl.RowNum > @offset and pl.RowNum <= @offset + @limit
      order by pl.MaSP
    `;
    request.input('offset', offset);
    request.input('limit', limit);

    const result = await request.query(query);
    
    const productsMap = {};
    result.recordset.forEach(row => {
      if (!productsMap[row.MaSP]) {
        productsMap[row.MaSP] = {
          MaSP: row.MaSP,
          TenSP: row.TenSP,
          GiaBan: row.GiaBan,
          DonViTinh: row.DonViTinh,
          TenLoaiSP: row.TenLoaiSP,
          SoLuongTonKho: {}
        };
      }
      if (row.MaCN) {
        productsMap[row.MaSP].SoLuongTonKho[row.MaCN] = row.SoLuongTonKho;
      }
    });

    return {
      data: Object.values(productsMap),
      page: page,
      limit: limit
    }
  } catch (error) {
    throw new Error('Error fetching products: ' + error.message);
  }  
}