import rateLimit, { Options } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redis } from "../config/redis";

interface RateLimiterOptions {
    windowMs?: number;
    max?: number;
    message?: string;
}

export const createRateLimiter = ({
    windowMs = 15 * 60 * 1000, // 15 mins
    max = 10,
    message = "Too many requests, please try again later."
}: RateLimiterOptions = {}) => {

    return rateLimit({
        windowMs,
        max,

        standardHeaders: true,
        legacyHeaders: false,

        message: {
            success: false,
            message
        },

        store: new RedisStore({
            sendCommand: (...args: string[]) =>
                redis.call(...(args as [string, ...string[]])) as Promise<any>
        }),

        handler: (req, res, _next, options: Options) => {
            return res.status(options.statusCode).json({
                success: false,
                message
            });
        }
    });
};