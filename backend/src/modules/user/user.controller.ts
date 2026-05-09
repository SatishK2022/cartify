import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/async-handler.middleware";
import * as userService from "./user.service";
import { ApiResponse } from "../../utils/api-response";


export const me = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getProfile(req.user!.id);

    res.status(200).json(
        new ApiResponse("User fetched successfully", user)
    );
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.updateProfile(req.user!.id, req.body);

    res.status(200).json(
        new ApiResponse("User updated successfully", user)
    );
});

export const getAddresses = asyncHandler(async (req: Request, res: Response) => {
    const addresses = await userService.getAddresses(req.user!.id);

    res.status(200).json(
        new ApiResponse("Addresses fetched successfully", addresses)
    );
});

export const getAddress = asyncHandler(async (req: Request, res: Response) => {
    const address = await userService.getAddress(req.user!.id, req.params.id as string);

    res.status(200).json(
        new ApiResponse("Address fetched successfully", address)
    );
});

export const createAddress = asyncHandler(async (req: Request, res: Response) => {
    const address = await userService.createAddress(req.user!.id, req.body);

    res.status(200).json(
        new ApiResponse("Address created successfully", address)
    );
});

export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
    const address = await userService.updateAddress(req.user!.id, req.params.id as string, req.body);

    res.status(200).json(
        new ApiResponse("Address updated successfully", address)
    );
});

export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
    await userService.deleteAddress(req.user!.id, req.params.id as string);

    res.status(200).json(
        new ApiResponse("Address deleted successfully")
    );
});
