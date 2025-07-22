import z from 'zod'

export const roleSchema = z.object({
    id: z.number().int().positive(), 
    name: z.string().min(3, 'Role name is required'),
    description: z.string('Description is required'),
})