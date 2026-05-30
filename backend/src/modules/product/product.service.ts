import { prisma } from "../../config/prisma";
import { deleteImage } from "../../services/delete-image.service";
import { uploadImage } from "../../services/upload.service";
import { ApiError } from "../../utils/api-error";
import { generateUniqueSlug } from "../../utils/helper";
import { CreateProductInput, GetProductsInput, UpdateProductInput } from "./product.validation";


export const createProduct = async (payload: CreateProductInput, files: Express.Multer.File[]) => {
    const { title, description, price, discountPrice, brand, stock, categoryId } = payload;

    if (!files?.length) {
        throw new ApiError(400, "At least one image is required");
    }

    const category = await prisma.category.findUnique({
        where: {
            id: categoryId
        },
        select: {
            id: true
        }
    });

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    let uploadedImages: {
        url: string;
        fileId: string;
        thumbnail: string;
        isPrimary: boolean;
        sortOrder: number;
    }[] = [];

    try {
        // upload images
        uploadedImages = await Promise.all(files.map(async (file, index) => {

            const uploaded = await uploadImage(file, "/products");

            return {
                url: uploaded.url || "",
                fileId: uploaded.fileId || "",
                thumbnail: uploaded.thumbnailUrl || "",
                isPrimary: index === 0,
                sortOrder: index
            };
        }));

        // generate unique slug
        const slug = await generateUniqueSlug(prisma.product, title);

        // create product
        const product = await prisma.product.create({
            data: {
                title,
                slug,
                description,
                price: Number(price),
                discountPrice: discountPrice ? Number(discountPrice) : null,
                brand,
                stock: Number(stock),
                categoryId,
                images: {
                    createMany: {
                        data: uploadedImages
                    }
                }
            },
            select: {
                title: true,
                slug: true,
                description: true,
                price: true,
                discountPrice: true,
                brand: true,
                stock: true,
                images: {
                    select: {
                        url: true,
                        fileId: true,
                        thumbnail: true,
                        isPrimary: true,
                        sortOrder: true
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            }
        });

        return product;
    } catch (error: any) {
        // cleanup uploaded images
        if (uploadedImages.length > 0) {
            await Promise.all(uploadedImages.map(async (image) => {
                try {
                    await deleteImage(image.fileId);
                } catch (err) {
                    console.log("Image cleanup failed:", err);
                }
            }));
        }

        throw error;
    }
};


// TODO: Update the Logic of Updating Product Images
export const updateProduct = async (id: string, payload: UpdateProductInput, files: Express.Multer.File[]) => {
    const { title, description, price, discountPrice, brand, stock, categoryId } = payload;

    // check product exists
    const existingProduct = await prisma.product.findUnique({
        where: {
            id
        },
        include: {
            images: true
        }
    });

    if (!existingProduct) {
        throw new ApiError(404, "Product not found");
    }

    if (files?.length > 0) {
        // upload images
        const uploadedImages = await Promise.all(files.map(async (file, index) => {
            const uploaded = await uploadImage(file, "/products");

            return {
                url: uploaded.url || "",
                fileId: uploaded.fileId || "",
                thumbnail: uploaded.thumbnailUrl || "",
                isPrimary: index === 0,
                sortOrder: index
            };
        }))

        // delete existing images
        await Promise.all(existingProduct.images.map(async (image) => {
            try {
                await deleteImage(image.fileId);
            } catch (err) {
                console.log("Image cleanup failed:", err);
            }
        }));

        // update product images
        await prisma.product.update({
            where: {
                id
            },
            data: {
                images: {
                    createMany: {
                        data: uploadedImages
                    }
                }
            }
        });
    }

    // validate category
    if (categoryId) {
        const category = await prisma.category.findUnique({
            where: {
                id: categoryId
            },
            select: {
                id: true
            }
        });

        if (!category) {
            throw new ApiError(404, "Category not found");
        }
    }

    // generate slug only if title exists
    let slug: string | undefined;

    if (title) {
        slug = await generateUniqueSlug(prisma.product, title);
    }

    // update product
    const product = await prisma.product.update({
        where: {
            id
        },
        data: {
            title,
            slug,
            description,
            price: price !== undefined ? Number(price) : undefined,
            discountPrice: discountPrice !== undefined ? Number(discountPrice) : undefined,
            brand,
            stock: stock !== undefined ? Number(stock) : undefined,
            categoryId
        },
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            price: true,
            discountPrice: true,
            brand: true,
            stock: true,
            averageRating: true,
            reviewCount: true,
            createdAt: true,
            images: {
                select: {
                    id: true,
                    url: true,
                    fileId: true,
                    thumbnail: true,
                    isPrimary: true,
                    sortOrder: true
                },
                orderBy: {
                    sortOrder: "asc"
                }
            },
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            }
        }
    });

    return product;
};


export const getProduct = async (id: string) => {
    const product = await prisma.product.findUnique({
        where: {
            id
        },
        include: {
            images: true,
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            }
        }
    });

    return product;
};


export const getProducts = async (payload: GetProductsInput) => {
    const { page = 1, limit = 10, search, categoryId } = payload;

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where: {
                isDeleted: false,
                title: {
                    contains: search,
                    mode: "insensitive"
                },
                ...(categoryId && {
                    categoryId
                })
            },
            include: {
                images: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            },
            take: limit,
            skip
        }),
        prisma.product.count({
            where: {
                isDeleted: false,
                title: {
                    contains: search,
                    mode: "insensitive"
                },
                ...(categoryId && {
                    categoryId
                })
            }
        })
    ]);

    return {
        products,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    }
}


export const deleteProduct = async (id: string) => {
    const product = await prisma.product.findUnique({
        where: {
            id
        }
    });

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    await prisma.product.update({
        where: {
            id
        },
        data: {
            isDeleted: true
        }
    });

    return true;
}


export const getTrashProducts = async () => {
    const products = await prisma.product.findMany({
        where: {
            isDeleted: true
        },
        include: {
            images: true,
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            }
        }
    });

    return products;
};


export const deletePermanentlyProduct = async (id: string) => {
    const product = await prisma.product.findUnique({
        where: {
            id
        }
    });

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    await prisma.product.delete({
        where: {
            id
        }
    });

    return true;
}
