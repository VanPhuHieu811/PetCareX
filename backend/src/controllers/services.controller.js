import * as servicesService from '../services/services.service.js';

export const getQueue = async (req, res) => {
  try {
    const { doctorId } = req.body; // Lấy :doctorId từ endpoint
    const result = await servicesService.getDoctorQueue(req.db, doctorId);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Không thể lấy hàng đợi khám', 
      details: err.message 
    });
  }
};

export const getMedicines = async (req, res) => {
  try {
    const { branchId } = req.body; // Lấy từ Query String
    const medicines = await servicesService.searchMedicines(req.db, branchId);
    
    res.status(200).json(medicines);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi lấy danh sách thuốc', details: err.message });
  }
};

export const postPrescription = async (req, res) => {
  try {
    const result = await servicesService.createPrescription(req.db, req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const patchRevisitDate = async (req, res) => {
  try {
    const { maPhieuDV, ngayTaiKham } = req.body;
    
    if (!maPhieuDV || !ngayTaiKham) {
      return res.status(400).json({ error: 'Thiếu mã phiếu hoặc ngày tái khám' });
    }

    const result = await servicesService.updateRevisitDate(req.db, maPhieuDV, ngayTaiKham);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};