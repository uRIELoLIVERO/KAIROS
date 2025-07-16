import z from 'zod';

export const serviceSchema = z.object({
    id: z.string().uuid("Invalid UUID format"),
    name: z.string().min(3, "Service name must be at least 3 characters long"),
    description: z.string().optional(),
    suggestedPrice: z.number().positive("Price must be a positive number"),
    suggestedDuration: z.number().int().positive("Duration must be a positve integer")
})

export function validateService (object) {
  return serviceSchema.safeParse(object)
}

export function validatePartialService (object) {
  return serviceSchema.partial().safeParse(object)
}