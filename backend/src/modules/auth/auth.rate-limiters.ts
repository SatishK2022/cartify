import { createRateLimiter } from "../../middlewares/rate-limit.middleware";

export const registerRateLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: "Too many registration attempts."
});

export const loginRateLimiter = createRateLimiter({
    max: 5,
    message: "Too many login attempts."
});

export const forgotPasswordRateLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: "Too many password reset requests."
});

export const resendVerificationEmailRateLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: "Too many verification email requests."
});

export const resetPasswordRateLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: "Too many password reset requests."
});

export const refreshTokenRateLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: "Too many refresh token requests."
});