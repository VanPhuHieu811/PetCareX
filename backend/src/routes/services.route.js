import express from 'express';
import * as servicesController from '../controllers/services.controller.js';

const router = express.Router();

// Endpoint: GET /api/v1/appointments/queue/NV0094
router.get('/dasboard', servicesController.getDashboard);
router.get('/exams/medicines', servicesController.getMedicines);
router.post('/exams/medicines', servicesController.postPrescription);
router.patch('/exams/revisit-date', servicesController.patchRevisitDate);
router.patch('/exams', servicesController.patchExamDiagnosis);
// Endpoint: GET /api/v1/services/vaccinations/vaccines
router.get('/vaccinations/vaccines', servicesController.getVaccines);
export default router;