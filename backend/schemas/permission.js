import z from 'zod'

export const permissionSchema = z.object({
    name: z.string().min(3, 'Permission name is required')
})