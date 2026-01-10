import express from 'express'
const router = express.Router()

import * as productController from '../controllers/product.controller.js'

router.get('/', productController.getAllProducts) // api/v1/products?page=1&limit=10

export default router