import express from 'express';
import salesController from '../controllers/sales.controller.js';

const router = express.Router();

// GET /api/v1/sales/invoices
router.get('/invoices', salesController.getInvoices);

export default router;