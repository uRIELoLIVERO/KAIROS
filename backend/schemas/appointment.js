import z from "zod";
import { clientSchema } from "./client.js";

const appointmentStatus = ["PENDING", "CONFIRMED", "CANCELLED"]

const appointmentSchema = z.object({
    id: z.string().uuid("Invalid UUID format"),
    creationDateTime: z.string().datetime("Invalid date format"),
    appoinmentDateTime: z.string().datetime("Invalid date format"),
    status: z.enum(appointmentStatus),
    offeredServiceId: z.string().uuid("Invalid UUID format"),
    client: clientSchema,
})

export function validateAppointment (object) {
  return appointmentSchema.safeParse(object)
}

export function validateParcialAppointment (object) {
  return appointmentSchema.partial().safeParse(object)
}