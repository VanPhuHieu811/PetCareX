import * as authService from '../services/auth.service.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const { user, token } = await authService.login(req.db, email, password);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message
    })
  }
}