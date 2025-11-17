import z from 'zod';

export const serviceSchema = z.object({
    id: z.string().uuid("Invalid UUID format"),
    name: z.string().min(3, "Service name must be at least 3 characters long"),
    description: z.string().optional(),
    suggestedPrice: z.number().positive("Price must be a positive number"),
    suggestedDuration: z.number().int().positive("Duration must be a positve integer"),
    suggestedBuffer: z.number().int().min(0, "Buffer must be a non-negative integer").optional(),
    companyId: z.string().uuid('Invalid UUID format'),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    deletedAt: z.string().datetime().optional().nullable()    
})

export function validateService (object) {
  return serviceSchema.safeParse(object)
}

export function validatePartialService (object) {
  return serviceSchema.partial().safeParse(object)
}