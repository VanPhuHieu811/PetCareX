import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import receptionRoutes from './routes/reception.route.js';
import salesRoutes from './routes/sales.route.js';
import invoiceRoutes from './routes/invoice.route.js';
import petRoutes from './routes/pet.route.js';
import feedbackRoutes from './routes/feedback.route.js';
import { dbMiddleware } from './config/sqlserver.config.js';
import servicesRoutes from './routes/services.route.js';
import packagesRoutes from './routes/packages.route.js';
import branchRoutes from './routes/branch.route.js';
import doctorRoutes from './routes/doctor.route.js';
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import customerRoutes from './routes/customer.route.js';
import cartRoutes from './routes/cart.route.js';
import vacxinRoutes from './routes/vacxin.route.js';
import staffRoutes from './routes/staff.route.js';


const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(dbMiddleware);
app.use('/api/v1/feedback', feedbackRoutes);
app.use('/api/v1/sales', salesRoutes);
app.use('/api/v1/branches', branchRoutes);
app.use('/api/v1/reception', receptionRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/pets', petRoutes); 
app.use('/api/v1/doctors', doctorRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/carts', cartRoutes);

app.use('/api/v1/branches', branchRoutes);

app.use('/api/v1/reception', receptionRoutes);

app.use('/api/v1/invoices', invoiceRoutes);

app.use('/api/v1/pets', petRoutes); 

app.use('/api/v1/doctors', doctorRoutes);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);

app.use('/api/v1/customers', customerRoutes);
//services
app.use('/api/v1/services', servicesRoutes);
//packages
app.use('/api/v1/packages', packagesRoutes);

app.use('/api/v1/vacxin', vacxinRoutes);

app.use('/api/v1/staff', staffRoutes);
export default app;