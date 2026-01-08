import express from 'express';
import * as doctorController from '../controllers/doctor.controller.js';

const router = express.Router();

router.get('/statistics', doctorController.getDoctorStatistics);

export default router;