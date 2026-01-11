import sql from 'mssql';

export const getAllBranches = async (pool) => {
	try {
		const query = `SELECT * FROM ChiNhanh`;

		const result = await pool.request().query(query);
		return result.recordset;
	} catch (err) {
		throw new Error(`Database query failed: ${err.message}`);
	}
};

export const getBranchRevenue = async (pool, branchId) => {
	try {
		// Gọi TVF có tham số @macn: phải truyền tham số trong câu lệnh SQL
		const query = "select * from dbo.f_getAllBranchRevenue(@macn)";
		const result = await pool
			.request()
			.input('macn', sql.VarChar(10), branchId)
			.query(query)

		const data = result.recordset
		return data
	} catch (err) {
		throw new Error(`Database query fail: ${err.message}`);
	}
};

export const getBranchServiceUsage = async (pool, branchId) => {
	try {
		// Gọi TVF có tham số @macn: phải truyền tham số trong câu lệnh SQL
		const query = "select * from dbo.f_countServiceUsage(@macn)";
		const result = await pool
			.request()
			.input('macn', sql.VarChar(10), branchId)
			.query(query)

		const data = result.recordset
		return data
	} catch (err) {
		throw new Error(`Database query fail: ${err.message}`);
	}
};

export const getDateStatistics = async (pool, branchId, year = 0, month = 0, day = 0) => {
	try {
		const query = "select * from dbo.f_getDateStatistics(@macn, @day, @month, @year)";
		const result = await pool
			.request()
			.input('macn', sql.VarChar(10), branchId)
			.input('year', sql.Int, year)
			.input('month', sql.Int, month)
			.input('day', sql.Int, day)
			.query(query)
		const data = result.recordset
		return data
	}
	catch (err) {
		throw new Error(`Database query fail: ${err.message}`);
	}
}

export const getStaffBranch = async (pool, userId) => {
	try {
		const query = `
			SELECT cn.MaCN
			FROM ChiNhanh cn
			JOIN NhanVien nv ON cn.MaCN = nv.MaCN
			WHERE nv.MaNV = @userId
		`;
		const result = await pool
			.request()
			.input('userId', sql.VarChar(10), userId)
			.query(query);

		const data = result.recordset;
		return data;
	} catch (err) {
		throw new Error(`Database query fail: ${err.message}`);
	}
};

export const getBranchCustomerList = async (pool, branchId, limit, offset) => {
	try {
		const query = `
			select distinct kh.MaKH, nd.HoTen, kh.DiemLoyalty, ltv.TenLoaiTV, count(p.MaPhieuDV) as SoLanDatDV
			from NguoiDung nd, PhieuDatDV p, KhachHang kh, LoaiThanhVien ltv
			where p.MaCN = @macn
				and kh.MaLoaiTV = ltv.MaLoaiTV
				and kh.MaKH = p.MaKH
				and p.MaKH = nd.MaND
			group by kh.MaKH, nd.HoTen, kh.DiemLoyalty, ltv.TenLoaiTV
			order by SoLanDatDV desc
			OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
			`; // Cài phân trang
		const result = await pool
			.request()
			.input('macn', sql.VarChar(10), branchId)
			.input('limit', sql.Int, limit ?? 50)
			.input('offset', sql.Int, offset ?? 0)
			.query(query)
		const data = result.recordset
		return data
	}
	catch (err) {
		throw new Error(`Database query fail: ${err.message}`);
	}
};

export const countAllCustomersInBranch = async (pool, branchId) => {
	try {
		const query = `
			select count(distinct kh.MaKH) as TotalCustomers
			from NguoiDung nd, PhieuDatDV p, KhachHang kh
			where p.MaCN = @macn
				and kh.MaKH = p.MaKH
				and p.MaKH = nd.MaND
			`; 
		const result = await pool
			.request()
			.input('macn', sql.VarChar(10), branchId)
			.query(query)
		const data = result.recordset[0]?.TotalCustomers || 0;
		return data;
	}
	catch (err) {
		throw new Error(`Database query fail: ${err.message}`);
	}
};

export const countVIPCustomersInBranch = async (pool, branchId) => {
	try {
		const query = `
			select count(distinct kh.MaKH) as TotalCustomers
			from PhieuDatDV p, KhachHang kh
			where p.MaCN = @macn
				and kh.MaKH = p.MaKH
				and kh.MaLoaiTV = 'LTV03'
		`;
		const result = await pool
			.request()
			.input('macn', sql.VarChar(10), branchId)
			.query(query)
		const data = result.recordset[0]?.TotalCustomers || 0;
		return data;
	}
	catch (err) {
		throw new Error(`Database query fail: ${err.message}`);
	}
};

export default { 
	getAllBranches,
	getBranchRevenue,
	getBranchServiceUsage,
	getDateStatistics,
	getStaffBranch,
	getBranchCustomerList,
	countAllCustomersInBranch,
	countVIPCustomersInBranch
};
