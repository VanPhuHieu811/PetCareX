import jwt from 'jsonwebtoken';

export const login = async (pool, email, password) => {
  try {
    const request = pool.request();
    request.input('Email', email);
    request.input('Password', password);
    
    const result = await request.execute('sp_login');

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