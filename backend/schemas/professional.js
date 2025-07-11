import z from 'zod'
import userSchema from './user.js'
import roleSchema from './role.js'

const professionalSchema = userSchema.extend({
    role: roleSchema,
    availability: availabilitySchema,
    availabilityException: availabilityExceptionSchema
})

export function validateProfessional (object) {
  return professionalSchema.safeParse(object)
}

export function validateParcialProfessional (object) {
  return professionalSchema.parcial().safeParse(object)
}