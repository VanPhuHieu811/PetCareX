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

export default { 
	getAllBranches,
	getBranchRevenue,
	getBranchServiceUsage,
	getDateStatistics,
};
