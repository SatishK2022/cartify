import { prisma } from "../../config/prisma";
import { ApiError } from "../../utils/api-error";
import { AddProductToCartInput } from "./cart.validation";


export const getCart = async (userId: string) => {
    const cart = await prisma.cart.findUnique({
        where: {
            userId,
        },

        include: {
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,

                            price: true,
                            discountPrice: true,

                            images: {
                                select: {
                                    url: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!cart) {
        return {
            items: [],
            subtotal: 0,
            totalItems: 0,
        };
    }

    const subtotal = cart.items.reduce((acc, item) => {
        const price = Number(item.product.discountPrice ?? item.product.price ?? 0);
        const qty = Number(item.quantity ?? 0);

        return acc + price * qty;
    }, 0);

    const totalItems = cart.items.reduce((acc, item) => {
        return acc + item.quantity;
    }, 0);

    return {
        id: cart.id,
        items: cart.items,
        subtotal,
        totalItems,
    };
};

export const addProductToCart = async (userId: string, payload: AddProductToCartInput) => {
    const { productId, quantity } = payload

    const product = await prisma.product.findFirst({
        where: {
            id: productId,
            isDeleted: false
        }
    })

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (product.stock < quantity) {
        throw new ApiError(400, "Insufficient stock");
    }

    let cart = await prisma.cart.findUnique({
        where: {
            userId
        }
    })

    if (!cart) {
        cart = await prisma.cart.create({
            data: {
                userId
            }
        })
    }

    const existingCartItem = await prisma.cartItem.findFirst({
        where: {
            cartId: cart.id,
            productId
        }
    })

    if (existingCartItem) {
        const updatedQuantity = existingCartItem.quantity + quantity;

        if (updatedQuantity > product.stock) {
            throw new ApiError(400, "Insufficient stock");
        }

        return await prisma.cartItem.update({
            where: {
                id: existingCartItem.id
            },
            data: {
                quantity: updatedQuantity
            },
            include: {
                product: true
            }
        })
    }

    return await prisma.cartItem.create({
        data: {
            cartId: cart.id,
            productId,
            quantity
        },
        include: {
            product: true
        }
    })
}

export const updateProductInCart = async (userId: string, productId: string, quantity: number) => {
    if (quantity <= 0) {
        throw new ApiError(400, "Quantity must be greater than 0",);
    }

    const cartItem = await prisma.cartItem.findFirst({
        where: {
            productId: productId,

            cart: {
                userId,
            },
        },

        include: {
            product: true,
        },
    });

    if (!cartItem) {
        throw new ApiError(404, "Cart item not found",);
    }

    if (quantity > cartItem.product.stock) {
        throw new ApiError(400, "Insufficient stock",);
    }

    return prisma.cartItem.update({
        where: {
            id: cartItem.id,
        },

        data: {
            quantity,
        },

        include: {
            product: true,
        },
    });
};

export const deleteProductFromCart = async (userId: string, productId: string) => {
    const cartItem = await prisma.cartItem.findFirst({
        where: {
            productId: productId,

            cart: {
                userId,
            },
        },
    });

    if (!cartItem) {
        throw new ApiError(404, "Cart item not found",);
    }

    await prisma.cartItem.delete({
        where: {
            id: cartItem.id,
        },
    });

    return true;
};

export const clearCart = async (userId: string) => {
    const deletedItems = await prisma.cartItem.deleteMany({
        where: {
            cart: {
                userId,
            },
        },
    });

    return deletedItems;
};
