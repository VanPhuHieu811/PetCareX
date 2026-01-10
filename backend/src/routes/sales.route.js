import express from 'express';
import salesController from '../controllers/sales.controller.js';

const router = express.Router();

// GET /api/v1/sales/invoices
router.get('/invoices', salesController.getInvoices);
router.get('/sales-daily', salesController.getSalesStats)
export default router;