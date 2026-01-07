export const getAllBranches = async (pool) => {
  try {
    const query = `SELECT * FROM ChiNhanh`;

    const result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    throw new Error(`Database query failed: ${err.message}`);
  }
};

export default { getAllBranches };