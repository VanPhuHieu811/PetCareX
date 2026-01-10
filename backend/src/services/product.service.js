import sql from 'mssql';

export const getAllProducts = async (pool, page, limit, offset, keyword, category) => {
  try {
    const request = pool.request();
    // Logic: Nếu có keyword thì lọc, nếu không (keyword rỗng) thì lấy hết
    // Dùng N'%' + @keyword + '%' để tìm kiếm tiếng Việt tương đối
    const query = `
      with ProductList as (
        select sp.MaSP, sp.TenSP, sp.GiaBan, sp.DonViTinh, lsp.TenLoaiSP,
               ROW_NUMBER() OVER (ORDER BY sp.MaSP) AS RowNum,
               COUNT(*) OVER () as TotalCount
        from SanPham sp
        join LoaiSP lsp on sp.MaLoaiSP = lsp.MaLoaiSP
        WHERE (@keyword IS NULL OR sp.TenSP LIKE N'%' + @keyword + '%')
          AND (@category IS NULL OR lsp.TenLoaiSP = @category)
      )

      select pl.MaSP, pl.TenSP, pl.GiaBan, pl.DonViTinh, pl.TenLoaiSP, pl.TotalCount,
             spc.MaCN, spc.SoLuongTonKho
      from ProductList pl
      left join SPCuaTungCN spc on spc.MaSP = pl.MaSP
      where pl.RowNum > @offset and pl.RowNum <= @offset + @limit
      order by pl.MaSP
    `;

    request.input('offset', sql.Int, offset);
    request.input('limit', sql.Int, limit);
    request.input('keyword', sql.NVarChar, keyword || null);
    request.input('category', sql.NVarChar, category && category !== 'All' ? category : null);

    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return {
        data: [],
        pagination: { page, limit, totalRecords: 0, totalPages: 0 }
      };
    }

    const totalRecords = result.recordset[0].TotalCount;
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

		if (result.recordset.length === 0) {
			return {
				data: [],
				pagination: { page, limit, totalRecords: 0, totalPages: 0 }
			};
		}

  } catch (error) {
    throw new Error('Error fetching products: ' + error.message);
  }
}
