import z from 'zod';

export const timeSlotSchema = z.object({
    id: z.number().int().positive(), 
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be in HH:MM format"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "End time must be in HH:MM format"),
    availabilityDayId: z.number().int().positive("Availability Day ID must be a positive integer"),
})

export function validateTimeSlot(data) {
    return timeSlotSchema.safeParse(data);
}

export function validatePartialTimeSlot(data) {
    return timeSlotSchema.partial().safeParse(data);
}