import { Request, Response } from "express";
import { ApiResponse } from "../../utils/api-response";
import * as productService from "./product.service";
import { asyncHandler } from "../../middlewares/async-handler.middleware";


export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];

    const product = await productService.createProduct(req.body, files);

    res.status(201).json(
        new ApiResponse("Product created successfully", product)
    );
})

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];

    const product = await productService.updateProduct(req.params.id as string, req.body, files);

    res.status(200).json(
        new ApiResponse("Product updated successfully", product)
    );
})

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    await productService.deleteProduct(req.params.id as string);

    res.status(200).json(
        new ApiResponse("Product deleted successfully")
    );
})

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.getProduct(req.params.id as string);

    res.status(200).json(
        new ApiResponse("Product fetched successfully", product)
    );
})

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const search = req.query.search as string;
    const categoryId = req.query.categoryId as string;

    const result = await productService.getProducts({ page, limit, search, categoryId });

    res.status(200).json(
        new ApiResponse("Products fetched successfully", result.products, result.meta)
    );
})

export const getTrashProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await productService.getTrashProducts();

    res.status(200).json(
        new ApiResponse("Products fetched successfully", products)
    );
})

export const deletePermanentlyProduct = asyncHandler(async (req: Request, res: Response) => {
    await productService.deletePermanentlyProduct(req.params.id as string);

    res.status(200).json(
        new ApiResponse("Product deleted permanently")
    );
})