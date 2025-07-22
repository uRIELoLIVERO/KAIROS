import z from 'zod'
import { phoneNumberSchema } from './phoneNumber.js'
import { globalRoleSchema } from './globalRole.js'

const UserGlobalRoleEnum = ["PROFESSIONAL", "ADMIN"];

export const userSchema = z.object({
    id: z.string().uuid('Invalid UUID format'),
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
    phoneNumber: phoneNumberSchema,
    password: z.string().min(6, 'Contraseña must be at least 6 characters long'),
    globalRole: globalRoleSchema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    deletedAt: z.string().datetime().optional().nullable()
})