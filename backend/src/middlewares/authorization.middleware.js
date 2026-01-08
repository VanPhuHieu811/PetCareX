const authorizeRoles = (...roles) => (req, res, next) => {
  const role = req.user.role
  if (!role || !roles.includes(role)) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
};

export const authorizeManager = authorizeRoles('Quản lý');
export const authorizeReceptionist = authorizeRoles('Tiếp tân');
export const authorizeDoctor = authorizeRoles('Bác sĩ');
export const authorizeSeller = authorizeRoles('Bán hàng');

// you can also create combined role authorizations if needed
// export const authorizeManagerAndDoctor = authorizeRoles('Quản lý', 'Bác sĩ');