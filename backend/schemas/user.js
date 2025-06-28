import z from 'zod'
import roleSchema from './role.js'
import phoneSchema from './phone.js'

const userSchema = z.object({
    name: z.string().min(3, 'Nombre is required'),
    lastname: z.string().min(4, 'Apellido is required'),
    email: z.string().email('Invalid email format'),
    phoneNumber: phoneSchema,
    password: z.string().min(6, 'Contraseña must be at least 6 characters long'),
    role: roleSchema 
})