import { z } from "zod";

export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(3).max(50).optional(),
        phone: z.string().optional(),
        avatar: z.string().optional(),
    }),
})

export const createAddressSchema = z.object({
    body: z.object({
        fullName: z.string(),
        phone: z.string().min(10).max(15),
        addressLine1: z.string(),
        addressLine2: z.string().optional(),
        city: z.string(),
        state: z.string(),
        pincode: z.string().length(6),
        country: z.string().min(2),
        isDefault: z.boolean().default(false),
    })
})

export const getAddressSchema = z.object({
    params: z.object({
        id: z.uuid(),
    })
})

export const updateAddressSchema = z.object({
    body: z.object({
        fullName: z.string().optional(),
        phone: z.string().min(10).max(15).optional(),
        addressLine1: z.string().optional(),
        addressLine2: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        pincode: z.string().length(6).optional(),
        country: z.string().min(2).optional(),
        isDefault: z.boolean().optional(),
    }).refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required"
        }
    ),

    params: z.object({
        id: z.uuid(),
    })
});

export const deleteAddressSchema = z.object({
    params: z.object({
        id: z.uuid(),
    })
})


export type UpdateProfileInput = z.output<typeof updateProfileSchema>["body"];
export type CreateAddressInput = z.output<typeof createAddressSchema>["body"];
export type UpdateAddressInput = z.output<typeof updateAddressSchema>["body"];
