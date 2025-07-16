import z from "zod";
import { clientSchema } from "./client.js";
import { statusSchema } from "./status.js";

const appointmentSchema = z.object({
    id: z.string().uuid("Invalid UUID format"),
    creationDateTime: z.string().datetime("Invalid date format"),
    appoinmentDateTime: z.string().datetime("Invalid date format"),
    status: statusSchema,
    offeredServiceId: z.string().uuid("Invalid UUID format"),
    client: clientSchema,
})

export function validateAppointment (object) {
  return appointmentSchema.safeParse(object)
}

export function validatePartialAppointment (object) {
  return appointmentSchema.partial().safeParse(object)
}