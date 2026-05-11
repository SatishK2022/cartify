import { z } from "zod";

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(3).max(50),
    }),
})

export const updateCategorySchema = z.object({
    body: z.object({
        name: z.string().min(3).max(50).optional(),
    }),
})

export const deleteCategorySchema = z.object({
    params: z.object({
        id: z.uuid(),
    })
})

export const getCategorySchema = z.object({
    params: z.object({
        id: z.uuid(),
    })
})

export const getCategoriesSchema = z.object({
    query: z.object({
        limit: z.string().optional(),
        page: z.string().optional(),
    })
})


export type CreateCategoryInput = z.output<typeof createCategorySchema>["body"];
export type UpdateCategoryInput = z.output<typeof updateCategorySchema>["body"];
export type DeleteCategoryInput = z.output<typeof deleteCategorySchema>["params"];
export type GetCategoryInput = z.output<typeof getCategorySchema>["params"];
export type GetCategoriesInput = z.output<typeof getCategoriesSchema>["query"];
