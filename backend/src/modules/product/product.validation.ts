import { z } from "zod";

export const productImageSchema = z.object({
    url: z.string(),
    fileId: z.string(),
    
    isPrimary: z.boolean().default(false),
    sortOrder: z.number().default(0),
})

export const createProductSchema = z.object({
    body: z.object({
        title: z.string().min(3).max(50),
        description: z.string().optional(),
        price: z.coerce.number().positive(),
        discountPrice: z.coerce.number().positive().optional(),
        brand: z.string().optional(),
        stock: z.coerce.number().int().min(0),
        categoryId: z.uuid(),
    }),
}).refine((data) => {
    if (data.body.discountPrice && data.body.price && data.body.discountPrice >= data.body.price) {
        return false;
    }

    return true;
}, {
    message: "Discounted price must be less than the regular price",
    path: ["body", "discountPrice"]
});

export const updateProductSchema = z.object({
    body: z.object({
        title: z.string().min(3).max(50).optional(),
        description: z.string().optional(),
        price: z.coerce.number().positive().optional(),
        discountPrice: z.coerce.number().positive().optional(),
        brand: z.string().optional(),
        stock: z.coerce.number().int().min(0).optional(),
        categoryId: z.uuid().optional(),
    }),
}).refine((data) => {
    if (data.body.discountPrice && data.body.price && data.body.discountPrice >= data.body.price) {
        return false;
    }

    return true;
}, {
    message: "Discounted price must be less than the regular price",
    path: ["body", "discountPrice"]
});

export const deleteProductSchema = z.object({
    params: z.object({
        id: z.uuid(),
    })
})

export const deletePermanentlyProductSchema = z.object({
    params: z.object({
        id: z.uuid(),
    })
})

export const getProductSchema = z.object({
    params: z.object({
        id: z.uuid(),
    })
})

export const getProductsSchema = z.object({
    query: z.object({
        limit: z.coerce.number().optional(),
        page: z.coerce.number().optional(),
        search: z.string().optional(),
        categoryId: z.string().optional(),
    })
})


export type CreateProductInput = z.infer<typeof createProductSchema>["body"];
export type UpdateProductInput = z.infer<typeof updateProductSchema>["body"];
export type DeleteProductInput = z.infer<typeof deleteProductSchema>["params"];
export type DeletePermanentlyProductInput = z.infer<typeof deletePermanentlyProductSchema>["params"];
export type GetProductInput = z.infer<typeof getProductSchema>["params"];
export type GetProductsInput = z.infer<typeof getProductsSchema>["query"];
