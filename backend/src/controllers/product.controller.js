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

export const getBranchProduct = async (req, res) => {
	try {
		const pool = req.db;
		const branchId = req.query.branchId;
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const result = await productService.getBranchProduct(pool, page, limit, branchId);
		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json({ error: 'Failed to retrieve products by branch', details: error.message });
	}
};

export const addProductToBranch = async (req, res) => {
	try {
		const pool = req.db;
		const { branchId, productId, tonKho } = req.body;
		await productService.addProductToBranch(pool, branchId, productId, tonKho);
		return res.status(200).json({ message: 'Product added to branch successfully' });
	} catch (error) {
		return res.status(500).json({ error: 'Failed to add product to branch', details: error.message });
	}
};

export const deleteProductFromBranch = async (req, res) => {
	try {
		const pool = req.db;
		const { branchId, productId } = req.body;
		await productService.deleteProductFromBranch(pool, branchId, productId);
		return res.status(200).json({ message: 'Product deleted from branch successfully' });
	}
	catch (error) {
		return res.status(500).json({ error: 'Failed to delete product from branch', details: error.message });
	}
};
export const recoverProductToBranch = async (req, res) => {
	try {
		const pool = req.db;
		const { branchId, productId } = req.body;
		await productService.recoverProductToBranch(pool, branchId, productId);
		return res.status(200).json({ message: 'Product recovered to branch successfully' });
	}	
	catch (error) {
		return res.status(500).json({ error: 'Failed to recover product to branch', details: error.message });
	}
};

export const addBranchProductStock = async (req, res) => {
	try {
		const pool = req.db;
		const { branchId, productId, quantity } = req.body;
		await productService.addBranchProductStock(pool, branchId, productId, quantity);
		return res.status(200).json({ message: 'Branch product stock updated successfully' });
	}
	catch (error) {
		return res.status(500).json({ error: 'Failed to update branch product stock', details: error.message });
	}
};

export const countBranchProducts = async (req, res) => {
	try {
		const pool = req.db;
		const branchId = req.query.branchId;
		const count = await productService.countBranchProducts(pool, branchId);
		return res.status(200).json({ totalProducts: count });
	}
	catch (error) {
		return res.status(500).json({ error: 'Failed to count branch products', details: error.message });
	}
};

export const countAllProducts = async (req, res) => {
	try {
		const pool = req.db;
		const count = await productService.countAllProducts(pool);
		return res.status(200).json({ totalProducts: count });
	} catch (error) {
		return res.status(500).json({ error: 'Failed to count products', details: error.message });
	}
};

export default {
	getAllProducts,
	getBranchProduct,
	addProductToBranch,
	deleteProductFromBranch,
	recoverProductToBranch,
	addBranchProductStock,
	countBranchProducts,
	countAllProducts
};