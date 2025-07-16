import z from 'zod'
import userSchema from './user.js'


export const professionalSchema = userSchema.extend({
    bio: z.string().optional(),
    profilePricteure: z.string().url("Invalid URL format").optional(),
    specialties: z.array(z.string()).optional(),
})

export function validateProfessional (object) {
  return professionalSchema.safeParse(object)
}

export function validatePartialProfessional (object) {
  return professionalSchema.partial().safeParse(object)
}