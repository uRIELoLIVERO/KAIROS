import z from 'zod'

import { roleSchema } from './role.js'
import { availabilitySchema } from './availability.js'
import { availabilityExceptionSchema } from './availabilityException.js'

export const staffMemberSchema = z.object({
    id: z.string().uuid("Invalid UUID format"),
    companyID: z.string().uuid("Invalid UUID format"),
    ProfessionalID: z.string().uuid("Invalid UUID format"),
    role: z.array(roleSchema),
    availability: z.array(availabilitySchema),
    availabilityException: z.array(availabilityExceptionSchema)
})

export function validateStaffMember (object) {
  return staffMemberSchema.safeParse(object)
}

export function validateParcialStaffMember (object) {
  return staffMemberSchema.parcial().safeParse(object)
}