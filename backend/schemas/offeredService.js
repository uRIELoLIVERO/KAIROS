import z from 'zod';

const OfferedServiceSchema = z.object({
    id: z.string().uuid("Invalid UUID format"),
    serviceID: z.string().uuid("Invalid UUID format"),
    professionalID: z.string().uuid("Invalid UUID format"),
    customDescription: z.string().optional(),
    customPrice: z.number().positive("Custom price must be a positive number").optional(),
    customDuration: z.number().int().positive("Custom duration must be a positive integer").optional(),
})