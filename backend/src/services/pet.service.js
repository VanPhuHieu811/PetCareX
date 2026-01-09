import sql from 'mssql';
export const getAllPetsByUserId = async (pool, userId) => {
    try {
        const query = 'Select * from ThuCung where MaKH = @MaKH';

        const result = await pool.request()
            .input('MaKH', userId)
            .query(query);

        return result.recordset;
    } catch (error) {
        throw new Error('Error fetching pets by user ID: ' + error.message);
    }
};

export const getPetById = async (pool, petId, userId) => {
    try {
        const query = 'Select * from ThuCung where MaTC = @MaTC and MaKH = @MaKH';

        const result = await pool.request()
            .input('MaTC', petId)
            .input('MaKH', userId)
            .query(query);
        
        return result.recordset[0];
    } catch (error) {
        throw new Error('Error fetching pet by ID: ' + error.message);
    }
};

export const createPet = async (pool, petData) => {
    try {
        const result = await pool.request()
            .input('TenTC', sql.NVarChar, petData.TenTC)
            .input('MaGiong', sql.VarChar, petData.MaGiong)
            .input('NgaySinh', sql.Date, petData.NgaySinh)
            .input('TinhTrangSucKhoe', sql.NVarChar, petData.TinhTrangSucKhoe || null)
            .input('MaKH', sql.VarChar, petData.MaKH)
            .input('GioiTinh', sql.NVarChar, petData.GioiTinh)
            .execute('SP_ThemThuCung');
        
        return result.recordset[0];
    } catch (error) {
        if (error.message.includes('FK')) {
            throw new Error('Foreign key constraint violation: ' + error.message);
        }
        throw new Error('Error creating pet: ' + error.message);
    }
}

export const deletePet = async (pool, petId, userId) => {
    try {
        const query = 'DELETE FROM ThuCung WHERE MaTC = @MaTC and MaKH = @MaKH';

        const result = await pool.request()
            .input('MaTC', petId)
            .input('MaKH', userId)
            .query(query);

        return result.rowsAffected[0];
    } catch(error){
        if (error.number === 547) {
            throw new Error('Cannot delete pet due to existing related records: ' + error.message);
        }

        throw new Error('Error deleting pet: ' + error.message);
    }
};

export const updatePet = async (pool, petData) => {
    try {
        const query = `
            Update ThuCung
            Set 
                TenTC = COALESCE(@TenTC, TenTC),
                MaGiong = COALESCE(@MaGiong, MaGiong),
                NgaySinh         = COALESCE(@NgaySinh, NgaySinh),
                TinhTrangSucKhoe = COALESCE(@TinhTrangSucKhoe, TinhTrangSucKhoe),
                GioiTinh         = COALESCE(@GioiTinh, GioiTinh),
                MaKH             = COALESCE(@MaKH, MaKH)
            WHERE MaTC = @MaTC and MaKH = @MaKH
        `;

        const result = await pool.request()
            .input('MaTC', sql.VarChar, petData.MaTC)
            .input('TenTC', sql.NVarChar, petData.TenTC ?? null)
            .input('MaGiong', sql.VarChar, petData.MaGiong ?? null)
            .input('NgaySinh', sql.Date, petData.NgaySinh ?? null)
            .input('TinhTrangSucKhoe', sql.NVarChar, petData.TinhTrangSucKhoe ?? null)
            .input('GioiTinh', sql.NVarChar, petData.GioiTinh ?? null)
            .input('MaKH', sql.VarChar, petData.MaKH ?? null)
            .query(query);

        return result.rowsAffected[0];
    } catch (error){
        throw new Error(`Falied update pet: ${error.message}`)
    }
};

export const getPetExamHistory = async (pool, petId) => {
    try {
        const query = `
            Select  p.MaPhieuDV, kb.NgayKham, kb.MoTaTrieuChung, kb.MoTaChuanDoan,
                    kb.NgayTaiKham, kb.TongTienDonThuoc, nv.HoTen as TenBacSi
            From DatKhamBenh kb
            Join PhieuDatDV p on p.MaPhieuDV = kb.MaPhieuDV
            Join NguoiDung nv on kb.BacSiPhuTrach = nv.MaND
            Join ChiNhanh cn on cn.MaCN = p.MaCN
            Where kb.MaTC = @MaTC
            Order by kb.NgayKham Desc
            `;

        const result = await pool.request()
            .input('MaTC', petId)
            .query(query);

        return result.recordset;
    } catch (error) {
        throw new Error('Error fetching pet exam history: ' + error.message);
    }
}


export const getPetVaccinationHistory = async (pool, petId) => {
    try {
        const query = `
            Select dt.MaPhieuDV, dt.NgayTiem, vx.TenVacXin, ds.LieuLuong,
                ds.DonGia, nd.HoTen AS TenBacSi
            From DatTiemPhong dt
            Join DanhSachVacXin ds on dt.MaPhieuDV = ds.MaPhieuDV
            Join VacXin vx ON ds.MaVacXin = vx.MaVacXin
            Left join NhanVien nv on dt.BacSiPhuTrach = nv.MaNV
            Left join NguoiDung nd on nv.MaNV = nd.MaND
            Where dt.MaTC = @MaTC
            Order by dt.NgayTiem DESC
            `;

        const result = await pool.request()
            .input('MaTC', petId)
            .query(query);

        return result.recordset;
    } catch (error) {
        throw new Error('Error fetching pet exam history: ' + error.message);
    }
}   
export default {getAllPetsByUserId, getPetById, createPet, deletePet, updatePet, getPetVaccinationHistory};