import z, { custom } from 'zod';

export const offeredServiceSchema = z.object({
    id: z.string().uuid("Invalid UUID format"),
    serviceId: z.string().uuid("Invalid UUID format"),
    staffMemberId: z.string().uuid("Invalid UUID format"),
    customDescription: z.string().optional(),
    customPrice: z.number().positive("Custom price must be a positive number").optional(),
    customDuration: z.number().int().positive("Custom duration must be a positive integer").optional(),
    customBuffer: z.number().int().min(0, "Custom buffer must be a non-negative integer").optional(),
    deletedAt: z.string().datetime().optional().nullable() 
})

export function validateOfferedService(object) {
    return offeredServiceSchema.safeParse(object)
}

export function validatePartialOfferedService(object) {
    return offeredServiceSchema.partial().safeParse(object)
}