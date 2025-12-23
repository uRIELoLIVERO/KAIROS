import z from 'zod';

export const companyWorkingHoursSchema = z.object({
    id: z.number().int().positive(),
    companyId: z.string().uuid("Invalid UUID format"),
    dayOfWeek: z.number().int().min(0).max(6, "Day of week must be between 0 (Sunday) and 6 (Saturday)"),
    openingTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Invalid time format, expected HH:MM"),
    closingTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Invalid time format, expected HH:MM")
})

export function validateCompanyWorkingHours(data) {
    return companyWorkingHoursSchema.safeParse(data);
}

export function validatePartialCompanyWorkingHours(data) {
    return companyWorkingHoursSchema.partial().safeParse(data);
}