import * as productService from '../services/product.service.js';

export const getAllProducts = async (req, res) => {
  try {
    const pool = req.db;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;

    // Lấy từ khóa tìm kiếm từ query param (?search=...)
    const keyword = req.query.search || '';
    const category = req.query.category || ''; // Lấy category filter

    // Truyền thêm keyword và category vào service
    const result = await productService.getAllProducts(pool, page, limit, offset, keyword, category);

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