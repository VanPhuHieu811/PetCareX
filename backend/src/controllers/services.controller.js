import * as servicesService from '../services/services.service.js';

export const getDashboard = async (req, res) => {
  try {
    const { doctorId } = req.body; 
    if (!doctorId) return res.status(400).json({ error: 'Missing doctorId' });

    const data = await servicesService.getDoctorDashboard(req.db, doctorId);
    
    // Trả về đúng cấu trúc bạn cần
    res.status(200).json({
      success: true,
      dashboardStats: data.stats,
      queue: data.queue
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
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

export const patchExamDiagnosis = async (req, res) => {
  try {
    const result = await servicesService.updateExamDiagnosis(req.db, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getVaccines = async (req, res) => {
  try {
    const { branchId } = req.body;
    
    if (!branchId) {
      return res.status(400).json({ error: 'Thiếu mã chi nhánh (branchId)' });
    }

    const result = await servicesService.getVaccinesInStock(req.db, branchId);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const postExamAppointment = async (req, res) => {
  try {
    const result = await servicesService.createExamAppointment(req.db, req.body);
    res.status(201).json({
      success: true,
      message: 'Đặt lịch khám bệnh thành công',
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const postVaccineAppoint = async (req, res) => {
    try {
        const result = await servicesService.createVaccineAppointment(req.db, req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getServiceById = async (req, res) => {
  try {
    const { maPhieuDV } = req.body;
    const result = await servicesService.getServiceDetail(req.db, maPhieuDV);
    
    if (!result) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu' });
    }

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const patchCancelAppointment = async (req, res) => {
  try {
    const { maPhieuDV } = req.body;
    const result = await servicesService.cancelAppointment(req.db, maPhieuDV);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};