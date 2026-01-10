import mssql from 'mssql';

export const getAllVaccines = async (pool) => {
	try {
		const query = `SELECT * FROM VacXin`;
		const result = await pool.request().query(query);
		return result.recordset;
	} catch (err) {
		throw new Error(`Database query fail: ${err.message}`);
	}
};

export const addVaccine = async (pool, vaccine) => {
	try {
		const query = `
			INSERT INTO VacXin (MaVacXin, TenVacXin, NgaySanXuat, GiaVacXin, DonViTinh)
			VALUES (@mavx, @tenvx, @ngaysanxuat, @giavx, @donvitinh)
		`;
		await pool
			.request()
			.input('mavx', mssql.VarChar(10), vaccine.MaVacXin)
			.input('tenvx', mssql.NVarChar(100), vaccine.TenVacXin)
			.input('ngaysanxuat', mssql.Date, vaccine.NgaySanXuat)
			.input('giavx', mssql.Decimal(18, 2), vaccine.GiaVacXin)
			.input('donvitinh', mssql.NVarChar(50), vaccine.DonViTinh)
			.query(query);
	} catch (err) {
		throw new Error(`Database query fail: ${err.message}`);
	}
};

export const getVaccineByBranch = async (pool, branchId) => {
	try {
		const query = `
			SELECT vx.*, vxc.TonKho
			FROM VacXin vx
			JOIN VacXin_ChiNhanh vxc ON vx.MaVacXin = vxc.MaVacXin
			WHERE vxc.MaCN = @macn
		`;
		const result = await pool
			.request()
			.input('macn', mssql.VarChar(10), branchId)
			.query(query);
		return result.recordset;
	} catch (err) {
		throw new Error(`Database query fail: ${err.message}`);
	}
};

export const addVaccineToBranch = async (pool, branchId, vacxinId, tonKho) => {
	try {
		const query = `
			INSERT INTO VacXin_ChiNhanh (MaCN, MaVacXin, TonKho)
			VALUES (@macn, @mavx, @tonkho)
		`;
		await pool
			.request()
			.input('macn', mssql.VarChar(10), branchId)
			.input('mavx', mssql.VarChar(10), vacxinId)
			.input('tonkho', mssql.Int, tonKho)
			.query(query);
	} catch (err) {
		throw new Error(`Database query fail: ${err.message}`);
	}
};

export const deleteVacxinByBranch = async (pool, branchId, vacxinId) => {
	try {
		const query = `
			DELETE FROM VacXin_ChiNhanh
			WHERE MaCN = @macn AND MaVacXin = @mavx
		`;
		await pool
			.request()
			.input('macn', mssql.VarChar(10), branchId)
			.input('mavx', mssql.VarChar(10), vacxinId)
			.query(query);
	} catch (err) {
		throw new Error(`Database query fail: ${err.message}`);
	}
};

export const getBranchVacxinUseRate = async (pool, branchId) => {
	try {
		const query = `
			select vc.MaVacXin, vc.TenVacXin, count(distinct tp.MaPhieuDV) as LuotSuDung
			from vacxin vc, danhsachvacxin ds, phieudatdv tp
			where ds.MaPhieuDV = tp.MaPhieuDV
				and ds.MaVacXin = vc.MaVacXin
				and (tp.TrangThai = N'Đã thanh toán' or tp.TrangThai = N'Đang thực hiện')
				and tp.MaCN = @macn
			group by vc.MaVacXin, vc.TenVacXin
		`;
		const result = await pool
			.request()
			.input('macn', mssql.VarChar(10), branchId)
			.query(query);
		return result.recordset;
	}
	catch (err) {
		throw new Error(`Database query fail: ${err.message}`);
	}
};

export default {
	getAllVaccines,
	addVaccine,
	getVaccineByBranch,
	addVaccineToBranch,
	deleteVacxinByBranch,
	getBranchVacxinUseRate
};