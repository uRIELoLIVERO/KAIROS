import z from "zod";
import { statusSchema } from "./status.js";

const appointmentSchema = z.object({
    id: z.string().uuid("Invalid UUID format"),
    appointmentDateTime: z.string().datetime("Invalid date format"),
    offeredServiceId: z.string().uuid("Invalid UUID format"),
    clientId: z.string().uuid("Invalid UUID format"),
    statusId: z.number().int().positive(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    canceledAt: z.string().datetime().optional().nullable()
})

export function validateAppointment (object) {
  return appointmentSchema.safeParse(object)
}

export function validatePartialAppointment (object) {
  return appointmentSchema.partial().safeParse(object)
}