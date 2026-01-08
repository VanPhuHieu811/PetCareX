import * as authService from '../services/auth.service.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      email.trim() === '' ||
      password.trim() === ''
    ) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }
    
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