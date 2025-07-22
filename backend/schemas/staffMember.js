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
    availabilityException: z.array(availabilityExceptionSchema),
    deletedAt: z.string().datetime().optional().nullable() 
})

export function validateStaffMember (object) {
  return staffMemberSchema.safeParse(object)
}

export function validatePartialStaffMember (object) {
  return staffMemberSchema.partial().safeParse(object)
}