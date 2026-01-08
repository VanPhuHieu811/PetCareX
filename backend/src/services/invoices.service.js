import sql from 'mssql';

const getDetailsFromDB = async (pool, invoiceId) => {
    try {
        // Tạo request từ pool được truyền vào
        const request = pool.request();
        request.input('invoiceId', sql.NVarChar, invoiceId);
        
        const query = `SELECT * FROM dbo.FN_GetInvoiceDetails(@invoiceId)`;
        const result = await request.query(query);
        
        return result.recordset;
    } catch (error) {
        throw new Error("Lỗi tại Service: " + error.message);
    }
};

export default { getDetailsFromDB };