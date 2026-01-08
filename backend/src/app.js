import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { dbMiddleware } from './config/sqlserver.config.js';

import branchRoutes from './routes/branch.route.js';
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(dbMiddleware);

app.use('/api/v1/branches', branchRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);

export default app;