import { Request, Response } from "express";
import * as categoryService from "./category.service";
import { asyncHandler } from "../../middlewares/async-handler.middleware";
import { ApiResponse } from "../../utils/api-response";


export const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await categoryService.createCategory(req.body);

    res.status(201).json(
        new ApiResponse("Category created successfully", category)
    );
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await categoryService.updateCategory(req.params.id as string, req.body);

    res.status(200).json(
        new ApiResponse("Category updated successfully", category)
    );
});

export const getCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await categoryService.getCategory(req.params.id as string);

    res.status(200).json(
        new ApiResponse("Category fetched successfully", category)
    );
});

export const getCategories = asyncHandler(async (req: Request, res: Response) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await categoryService.getCategories({ page, limit });

    res.status(200).json(
        new ApiResponse("Categories fetched successfully", result.categories, result.meta)
    );
});

export const getTrashCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await categoryService.getTrashCategories();

    res.status(200).json(
        new ApiResponse("Categories fetched successfully", categories)
    );
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    await categoryService.deleteCategory(req.params.id as string);

    res.status(200).json(
        new ApiResponse("Category deleted successfully")
    );
});



