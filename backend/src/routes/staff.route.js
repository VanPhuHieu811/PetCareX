import express from 'express';
import * as staffController from '../controllers/staff.controller.js';
import { authenticate } from '../middlewares/authentication.middleware.js';
import { authorizeManager } from '../middlewares/authorization.middleware.js';

const router = express.Router();

router.get('/',authenticate, authorizeManager, staffController.getAllStaff);

router.get('/profile',authenticate, staffController.getMyProfile);

router.patch('/profile',authenticate, staffController.updateMyProfile);

export default router;