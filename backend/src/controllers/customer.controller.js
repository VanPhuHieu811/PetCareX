import * as customerService from '../services/customer.service.js';

export const getAllCustomers = async (req, res) => {
  try {
    const pool = req.db;
    let page = parseInt(req.query.page, 10);
    let limit = parseInt(req.query.limit, 10);

    // Normalize pagination parameters
    if (Number.isNaN(page) || page < 1) {
      page = 1;
    }

    if (Number.isNaN(limit) || limit < 1) {
      limit = 10;
    } else if (limit > 100) {
      limit = 100;
    }
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
    HoTen: HoTen !== undefined && HoTen !== null ? HoTen : undefined,
    NgaySinh: NgaySinh !== undefined && NgaySinh !== null ? NgaySinh : undefined,
    GioiTinh: GioiTinh !== undefined && GioiTinh !== null ? GioiTinh : undefined,
    SDT: SDT !== undefined && SDT !== null ? SDT : undefined,
    CCCD: CCCD !== undefined && CCCD !== null ? CCCD : undefined,
  };

  try {
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
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update customer',
      error: err.message,
    });
  }
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

export const getReceiptDetails = async (req, res) => {
  const pool = req.db;
  const customerId = req.user.id;
  const receiptId = req.params.receiptId;

  try {
    const receiptDetails = await customerService.getReceiptDetails(pool, receiptId, customerId);

    if (!receiptDetails) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Receipt details retrieved successfully',
      data: receiptDetails,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve receipt details',
      error: err.message,
    });
  }
}