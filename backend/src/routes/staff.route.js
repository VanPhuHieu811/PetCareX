import express from 'express';
import * as staffController from '../controllers/staff.controller.js';
import { authenticate } from '../middlewares/authentication.middleware.js';
import { authorizeManager } from '../middlewares/authorization.middleware.js';

const router = express.Router();

router.get('/', authenticate, authorizeManager, staffController.getAllStaff);

router.get('/count', staffController.countAllStaff);

router.post('/deployment', authenticate, authorizeManager, staffController.staffDeployment);

router.get('/deployment/:staffId', authenticate, authorizeManager, staffController.getStaffDeployments);

router.patch('/remove', authenticate, authorizeManager, staffController.staffQuitJob);

router.get('/profile',authenticate, staffController.getMyProfile);

router.patch('/profile',authenticate, staffController.updateMyProfile);

export default router;