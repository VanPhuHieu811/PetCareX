import sql from 'mssql';

// 1. Lấy mã ND lớn nhất hiện tại của loại Khách hàng
const createCustomer = async (pool, customerData) => {
    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();
        const request = new sql.Request(transaction);

        // 1. Lấy mã ND lớn nhất hiện tại
        const lastIdResult = await request.query(`
            SELECT TOP 1 MaND 
            FROM NguoiDung 
            WHERE LoaiND = N'Khách hàng' AND MaND LIKE 'KH%'
            ORDER BY MaND DESC
        `);

        let nextId = 'KH001';
        if (lastIdResult.recordset.length > 0) {
            const lastId = lastIdResult.recordset[0].MaND;
            const currentNumber = parseInt(lastId.replace('KH', ''), 10);
            const nextNumber = currentNumber + 1;
            nextId = 'KH' + nextNumber.toString().padStart(3, '0');
        }
        
        // 2. Thêm vào bảng NguoiDung (Bổ sung NgaySinh, GioiTinh)
        await request
            .input('MaND', sql.NVarChar, nextId)
            .input('HoTen', sql.NVarChar, customerData.name)
            .input('Email', sql.NVarChar, customerData.email)
            .input('NgaySinh', sql.Date, customerData.birthDate) // Trùng với state frontend
            .input('GioiTinh', sql.NVarChar(10), customerData.gender)
            .input('SDT', sql.NVarChar, customerData.sdt)
            .input('CCCD', sql.NVarChar, customerData.cccd || null)
            .input('LoaiND', sql.NVarChar, 'Khách hàng')
            .query(`
                INSERT INTO NguoiDung (MaND, HoTen, Email, NgaySinh, GioiTinh, SDT, CCCD, LoaiND)
                VALUES (@MaND, @HoTen, @Email, @NgaySinh, @GioiTinh, @SDT, @CCCD, @LoaiND)
            `);

        // 3. Thêm vào bảng KhachHang
        await request.query(`
            INSERT INTO KhachHang (MaKH ,DiemLoyalty, MaLoaiTV)
            VALUES (@MaND,0, 'LTV01')
        `);

        await transaction.commit();
        return { maND: nextId, ...customerData }; // SỬA LỖI: Trả về nextId
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
const getPetMedicalHistory = async (pool, maTC) => {
    const request = pool.request();
    request.input('MaTC', sql.NVarChar(20), maTC);
    
    // Truy vấn lấy lịch sử từ các bảng Phiếu đặt dịch vụ và Phiếu khám bệnh
    const query = `
        SELECT 
            p.MaPhieuDV,
            p.NgayDatDV AS NgayLap,
            d.TenDV,
            pk.MoTaChuanDoan,
            pk.MoTaTrieuChung,
            nd.HoTen AS TenBS
        FROM PhieuDatDV p
        JOIN DichVu d ON p.MaDV = d.MaDV
        LEFT JOIN DatKhamBenh pk ON p.MaPhieuDV = pk.MaPhieuDV
        LEFT JOIN NhanVien nv ON pk.BacSiPhuTrach = nv.MaNV
        LEFT JOIN NguoiDung nd ON nv.MaNV = nd.MaND
        WHERE pk.MaTC =  @MaTC
        ORDER BY p.NgayDatDV DESC
    `;
    
    const result = await request.query(query);
    return result.recordset;
};
const getCustomerInfo = async (pool, identifier) => {
    try {
        // Tạo request từ pool đã được kết nối
        const request = pool.request();
        
        request.input('identifier', sql.NVarChar(50), identifier);

        const query = `SELECT * FROM dbo.FN_GetCustomerInfo(@identifier)`;
        
        const result = await request.query(query);
        return result.recordset;
    } catch (error) {
        throw error;
    }
};

const getCustomerStats = async (pool) => {
    const request = pool.request();
    const query = `
        select 
            count (case when kh.MaLoaiTV='LTV01' then 1 end ) as CoBan,
            count (case when kh.MaLoaiTV='LTV02' then 1 end ) as ThanThiet,
            count (case when kh.MaLoaiTV='LTV03' then 1  end ) as VIP
        from khachhang kh
    `;
    const result = await request.query(query);
    return result.recordset[0];
};

// 2. Lấy danh sách lịch hẹn và thống kê
const getAppointmentDashboard = async (pool, { date, status, search }) => {
    const request = pool.request();
    request.input('NgayLoc', sql.Date, date);
    request.input('TrangThai', sql.NVarChar, status);
    request.input('Search', sql.NVarChar, search);

    const [stats, list] = await Promise.all([
        request.query(`
            SELECT 
                COUNT(CASE WHEN p.TrangThai = N'Đang chờ' THEN 1 END) AS DangCho,
                COUNT(CASE WHEN p.TrangThai = N'Đã thanh toán' THEN 1 END) AS DaThanhToan,
                COUNT(CASE WHEN p.TrangThai = N'Hoàn thành' THEN 1 END) AS HoanThanh,
                COUNT(CASE WHEN p.TrangThai = N'Hủy' THEN 1 END) AS DaHuy
            FROM PhieuDatDV p 
            JOIN DichVu d on d.madv=p.madv
            WHERE CAST(p.NgayDatDV AS DATE) = @NgayLoc and d.tendv!=N'Mua hàng'
        `),
        request.query(`
                SELECT p.MaPhieuDV, p.NgayDatDV, p.TenThuCung, dv.TenDV, 
                        ndKH.HoTen AS TenKH, ndKH.sdt AS SdtKH, 
                        ndBS.HoTen AS TenBS, p.TrangThai
                FROM PhieuDatDV p
                JOIN NguoiDung ndKH ON p.MaKH = ndKH.MaND
                LEFT JOIN NhanVien bs ON p.BacSiPhuTrach = bs.MaNV
                LEFT JOIN NguoiDung ndBS ON bs.MaNV = ndBS.MaND
                JOIN DichVu dv ON p.MaDV = dv.MaDV
                WHERE CAST(p.NgayDatDV AS DATE) = @NgayLoc
                    AND dv.TenDV !=N'Mua hàng'
                    AND (@TrangThai = N'Tất cả' OR p.TrangThai = @TrangThai)
                    AND (ndKH.HoTen LIKE '%' + @Search + '%' OR p.TenThuCung LIKE '%' + @Search + '%')
                ORDER BY p.NgayDatDV ASC
        `)
    ]);

    return {
        stats: stats.recordset[0],
        appointments: list.recordset
    };
};

//3. Lấy danh sách các bác sĩ rãnh ở chi nhánh
const getAvailableDoctors=async(pool,{ branchId, date, time }) => {
   try{
    const request=pool.request();
    request.input('MaCN',sql.NVarChar(50),branchId);
    request.input('NgayDatDV',sql.DateTime,date);
    request.input('ThoiGian',sql.NVarChar(50),time);

    const query=`select * from dbo.FN_GetAvailableDoctors(@MaCN,@NgayDatDV,@ThoiGian)`;
    const result=await request.query(query);
    return result.recordset;}
    catch(error){
        throw error;
    }
}
// 1. Hàm mới: Lấy tất cả loại thú cưng (Chó, Mèo, Chim...)
const getPetSpecies = async (pool) => {
    const request = pool.request();
    const query = `SELECT MaLoaiTC, TenLoaiTC FROM LoaiThuCung ORDER BY TenLoaiTC ASC`;
    const result = await request.query(query);
    return result.recordset;
};

// 2. CẬP NHẬT: Lấy danh sách giống dựa trên Mã Loại (MaLoaiTC)
const getBreedsBySpecies = async (pool, maLoaiTC) => {
    const request = pool.request();
    const query = `
        SELECT MaGiong, TenGiong 
        FROM Giong 
        WHERE MaLoaiTC = @MaLoaiTC
        ORDER BY TenGiong ASC
    `;
    const result = await request.input('MaLoaiTC', sql.NVarChar, maLoaiTC).query(query);
    return result.recordset;
};

// 4. Thêm thú cưng mới
const addPet = async (pool, petData) => {
    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();
        const request = new sql.Request(transaction);

        // Sinh mã TC tự động
        const lastPet = await request.query(`SELECT TOP 1 MaTC FROM ThuCung ORDER BY MaTC DESC`);
        let nextPetId = 'TC0001';
        if (lastPet.recordset.length > 0) {
            const lastId = lastPet.recordset[0].MaTC;
            const num = parseInt(lastId.replace('TC', ''), 10);
            nextPetId = 'TC' + (num + 1).toString().padStart(4, '0');
        }

        await request
            .input('MaTC', sql.NVarChar, nextPetId)
            .input('MaKH', sql.NVarChar, petData.maKH)
            .input('TenTC', sql.NVarChar, petData.name)
            .input('GioiTinh', sql.NVarChar, petData.gender)
            .input('NgaySinh', sql.Date, petData.birthDate || null)
            .input('MaGiong', sql.NVarChar, petData.breedId) // NHẬN MÃ GIỐNG TỪ FRONTEND
            .query(`
                INSERT INTO ThuCung (MaTC, MaKH, TenTC, GioiTinh, NgaySinh, MaGiong, TinhTrangSucKhoe)
                VALUES (@MaTC, @MaKH, @TenTC, @GioiTinh, @NgaySinh, @MaGiong, N'Bình thường')
            `);

        await transaction.commit();
        return { maTC: nextPetId, ...petData };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 5. Tạo lịch hẹn (Xử lý logic rẽ nhánh Khám/Tiêm)
const createAppointment = async (pool, data) => {
    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();
        const request = new sql.Request(transaction);

        // A. Sinh mã PhieuDatDV (VD: PDV0001)
        const lastPhieu = await request.query(`SELECT TOP 1 MaPhieuDV FROM PhieuDatDV ORDER BY MaPhieuDV DESC`);
        let nextPDV = 'PDV0001';
        if (lastPhieu.recordset.length > 0) {
            const lastId = lastPhieu.recordset[0].MaPhieuDV;
            const num = parseInt(lastId.replace('PDV', ''), 10);
            nextPDV = 'PDV' + (num + 1).toString().padStart(4, '0');
        }

        // B. Tạo PhieuDatDichVu (Chung cho cả Khám và Tiêm)
        await request
            .input('MaPhieuDV', sql.NVarChar, nextPDV)
            .input('NgayDatDV', sql.DateTime, data.ngayHen) // 'YYYY-MM-DD HH:mm'
            .input('HinhThucDat', sql.NVarChar, 'Offline')
            .input('TrangThai', sql.NVarChar, 'Đang chờ')
            .input('MaCN', sql.NVarChar, data.maCN)
            .input('MaDV', sql.NVarChar, data.maDV)
            .input('MaKH', sql.NVarChar, data.maKH)
            .query(`
                INSERT INTO PhieuDatDV (MaPhieuDV, NgayDatDV, HinhThucDat, TrangThai, MaCN, MaDV, MaKH)
                VALUES (@MaPhieuDV, @NgayDatDV, @HinhThucDat, @TrangThai, @MaCN, @MaDV, @MaKH)
            `);

        // C. Xử lý rẽ nhánh
        if (data.loaiDichVu === 'KhamBenh') {
            // --- TRƯỜNG HỢP KHÁM BỆNH ---
            await request
                .input('BacSiPhuTrach', sql.NVarChar, data.maBS) // Có thể null nếu chọn ngẫu nhiên
                .input('MaTC', sql.NVarChar, data.maTC)
                .query(`
                    INSERT INTO DatKhamBenh (MaPhieuDV, BacSiPhuTrach, MaTC, NgayKham, MoTaTrieuChung, MoTaChuanDoan, TongTienDonThuoc)
                    VALUES (@MaPhieuDV, @BacSiPhuTrach, @MaTC, NULL, NULL, NULL, 0)
                `);
        } 
        else if (data.loaiDichVu === 'TiemPhong') {
            // --- TRƯỜNG HỢP TIÊM PHÒNG ---
            let maDK = null;

            // C1. Nếu là Đăng ký gói tiêm (data.isPackage = true)
            if (data.isPackage && data.maGoiTP) {
                // Sinh mã Đăng ký (VD: DK001)
                const lastDK = await request.query(`SELECT TOP 1 MaDK FROM DangKyGoiTP ORDER BY MaDK DESC`);
                let nextDK = 'DK001';
                if (lastDK.recordset.length > 0) {
                    const lId = lastDK.recordset[0].MaDK;
                    const n = parseInt(lId.replace('DK', ''), 10);
                    nextDK = 'DK' + (n + 1).toString().padStart(3, '0');
                }
                maDK = nextDK;

                // Tạo DangKyGoiTP
                await request
                    .input('MaDK', sql.NVarChar, nextDK)
                    .input('MaGoiTP', sql.NVarChar, data.maGoiTP)
                    .input('ThoiGianBD', sql.Date, new Date()) // Ngày bắt đầu là hôm nay
                    .input('ThoiGianKT', sql.Date, data.ngayKetThucPackage || null)
                    .query(`
                        INSERT INTO DangKyGoiTP (MaDK, MaKH, MaGoiTP, ThoiGianBD, ThoiGianKT)
                        VALUES (@MaDK, @MaKH, @MaGoiTP, @ThoiGianBD, @ThoiGianKT)
                    `);
            }

            // C2. Tạo DatTiemPhong (cho cả Tiêm lẻ và Tiêm gói)
            await request
                .input('MaDK_TP', sql.NVarChar, maDK) // Biến local maDK vừa tạo hoặc null
                .input('BacSi_TP', sql.NVarChar, data.maBS)
                .input('MaTC_TP', sql.NVarChar, data.maTC)
                .query(`
                    INSERT INTO DatTiemPhong (MaPhieuDV, NgayTiem, BacSiPhuTrach, MaTC, MaDK)
                    VALUES (@MaPhieuDV, NULL, @BacSi_TP, @MaTC_TP, @MaDK_TP)
                `);
        }

        await transaction.commit();
        return { success: true, maPhieuDV: nextPDV };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
export default { getCustomerInfo, getAppointmentDashboard, getAvailableDoctors, getCustomerStats , createCustomer, getPetMedicalHistory, addPet, 
    getPetSpecies, getBreedsBySpecies, addPet, createAppointment
};