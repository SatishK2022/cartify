import { CookieOptions, Request, Response } from "express";
import { asyncHandler } from "../../middlewares/async-handler.middleware";
import * as authService from "./auth.service";
import { ApiResponse } from "../../utils/api-response";
import { env } from "../../config/env";

const cookieOptions: CookieOptions = {
    secure: env.NODE_ENV === "production",
    sameSite: "none",
    httpOnly: true,
}

export const register = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.register(req.body);

    res
        .status(201)
        .cookie("accessToken", user.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 },)
        .cookie("refreshToken", user.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
        .json(
            new ApiResponse("User created successfully", user)
        );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.login(req.body);

    res
        .status(200)
        .cookie("accessToken", user.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 },)
        .cookie("refreshToken", user.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
        .json(
            new ApiResponse("User logged in successfully", user)
        );
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;

    await authService.verifyEmail(token);

    res.status(200).json(
        new ApiResponse("Email verified successfully")
    );
})

export const resendVerifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    await authService.resendVerifyEmail(userId);

    res.status(200).json(
        new ApiResponse("Verification email sent successfully")
    );
})

export const logout = asyncHandler(async (req: Request, res: Response) => {
    await authService.logout(req.user!.id);

    res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(
            new ApiResponse("User logged out successfully")
        );
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    const user = await authService.refreshToken(incomingRefreshToken);

    res
        .status(200)
        .cookie("accessToken", user.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 },)
        .cookie("refreshToken", user.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
        .json(
            new ApiResponse("Token refreshed successfully", user)
        )
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    await authService.forgotPassword(req.body);

    res.status(200).json(
        new ApiResponse("Password reset email sent successfully")
    );
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    await authService.resetPassword(req.body);

    res.status(200).json(
        new ApiResponse("Password reset successfully")
    );
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
    await authService.changePassword(req.user!.id, req.body);

    res.status(200).json(
        new ApiResponse("Password changed successfully")
    );
});

