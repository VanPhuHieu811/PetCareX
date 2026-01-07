// Role: Quản lý
const authorizeManager = (req, res, next) => {
  if (!req.user || req.user.role !== 'Quản lý') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Managers only'
    });
  }
  next()
}

// Role: Tiếp tân
const authorizeReceptionist = (req, res, next) => {
  if (!req.user || req.user.role !== 'Tiếp tân') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Receptionists only'
    });
  }
  next()
}

// Role: Bác sĩ
const authorizeDoctor = (req, res, next) => {
  if (!req.user || req.user.role !== 'Bác sĩ') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Doctors only'
    });
  }
  next()
}

// Role: Bán hàng
const authorizeSeller = (req, res, next) => {
  if (!req.user || req.user.role !== 'Bán hàng') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Sellers only'
    });
  }
  next()
}