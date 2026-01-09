import express from 'express';
import receptionController from '../controllers/reception.controller.js';

const router = express.Router();

// Endpoint: GET /api/v1/customers/:identifier
router.get('/', receptionController.getCustomerDetails);
router.get('/appointments', receptionController.getAppointmentBoard);
router.get('/available-doctors', receptionController.getFreeDoctors);

export default router;