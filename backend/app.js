import express from 'express'

import { appointmentsRouter } from './routes/appointments.js'
import { companiesRouter } from './routes/companies.js '

import { Temporal } from '@js-temporal/polyfill'
globalThis.Temporal = Temporal

const app = express()
app.use(express.json())
app.disable('x-powered-by')

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Kairos App!' })
})

app.use('/appointments', appointmentsRouter)
app.use('/companies', companiesRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
