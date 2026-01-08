import express from 'express';
import * as servicesController from '../controllers/services.controller.js';

const router = express.Router();

// Endpoint: GET /api/v1/appointments/queue/NV0094
router.get('/dasboard', servicesController.getDashboard);
router.get('/exams/medicines', servicesController.getMedicines);
router.post('/exams/medicines', servicesController.postPrescription);
router.patch('/exams/revisit-date', servicesController.patchRevisitDate);
router.patch('/exams', servicesController.patchExamDiagnosis);

export default router;