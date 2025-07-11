import z from 'zod'

export const phoneNumberSchema = z.string().trim().refine((value) => {
  // Requiere que empiece con "+" y tenga entre 10 y 15 dígitos (común en formatos internacionales)
  return /^\+\d{10,15}$/.test(value)
}, {
  message: 'Invalid phone number format, please use a valid format like +541234567890'
})
