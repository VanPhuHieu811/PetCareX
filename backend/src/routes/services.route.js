import express from 'express';
import * as servicesController from '../controllers/services.controller.js';

const router = express.Router();

// Endpoint: GET /api/v1/appointments/queue/NV0094
router.get('/queue', servicesController.getQueue);
router.get('/medicines', servicesController.getMedicines);
router.post('/prescriptions', servicesController.postPrescription);
router.patch('/revisit-date', servicesController.patchRevisitDate);

export default router;