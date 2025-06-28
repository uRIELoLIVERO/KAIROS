import z from 'zod'
import permissionSchema from './permission.js'

export const roleSchema = z.object({
    name: z.string().min(3, 'Role name is required'),
    description: z.string('Description is required'),
    permissions: z.array(permissionSchema).nonempty('At least one permission is required')
})