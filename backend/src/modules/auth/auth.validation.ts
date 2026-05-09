import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(3).max(50),
        email: z.email(),
        password: z.string().min(6, "Password must be at least 6 characters long"),
    }),
})

export const loginSchema = z.object({
    body: z.object({
        email: z.email(),
        password: z.string().min(6, "Password must be at least 6 characters long"),
    }),
})

export const verifyEmailSchema = z.object({
    body: z.object({
        token: z.string(),
    }),
})

export const forgotPasswordSchema = z.object({
    body: z.object({
        email: z.email(),
    }),
})

export const resetPasswordSchema = z.object({
    body: z.object({
        token: z.string(),
        password: z.string().min(6, "Password must be at least 6 characters long"),
    }),
})

export const changePasswordSchema = z.object({
    body: z.object({
        currentPassword: z.string().min(6, "Password must be at least 6 characters long"),
        newPassword: z.string().min(6, "Password must be at least 6 characters long"),
    }),
})

export type RegisterInput = z.output<typeof registerSchema>["body"];
export type LoginInput = z.output<typeof loginSchema>["body"];
export type VerifyEmailInput = z.output<typeof verifyEmailSchema>["body"];
export type ForgotPasswordInput = z.output<typeof forgotPasswordSchema>["body"];
export type ResetPasswordInput = z.output<typeof resetPasswordSchema>["body"];
export type ChangePasswordInput = z.output<typeof changePasswordSchema>["body"];
