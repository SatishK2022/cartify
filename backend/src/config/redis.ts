import { Redis } from "ioredis";
import { env } from "./env";


function createRedisClient() {
    const redis = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });

    redis.on("connect", () => console.log("✅ Redis connected"));
    redis.on("error", (err) => console.log("❌ Redis Client Error", err));

    return redis;
}


export const redis = createRedisClient();
