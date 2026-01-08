import express from 'express';
import * as branchController from '../controllers/branch.controller.js';

const router = express.Router();

router.get('/', branchController.getAllBranches);

export default router;