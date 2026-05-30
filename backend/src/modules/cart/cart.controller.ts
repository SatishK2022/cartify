import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/async-handler.middleware";
import * as cartService from "./cart.service";
import { ApiResponse } from "../../utils/api-response";


export const getCart = asyncHandler(async (req: Request, res: Response) => {
    const cart = await cartService.getCart(req.user!.id);

    res.status(200).json(
        new ApiResponse("Cart fetched successfully", cart)
    );
})

export const addProductToCart = asyncHandler(async (req: Request, res: Response) => {
    const cart = await cartService.addProductToCart(req.user!.id, req.body);

    res.status(200).json(
        new ApiResponse("Product added to cart successfully", cart)
    );
})

export const updateProductInCart = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    const cart = await cartService.updateProductInCart(req.user!.id, id, req.body.quantity);

    res.status(200).json(
        new ApiResponse("Product updated in cart successfully", cart)
    );
})

export const deleteProductFromCart = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    await cartService.deleteProductFromCart(req.user!.id, id);

    res.status(200).json(
        new ApiResponse("Product removed from cart successfully")
    );
})

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
    await cartService.clearCart(req.user!.id);

    res.status(200).json(
        new ApiResponse("Cart cleared successfully")
    );
})
