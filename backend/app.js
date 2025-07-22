import express from 'express';

import { appointmentsRouter } from './routes/appointments.js';
import { companiesRouter } from './routes/companies.js';
import { offeredServicesRouter } from './routes/offeredServices.js';
import { professionalsRouter } from './routes/professionals.js';
import { servicesRouter } from './routes/services.js';
import { staffMemberRouter } from './routes/staffMember.js';
import { authRouter } from './routes/auth.js';

import { sequelize } from './models/sequelize/sequelize.js';

import { Temporal } from '@js-temporal/polyfill';
globalThis.Temporal = Temporal;

const app = express();
app.use(express.json());
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
app.use('/auth', authRouter);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection established successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
}

startServer();
