import express from 'express';
import BranchController from '../controllers/branch.controller.js';

const router = express.Router();

router.get('/', BranchController.getAllBranches);
export default router;