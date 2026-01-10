import express from 'express';
import * as servicesController from '../controllers/services.controller.js';

const router = express.Router();

// Endpoint: GET /api/v1/appointments/queue/NV0094
router.get('/dasboard', servicesController.getDashboard);
router.get('/exams/medicines', servicesController.getMedicines);
router.post('/exams/medicines', servicesController.postPrescription);
router.patch('/exams/revisit-date', servicesController.patchRevisitDate);
router.patch('/exams', servicesController.patchExamDiagnosis);
router.post('/exams', servicesController.postExamAppointment);
router.post('/vaccinations', servicesController.postVaccineAppoint);
// Endpoint: GET /api/v1/services/vaccinations/vaccines
router.get('/vaccinations/vaccines', servicesController.getVaccines);
//Endpoint: get /api/v1/services
router.get('/', servicesController.getServiceById);
router.patch('/cancel', servicesController.patchCancelAppointment);
export default router;