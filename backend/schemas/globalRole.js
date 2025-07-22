import z from 'zod'

export const statusEnum = z.enum(["PROFESSIONAL", "ADMIN"])

export const globalRoleSchema = z.object({
    id: z.number().int().positive(),
    name: statusEnum
})

export function validateGlobalRole(object){
    return globalRoleSchema.safeParse(object)
}

export function validatePartialGlobalRole(object){
    return globalRoleSchema.partial().safeParse(object)
}