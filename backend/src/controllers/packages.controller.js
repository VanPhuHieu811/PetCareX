import * as packagesService from '../services/packages.service.js';

export const getInfoPackages = async (req, res) => {
  try {
    const { petId } = req.body; // Lấy :doctorId từ endpoint
    const result = await packagesService.getPackageRegistration(req.db, petId);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Không thể lấy thông tin gói tiêm', 
      details: err.message 
    });
  }
};

export const getPackages = async (req, res) => {
  try {
    const result = await packagesService.getAllPackages(req.db);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Không thể lấy danh sách gói tiêm',
      details: err.message
    });
  }
};

export const postRegisterPackage = async (req, res) => {
  try {
    const result = await packagesService.registerPackage(req.db, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const postPackageSchedule = async (req, res) => {
  try {
    const { maDK, maVaccine } = req.body; // Đây là MaDK
    const result = await packagesService.createVaccineSchedule(req.db, maDK, maVaccine);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};