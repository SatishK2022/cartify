import { z } from "zod";


export const getCartSchema = z.object({})

export const addProductToCartSchema = z.object({
    body: z.object({
        productId: z.uuid(),
        quantity: z.number().int().min(1),
    }),
})

export const updateProductInCartSchema = z.object({
    params: z.object({
        id: z.uuid(),
    }),
    body: z.object({
        quantity: z.number().int().min(1),
    }),
})

export const deleteProductFromCartSchema = z.object({
    params: z.object({
        id: z.uuid(),
    })
})

export const clearCartSchema = z.object({})


export type AddProductToCartInput = z.infer<typeof addProductToCartSchema>["body"];
export type UpdateProductInCartInput = z.infer<typeof updateProductInCartSchema>["params"] & z.infer<typeof updateProductInCartSchema>["body"];
export type DeleteProductFromCartInput = z.infer<typeof deleteProductFromCartSchema>["params"];
