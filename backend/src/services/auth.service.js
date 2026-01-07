import jwt from 'jsonwebtoken';

export const login = async (pool, email, password) => {
  try {
    const query = `
    select nd.MaND, nd.HoTen, nd.Email, tk.VaiTro
    from TaiKhoan tk
    join NguoiDung nd on tk.MaND = nd.MaND
    where nd.Email = @Email and tk.MatKhau = @password
    `
    
    const result = await pool.request()
      .input('Email', email)
      .input('password', password)
      .query(query);

    if (result.recordset.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = result.recordset[0];

    const token = jwt.sign({
      id: user.MaND,
      email: user.Email,
      role: user.VaiTro
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { user, token };
  }
  catch (err) {
    throw new Error(`Login failed: ${err.message}`);
  }
}