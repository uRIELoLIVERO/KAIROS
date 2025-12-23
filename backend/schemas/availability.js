import { z } from 'zod';

export const availabilitySchema = z.object({
  id: z.number().int().positive("ID must be a positive integer"),
  staffMemberId: z.string().uuid("Invalid UUID format"),
  name: z.string().min(3, "Name must be at least 3 characters long").optional(),
});

export function validateAvailability(object) {
    return availabilitySchema.safeParse(object)
}

export function validatePartialAvailability(object) {
    return availabilitySchema.partial().safeParse(object)
}