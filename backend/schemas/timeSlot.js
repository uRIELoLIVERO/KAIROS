import z from 'zod';

export const timeSlotSchema = z.object({
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be in HH:MM format"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "End time must be in HH:MM format"),
})