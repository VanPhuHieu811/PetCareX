import express from 'express';
import * as packagesController from '../controllers/packages.controller.js';

const router = express.Router();

router.get('/register', packagesController.getInfoPackages);
router.get('/packages', packagesController.getPackages);
router.post('/register', packagesController.postRegisterPackage);
router.post('/schedule', packagesController.postPackageSchedule);

export default router;