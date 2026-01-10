import express from 'express';
import * as CartController from '../controllers/cart.controller.js';
import { authenticate } from '../middlewares/authentication.middleware.js';
import { dbMiddleware } from '../config/sqlserver.config.js';

const router = express.Router();

// Apply DB and Auth middleware to all cart routes
router.use(dbMiddleware);
router.use(authenticate);

router.get('/', CartController.getCart);
router.post('/add', CartController.addToCart);
router.post('/remove', CartController.removeFromCart);
router.post('/checkout', CartController.checkout);

export default router;
