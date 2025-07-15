import z from 'zod'
import phoneSchema from './phoneNumber.js'

const UserGlobalRoleEnum = ["PROFESSIONAL", "ADMIN"];

export const userSchema = z.object({
    id: z.string().uuid('Invalid UUID format'),
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
    email: z.string().email('Invalid email format'),
    phoneNumber: phoneSchema,
    password: z.string().min(6, 'Contraseña must be at least 6 characters long'),
    globalRole: z.enum(UserGlobalRoleEnum)
})