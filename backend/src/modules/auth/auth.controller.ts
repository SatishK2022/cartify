import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/async-handler.middleware";
import * as authService from "./auth.service";
import { ApiResponse } from "../../utils/api-response";


export const register = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.register(req.body);

    res.status(201).json(
        new ApiResponse("User created successfully", user)
    );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.login(req.body);

    res.status(200).json(
        new ApiResponse("User logged in successfully", user)
    );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    await authService.logout(req.user!.id);

    res.status(200).json(
        new ApiResponse("User logged out successfully")
    );
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {

});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {

});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {

});

export const me = asyncHandler(async (req: Request, res: Response) => {

});
