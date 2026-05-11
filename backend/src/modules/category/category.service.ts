import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/api-error";
import { generateSlug } from "../../utils/helper";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.validation";

const categorySelect = {
    id: true,
    name: true,
    slug: true,
    createdAt: true,
};


export const createCategory = async (payload: CreateCategoryInput) => {
    const { name } = payload

    const slug = generateSlug(name);

    const existingCategory = await prisma.category.findFirst({
        where: {
            slug,
            isDeleted: false
        }
    })

    if (existingCategory) {
        throw new ApiError(409, "Category already exists");
    }

    const category = await prisma.category.create({
        data: {
            name,
            slug
        },
        select: categorySelect
    })

    return category
}


export const getCategories = async ({ page = 1, limit = 10 }: { page: number, limit: number }) => {
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
        prisma.category.findMany({
            where: {
                isDeleted: false
            },
            select: categorySelect,
            orderBy: {
                name: "asc"
            },
            skip,
            take: limit
        }),
        prisma.category.count()
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        categories,
        meta: {
            page: page,
            limit: limit,
            total,
            totalPages
        }
    }
}

export const getTrashCategories = async () => {
    const categories = await prisma.category.findMany({
        where: {
            isDeleted: true
        },
        select: categorySelect
    })

    return categories
}


export const getCategory = async (categoryId: string) => {
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId,
            isDeleted: false
        },
        select: categorySelect
    })

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return category
}


export const updateCategory = async (categoryId: string, payload: UpdateCategoryInput) => {
    const { name } = payload;

    const slug = generateSlug(name as string);

    const existingCategory = await prisma.category.findFirst({
        where: {
            slug,
            isDeleted: false,
            NOT: {
                id: categoryId
            }
        }
    })

    if (existingCategory) {
        throw new ApiError(409, "Category already exists with this name");
    }

    try {
        const updatedCategory = await prisma.category.update({
            where: {
                id: categoryId
            },
            data: {
                name,
                slug
            },
            select: categorySelect
        })

        return updatedCategory
    } catch (error) {
        throw new ApiError(404, "Category not found");
    }
}


export const deleteCategory = async (categoryId: string) => {
    try {
        await prisma.category.update({
            where: {
                id: categoryId
            },
            data: {
                isDeleted: true
            }
        })
    } catch (error) {
        throw new ApiError(404, "Category not found");
    }
}
