import z from 'zod'
import { phoneNumberSchema } from './phoneNumber.js'
import { randomUUID } from 'crypto'

export const clientSchema = z.object({
  id: z.string().uuid("Invalid UUID format").default(() => randomUUID()),
  firstName: z.string()
    .min(1, "Name is required")
    .refine(val => /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(val), {
      message: "Name must not contain numbers or symbols",
    }),
  lastName: z.string()
    .min(1, "Last name is required")
    .refine(val => /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(val), {
      message: "Last name must not contain numbers or symbols",
    }),
  email: z.string().email('Invalid email format'),
  phoneNumber: phoneNumberSchema
})

export function validateClient (object) {
  return clientSchema.safeParse(object)
}

export function validatePartialClient (object) {
  return clientSchema.partial().safeParse(object)
}