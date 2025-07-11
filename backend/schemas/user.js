import z from 'zod'
import phoneSchema from './phoneNumber.js'

const UserGlobalRoleEnum = ["PROFESSIONAL", "ADMIN"];

export const userSchema = z.object({
    id: z.string().uuid('Invalid UUID format'),
    name: z.string().min(3, 'Nombre is required'),
    lastname: z.string().min(4, 'Apellido is required'),
    email: z.string().email('Invalid email format'),
    phoneNumber: phoneSchema,
    password: z.string().min(6, 'Contraseña must be at least 6 characters long'),
    globalRole: z.enum(UserGlobalRoleEnum)
})