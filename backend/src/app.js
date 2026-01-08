import 'dotenv/config';
import express from 'express';
import cors from 'cors';



import branchRoutes from './routes/branch.route.js';
import servicesRoutes from './routes/services.route.js';
import packagesRoutes from './routes/packages.route.js';


import { dbMiddleware } from './config/sqlserver.config.js';

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(dbMiddleware);


//branches
app.use('/api/v1/branches', branchRoutes);

//services
app.use('/api/v1/services', servicesRoutes);

//packages
app.use('/api/v1/packages', packagesRoutes);

export default app;