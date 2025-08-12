import express from 'express';

import { appointmentsRouter } from './routes/appointments.js';
import { companiesRouter } from './routes/companies.js';
import { offeredServicesRouter } from './routes/offeredServices.js';
import { professionalsRouter } from './routes/professionals.js';
import { servicesRouter } from './routes/services.js';
import { staffMemberRouter } from './routes/staffMember.js';
import { availabilitiesRouter } from './routes/availabilities.js';
import { availabilityExceptionsRouter } from './routes/availabilityExceptions.js';
import { authRouter } from './routes/auth.js';
import { paymentsRouter } from './routes/payments.js';

import { sequelize } from './models/sequelize/sequelize.js';

import { Temporal } from '@js-temporal/polyfill';
globalThis.Temporal = Temporal;

import cookieParser from 'cookie-parser';

import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.disable('x-powered-by');

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Kairos App!' });
});

app.use('/appointments', appointmentsRouter);
app.use('/companies', companiesRouter);
app.use('/offered-services', offeredServicesRouter);
app.use('/professionals', professionalsRouter);
app.use('/services', servicesRouter);
app.use('/staff-members', staffMemberRouter);
app.use('/availabilities', availabilitiesRouter);
app.use('/availability-exceptions', availabilityExceptionsRouter);
app.use('/auth', authRouter);
app.use('/payments', paymentsRouter);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection established successfully');

    await sequelize.sync({ alter: true });
    console.log('✅ All models were synchronized successfully.');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
}

startServer();
