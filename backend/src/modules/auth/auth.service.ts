import { JwtPayloadType, LoginInput, RegisterInput } from "../../types/auth.types";
import { ApiError } from "../../utils/api-error";
import { prisma } from "../../config/prisma";
import { env } from "../../config/env";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


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
