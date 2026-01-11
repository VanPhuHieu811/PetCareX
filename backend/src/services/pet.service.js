import sql from 'mssql';

// 1. Lấy danh sách thú cưng của 1 User
export const getAllPetsByUserId = async (pool, userId) => {
    try {
        const query = 'SELECT * FROM ThuCung WHERE MaKH = @MaKH';
        const result = await pool.request()
            .input('MaKH', userId)
            .query(query);
        return result.recordset;
    } catch (error) {
        throw new Error('Error fetching pets: ' + error.message);
    }
};

// 2. Lấy chi tiết 
export const getPetById = async (pool, petId) => {
    try {
        const query = 'SELECT * FROM ThuCung WHERE MaTC = @MaTC'; 

        const result = await pool.request()
            .input('MaTC', petId)
            .query(query);
        
        return result.recordset[0];
    } catch (error) {
        throw new Error('Error fetching pet by ID: ' + error.message);
    }
};

// 3. Update 
export const updatePet = async (pool, petData) => {
    try {
        const query = `
            UPDATE ThuCung
            SET 
                TenTC = COALESCE(@TenTC, TenTC),
                MaGiong = COALESCE(@MaGiong, MaGiong),
                NgaySinh = COALESCE(@NgaySinh, NgaySinh),
                TinhTrangSucKhoe = COALESCE(@TinhTrangSucKhoe, TinhTrangSucKhoe),
                GioiTinh = COALESCE(@GioiTinh, GioiTinh),
            WHERE MaTC = @MaTC
        `;

        const result = await pool.request()
            .input('MaTC', sql.VarChar, petData.MaTC)
            .input('TenTC', sql.NVarChar, petData.TenTC ?? null)
            .input('MaGiong', sql.VarChar, petData.MaGiong ?? null)
            .input('NgaySinh', sql.Date, petData.NgaySinh ?? null)
            .input('TinhTrangSucKhoe', sql.NVarChar, petData.TinhTrangSucKhoe ?? null)
            .input('GioiTinh', sql.NVarChar, petData.GioiTinh ?? null)
            .query(query);

        return result.rowsAffected[0];
    } catch (error){
        throw new Error(`Failed update pet: ${error.message}`)
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

export const getPetExamHistory = async (pool, petId) => {
    try {
        const query = `
            SELECT 
                kb.MaPhieuDV, 
                kb.NgayKham, 
                kb.MoTaTrieuChung, 
                kb.MoTaChuanDoan,
                kb.NgayTaiKham, 
                kb.TongTienDonThuoc, 
                nd.HoTen as TenBacSi,
                (
                    SELECT 
                        dt.MaSP, 
                        dt.TenSP_Snapshot AS TenThuoc, 
                        dt.SoLuongMua, 
                        dt.DonGia_LucMua AS DonGia, 
                        dt.ThanhTien
                    FROM DonThuoc dt
                    WHERE dt.MaPhieuDV = kb.MaPhieuDV
                    FOR JSON PATH
                ) AS DonThuocList
            FROM DatKhamBenh kb
            JOIN PhieuDatDV p ON p.MaPhieuDV = kb.MaPhieuDV
            LEFT JOIN NhanVien nv ON kb.BacSiPhuTrach = nv.MaNV
            LEFT JOIN NguoiDung nd ON nv.MaNV = nd.MaND
            WHERE kb.MaTC = @MaTC
            ORDER BY kb.NgayKham DESC
        `;

        const result = await pool.request()
            .input('MaTC', sql.VarChar, petId)
            .query(query);

        return result.recordset.map(record => ({
            ...record,
            DonThuocList: record.DonThuocList ? JSON.parse(record.DonThuocList) : []
        }));

    } catch (error) {
        throw new Error('Error fetching pet exam history: ' + error.message);
    }
}

export const getPetVaccinationHistory = async (pool, petId) => {
    try {
        const query = `
            SELECT 
                dt.MaPhieuDV, 
                dt.NgayTiem, 
                nd.HoTen AS TenBacSi,
                -- Subquery lấy chi tiết các mũi tiêm trong phiếu đó
                (
                    SELECT 
                        vx.TenVacXin, 
                        ds.LieuLuong, 
                        ds.DonGia
                    FROM DanhSachVacXin ds
                    JOIN VacXin vx ON ds.MaVacXin = vx.MaVacXin
                    WHERE ds.MaPhieuDV = dt.MaPhieuDV
                    FOR JSON PATH
                ) AS DanhSachVacXin
            FROM DatTiemPhong dt
            LEFT JOIN NhanVien nv ON dt.BacSiPhuTrach = nv.MaNV
            LEFT JOIN NguoiDung nd ON nv.MaNV = nd.MaND
            WHERE dt.MaTC = @MaTC
            ORDER BY dt.NgayTiem DESC
        `;

        const result = await pool.request()
            .input('MaTC', sql.VarChar, petId)
            .query(query);

        return result.recordset.map(record => ({
            ...record,
            DanhSachVacXin: record.DanhSachVacXin ? JSON.parse(record.DanhSachVacXin) : []
        }));

    } catch (error) {
        throw new Error('Error fetching vaccination history: ' + error.message);
    }
}


export const getAllPetTypes = async (pool) => {
    try {
        const query = `
            Select MaLoaiTC, TenLoaiTC
            From LoaiThuCung
        `;

        const result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        throw new Error(`Fail to get list Pet type! ${err.message}`);
    }
};

export const getBreedsByTypeId = async (pool, typeId) => {
    try {
        const query = `
            Select MaGiong, TenGiong 
            From Giong 
            Where MaLoaiTC = @MaLoaiTC
        `;

        const result = await pool.request()
        .input('MaLoaiTC', sql.VarChar, typeId)
        .query(query);

        return result.recordset;
    } catch (err) {
        throw new Error(`Lỗi lấy danh sách giống: ${err.message}`);
    }
};


export default {
    getAllPetsByUserId,      
    getPetById, 
    createPet, 
    deletePet, 
    updatePet, 
    getPetVaccinationHistory,
    getAllPetTypes,
    getBreedsByTypeId,
};