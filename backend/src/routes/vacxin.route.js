import express from 'express';
import * as vacxinController from '../controllers/vacxin.controller.js';

const router = express.Router();

router.get('/', vacxinController.getAllVacxins);
router.post('/', vacxinController.addVaccine);
router.get('/branch', vacxinController.getVacxinsByBranch);
router.post('/branch', vacxinController.addVacxinToBranch);
router.delete('/branch', vacxinController.deleteVacxinByBranch);
router.get('/branch/use-rate', vacxinController.getBranchVacxinUseRate);
export default router;