import z from 'zod'

import { roleSchema } from './role.js'
import { availabilitySchema } from './availability.js'
import { availabilityExceptionSchema } from './availabilityException.js'

export const staffMemberSchema = z.object({
    id: z.string().uuid("Invalid UUID format"),
    companyId: z.string().uuid("Invalid UUID format"),
    professionalId: z.string().uuid("Invalid UUID format"),
    roleId: z.number().int().optional(),
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