import z from 'zod'
import { phoneNumberSchema } from './phoneNumber.js'

export const clientSchema = z.object({
    name: z.string().min(3, 'Nombre is required'),
    lastName: z.string().min(4, 'Apellido is required'),
    phoneNumber: phoneNumberSchema,
    email: z.string().email('Invalid email format')
})

export function validateClient (object) {
  return clientSchema.safeParse(object)
}

export function validateParcialClient (object) {
  return clientSchema.parcial().safeParse(object)
}