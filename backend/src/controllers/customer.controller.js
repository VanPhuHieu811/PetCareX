import * as customerService from '../services/customer.service.js';

export const getAllCustomers = async (req, res) => {
  try {
    const pool = req.db;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const result = await customerService.getAllCustomers(pool, page, limit, offset)

    return res.status(200).json({
      success: true,
      message: 'Customers retrieved successfully',
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve customers',
      error: err.message,
    });
  }
}

export const getCurrentCustomer = async (req, res) => {
  const customerId = req.user.id; // MaKH
  try {
    const pool = req.db;
    const customer = await customerService.getCurrentCustomer(pool, customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Customer retrieved successfully',
      data: customer,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve customer',
      error: err.message,
    });
  }
}

export const updateCurrentCustomer = async (req, res) => {
  const pool = req.db;
  const customerId = req.user.id;

  const { HoTen, NgaySinh, GioiTinh, SDT, CCCD } = req.body;

  const updateData = {
    HoTen: HoTen || undefined,
    NgaySinh: NgaySinh || undefined,
    GioiTinh: GioiTinh || undefined,
    SDT: SDT || undefined,
    CCCD: CCCD || undefined,
  };

  const customer = await customerService.updateCurrentCustomer(pool, customerId, updateData);

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: 'Customer not found',
    });
  }
  
  return res.status(200).json({
    success: true,
    message: 'Customer updated successfully',
    data: customer,
  });

}

export const getCustomerReceipts = async (req, res) => {
  const pool = req.db;
  const customerId = req.user.id;

  try {
    const receipts = await customerService.getCustomerReceipts(pool, customerId);

    return res.status(200).json({
      success: true,
      message: 'Receipts retrieved successfully',
      data: receipts,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve receipts',
      error: err.message,
    });
  }
}