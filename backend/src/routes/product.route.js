import express from 'express'
const router = express.Router()

import * as productController from '../controllers/product.controller.js'

router.get('/', productController.getAllProducts) // api/v1/products?page=1&limit=10
router.get('/branch', productController.getBranchProduct) // api/v1/products/branch?branchId=CN001&page=1&limit=10
router.get('/latestid', productController.getLatestProductsId) // api/v1/products/latest
router.get('/countall', productController.countAllProducts) // api/v1/products/count
router.get('/countbranch', productController.countBranchProducts) // api/v1/products/countbranch?branchId=CN001

router.post('/branch', productController.addProductToBranch) // api/v1/products/branch
router.delete('/branch', productController.deleteProductFromBranch) // api/v1/products/branch
router.put('/branch/stock', productController.addBranchProductStock) // api/v1/products/branch/stock

export default router