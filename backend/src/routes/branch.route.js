import express from 'express';
import * as branchController from '../controllers/branch.controller.js';
import { authenticate } from '../middlewares/authentication.middleware.js';

    const router = express.Router();

router.get('/', branchController.getAllBranches);
router.get('/revenue', branchController.getBranchRevenue);
router.get('/usage', branchController.getBranchServiceUsage);
router.get('/daterevenue', branchController.getDateStatistics);
router.get('/staff-branch', authenticate, branchController.getStaffBranch);
router.get('/customer-list', branchController.getBranchCustomerList);
router.get('/customer-count', branchController.countAllCustomersInBranch);
router.get('/vip-customer-count', branchController.countVIPCustomersInBranch);

export default router;