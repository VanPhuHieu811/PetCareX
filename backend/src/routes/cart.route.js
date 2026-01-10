import express from 'express';
import * as CartController from '../controllers/cart.controller.js';
import { authenticate } from '../middlewares/authentication.middleware.js';
import { dbMiddleware } from '../config/sqlserver.config.js';

const router = express.Router();

router.use(dbMiddleware);

router.get('/', authenticate, CartController.getCart);
router.post('/add', authenticate, CartController.addToCart);
router.post('/remove', authenticate, CartController.removeFromCart);
router.post('/checkout', authenticate, CartController.checkout);

export default router;
