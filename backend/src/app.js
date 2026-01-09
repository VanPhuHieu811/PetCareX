import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import branchRoutes from './routes/branch.route.js';
import doctorRoutes from './routes/doctor.route.js';
import { dbMiddleware } from './config/sqlserver.config.js';
import authRoutes from './routes/auth.route.js';
import vacxinRoutes from './routes/vacxin.route.js';

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(dbMiddleware);

app.use('/api/v1/branches', branchRoutes);
app.use('/api/v1/doctors', doctorRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vacxin', vacxinRoutes);

export default app;