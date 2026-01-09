import * as productService from '../services/product.service.js';

export const getAllProducts = async (req, res) => {
  try {
    const pool = req.db;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await productService.getAllProducts(pool, page, limit, offset);

    return res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: error.message
    });
  }
}