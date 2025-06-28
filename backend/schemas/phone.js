import z from 'zod'
import parsePhoneNumberFromString from libphonenumber-js

export const phoneSchema = z.string().trim().refine((value) => {
    const phoneNumber = parsePhoneNumberFromString(value)
    return phoneNumber?.isValid ?? false
}, {
    message: 'Invalid phone number format, please use a valid format like +541234567890'
})