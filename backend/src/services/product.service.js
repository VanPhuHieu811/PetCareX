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

export const getLatestProductsId = async (pool) => {
	try {
		const query = `
			select top 1 sp.MaSP
			from SanPham sp
			order by sp.MaSP desc
		`;
		const result = await pool.request().query(query);
		return result.recordset;
	} catch (err) {
		throw new Error(`Database query fail: ${err.message}`);
	}
};

export const getBranchProduct = async (pool, page, limit, branchId) => {
	try {
		const query = `
			select sp.MaSP, 
				sp.TenSP, 
				lsp.TenLoaiSP, 
				sp.GiaBan, 
				sp.DonViTinh, 
				spcn.SoLuongTonKho
			from SanPham sp, LoaiSP lsp, SPCuaTungCN spcn
			where sp.MaLoaiSP = lsp.MaLoaiSP
				and sp.MaSP = spcn.MaSP
				and spcn.MaCN = @branchId
			order by sp.MaSP
			offset @offset rows
			fetch next @limit rows only
		`;
		const offset = (page - 1) * limit;
		const result = await pool
			.request()
			.input('offset', offset)
			.input('limit', limit)
			.input('branchId', branchId)
			.query(query);
		return result.recordset;
	} catch (err) {
		throw new Error(`Database query fail: ${err.message}`);
	}
};

export const addProductToBranch = async (pool, branchId, productId, tonKho) => {
	try {
		const query = `
			INSERT INTO SPCuaTungCN (MaCN, MaSP, SoLuongTonKho)
			VALUES (@macn, @masp, @tonkho)
		`;
		await pool
			.request()
			.input('macn', branchId)
			.input('masp', productId)
			.input('tonkho', tonKho)
			.query(query);
	} catch (err) {
		throw new Error(`Database query fail: ${err.message}`);
	}
};

export const deleteProductFromBranch = async (pool, branchId, productId) => {
	try {
		const query = `
			DELETE FROM SPCuaTungCN
			WHERE MaCN = @macn AND MaSP = @masp
		`;
		await pool
			.request()
			.input('macn', branchId)
			.input('masp', productId)
			.query(query);
	} catch (err) {
		throw new Error(`Database query fail: ${err.message}`);
	}
};

export const addBranchProductStock = async (pool, branchId, productId, quantity) => {
	try {
		const query = `
			UPDATE SPCuaTungCN
			SET SoLuongTonKho = SoLuongTonKho + @quantity
			WHERE MaCN = @macn AND MaSP = @masp
		`;
		await pool
			.request()
			.input('macn', branchId)
			.input('masp', productId)
			.input('quantity', quantity)
			.query(query);
	} catch (err) {
		throw new Error(`Database query fail: ${err.message}`);
	}
};

export const countBranchProducts = async (pool, branchId) => {
	try {
		const query = `
			SELECT COUNT(MaSP) AS total
			FROM SPCuaTungCN
			WHERE MaCN = @branchId
		`;
		const result = await pool
			.request()
			.input('branchId', branchId)
			.query(query);
		return result.recordset[0].total;
	} catch (err) {
		throw new Error(`Database query fail: ${err.message}`);
	}
};

export const countAllProducts = async (pool) => {
	try {
		const query = `
			SELECT COUNT(*) AS total
			FROM SanPham
		`;
		const result = await pool.request().query(query);
		return result.recordset[0].total;
	} catch (err) {
		throw new Error(`Database query fail: ${err.message}`);
	}
};

export default {
	getAllProducts,
	getLatestProductsId,
	getBranchProduct,
	addProductToBranch,
	deleteProductFromBranch,
	addBranchProductStock,
	countBranchProducts,
	countAllProducts
};