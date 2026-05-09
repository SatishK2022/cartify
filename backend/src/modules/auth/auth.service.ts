import { JwtPayloadType } from "../../types/auth.types";
import { RegisterInput, LoginInput, ForgotPasswordInput, ResetPasswordInput, ChangePasswordInput } from "./auth.validation"
import { ApiError } from "../../utils/api-error";
import { prisma } from "../../config/prisma";
import { env } from "../../config/env";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "node:crypto"
import { mailQueue } from "../../queues/mail.queue";


const createAccessAndRefreshToken = async (payload: JwtPayloadType) => {
    const accessToken = jwt.sign(payload, env.JWT_SECRET as string, {
        expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, env.JWT_SECRET as string, {
        expiresIn: "7d",
    })

    return {
        accessToken,
        refreshToken
    }
}


export const register = async (payload: RegisterInput) => {
    const { name, email, password } = payload;

    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })

    const { accessToken, refreshToken } = await createAccessAndRefreshToken({
        id: user.id.toString(),
        role: user.role
    })

    const verifyToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(verifyToken).digest("hex");

    // FIXME: Send email
    Promise.all([
        // send welcome email
        mailQueue.add("send-email", {
            to: user.email,
            subject: "Welcome to Cartify",
            template: "welcome",
            data: {
                name,
                appName: "Cartify"
            }
        }),

        // send verification email
        mailQueue.add("send-email", {
            to: user.email,
            subject: "Verify your email",
            template: "verify-email",
            data: {
                name,
                verifyUrl: `${env.CLIENT_URL}/verify-email?token=${verifyToken}`,
            }
        })
    ]).catch((error) => {
        console.log(error);
    })

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            refreshToken,
            verifyEmailToken: hashedToken,
            verifyEmailTokenExpiry: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        }
    })

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        accessToken,
        refreshToken
    }
}

export const login = async (payload: LoginInput) => {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        throw new ApiError(400, "User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid password");
    }

    const { accessToken, refreshToken } = await createAccessAndRefreshToken({
        id: user.id.toString(),
        role: user.role
    })

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            refreshToken
        }
    })

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        },
        accessToken,
        refreshToken
    }
}

export const verifyEmail = async (token: string) => {
    if (!token) {
        throw new ApiError(400, "Verification token is required");
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
        where: {
            verifyEmailToken: hashedToken,
            verifyEmailTokenExpiry: {
                gt: new Date()
            }
        }
    })

    if (!user) {
        throw new ApiError(400, "Invalid or expired token");
    }

    if (user.isVerified) {
        throw new ApiError(400, "Email already verified");
    }

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            isVerified: true,
            verifyEmailToken: null,
            verifyEmailTokenExpiry: null
        }
    })

    return true;
}

export const resendVerifyEmail = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) {
        throw new ApiError(400, "User not found");
    }

    if (user.isVerified) {
        throw new ApiError(400, "Email already verified");
    }

    const verifyToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(verifyToken).digest("hex");

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            verifyEmailToken: hashedToken,
            verifyEmailTokenExpiry: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        }
    })

    // FIXME: Send email
    await mailQueue.add("send-email", {
        to: user.email,
        subject: "Verify your email",
        template: "verify-email",
        data: {
            name: user.name,
            verifyUrl: `${env.CLIENT_URL}/verify-email?token=${verifyToken}`,
        }
    })

    return true;
}

export const refreshToken = async (incomingRefreshToken: string) => {
    if (!incomingRefreshToken) {
        throw new ApiError(400, "Refresh token is required");
    }

    const decoded = jwt.verify(incomingRefreshToken, env.JWT_SECRET as string) as JwtPayloadType;

    const user = await prisma.user.findUnique({
        where: {
            id: decoded.id
        }
    })

    if (!user) {
        throw new ApiError(400, "User not found");
    }

    if (user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(400, "Invalid refresh token");
    }

    const { accessToken, refreshToken } = await createAccessAndRefreshToken({
        id: user.id.toString(),
        role: user.role
    })

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            refreshToken
        }
    })

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        accessToken,
        refreshToken
    }
}

export const logout = async (userId: string) => {
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            refreshToken: null
        }
    })

    return true;
}

export const forgotPassword = async (payload: ForgotPasswordInput) => {
    const { email } = payload;

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        throw new ApiError(400, "User not found");
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        }
    })

    // FIXME: Send email
    await mailQueue.add("send-email", {
        to: user.email,
        subject: "Forgot password",
        template: "forgot-password",
        data: {
            name: user.name,
            resetUrl: `${env.CLIENT_URL}/forgot-password?token=${token}`,
        }
    })

    return true;
}

export const resetPassword = async (payload: ResetPasswordInput) => {
    const { token, password } = payload;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
        where: {
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: {
                gt: new Date()
            }
        }
    })

    if (!user) {
        throw new ApiError(400, "User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            password: hashedPassword,
            forgotPasswordToken: null,
            forgotPasswordTokenExpiry: null
        }
    })

    // FIXME: Send email
    await mailQueue.add("send-email", {
        to: user.email,
        subject: "Reset password",
        template: "reset-password-success",
        data: {
            name: user.name,
        }
    })

    return true;
}

export const changePassword = async (userId: string, payload: ChangePasswordInput) => {
    const { currentPassword, newPassword } = payload;

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) {
        throw new ApiError(400, "User not found");
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            password: hashedPassword
        }
    })

    return true;
}

