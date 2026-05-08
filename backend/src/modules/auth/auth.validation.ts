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


