import z from 'zod'
import { phoneNumberSchema } from './phoneNumber.js'

export const clientSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .refine(val => /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(val), {
      message: "Name must not contain numbers or symbols",
    }),
  lastName: z.string()
    .min(1, "Last name is required")
    .refine(val => /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(val), {
      message: "Last name must not contain numbers or symbols",
    }),
    phoneNumber: phoneNumberSchema,
    email: z.string().email('Invalid email format')
})

export function validateClient (object) {
  return clientSchema.safeParse(object)
}

export function validatePartialClient (object) {
  return clientSchema.partial().safeParse(object)
}