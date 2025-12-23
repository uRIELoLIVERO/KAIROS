import z from 'zod';
import { serviceSchema } from './service.js';
import { availabilitySchema } from './availability.js';
import { availabilityExceptionSchema } from './availabilityException.js';

const companySchema = z.object({
    id: z.string().uuid('ID must be a valid UUID'),
    name: z.string().min(3, "Name must be at least 3 characters long"),
    icon: z.any().optional(),
    location: z.string('Location must be a string'),
    services: z.array(serviceSchema, 'Services must be an array of serviceSs'),
    availability: z.array(availabilitySchema, 'Availability must be an array of availability objects'),
    availabilityException: z.array(availabilityExceptionSchema, 'Availability exceptions must be an array of availability exception objects'),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    deletedAt: z.string().datetime().optional().nullable()
})

export function validateCompany (object) {
  return companySchema.safeParse(object)
}

export function validatePartialCompany (object) {
  return companySchema.partial().safeParse(object)
}