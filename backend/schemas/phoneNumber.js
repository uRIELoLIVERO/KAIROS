import z from 'zod'

export const phoneNumberSchema = z.string().trim().refine((value) => {
  // Acepta entre 8 y 20 dígitos numéricos
  return /^\d{8,20}$/.test(value)
}, {
  message: 'Invalid phone number format, must contain only digits (8 to 20 characters)'
})
