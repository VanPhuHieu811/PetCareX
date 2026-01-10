import express from 'express';
import receptionController from '../controllers/reception.controller.js';

const router = express.Router();
router.post('/', receptionController.addCustomer);
router.get('/', receptionController.getCustomerDetails);
router.get('/stats',receptionController.getCustomerStatistics)
router.get('/appointments', receptionController.getAppointmentBoard);
router.get('/available-doctors', receptionController.getFreeDoctors);
router.get('/pet-history/:maTC', receptionController.getPetHistory);

export default router;