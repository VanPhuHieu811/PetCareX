import express from 'express';
import invoiceController from '../controllers/invoice.controller.js';

const router = express.Router();

router.get('/full', invoiceController.getFullDetails);
router.get('/grouped', invoiceController.getGroupedDetails);
router.get('/summary', invoiceController.getInvoiceSummary);

export default router;