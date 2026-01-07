import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import branchRoutes from './routes/branch.route.js';
import { dbMiddleware } from './config/sqlserver.config.js';

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(dbMiddleware);

app.use('/api/v1/branches', branchRoutes);

export default app;