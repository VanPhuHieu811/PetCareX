import express from 'express';
import receptionController from '../controllers/reception.controller.js';

const router = express.Router();
router.post('/', receptionController.addCustomer);
router.get('/', receptionController.getCustomerDetails);
router.get('/stats',receptionController.getCustomerStatistics)
router.get('/appointments', receptionController.getAppointmentBoard);
router.get('/available-doctors', receptionController.getFreeDoctors);
router.get('/pet-history/:maTC', receptionController.getPetHistory);
router.post('/add-pet', receptionController.addPet);
router.post('/create-appointment', receptionController.createAppointment);
router.get('/species', receptionController.getPetSpecies);
router.get('/breeds', receptionController.getBreeds);

export default router;