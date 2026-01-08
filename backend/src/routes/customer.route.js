import express from 'express'
const router = express.Router();

import { authenticate } from '../middlewares/authentication.middleware.js';
import { authorizeManagerAndReceptionist } from '../middlewares/authorization.middleware.js';
import * as customerController from '../controllers/customer.controller.js';

router.get('/', authenticate, authorizeManagerAndReceptionist, customerController.getAllCustomers); // api/v1/customers?page=1&limit=10
router.get('/me', authenticate, customerController.getCurrentCustomer) // api/v1/customers/me
router.put('/me', authenticate, customerController.updateCurrentCustomer) // api/v1/customers/me
router.get('/receipts', authenticate, customerController.getCustomerReceipts) // api/v1/customers/receipts
router.get('/receipts/:receiptId', authenticate, customerController.getReceiptDetails) // api/v1/customers/receipts/:receiptId

export default router;