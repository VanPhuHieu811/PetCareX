import sql from 'mssql';

export const getDoctorStatistics = async (pool, branchId) => {
	try {
		const query = "SELECT * FROM dbo.f_getDoctorStatistics(@macn)";
		const result = await pool
			.request()
			.input('macn', sql.VarChar(10), branchId)
			.query(query);
		return result.recordset;
	}
	catch (err) {
		throw new Error(`Database query fail: ${err.message}`);
	}
};

export default {
	getDoctorStatistics,
};
