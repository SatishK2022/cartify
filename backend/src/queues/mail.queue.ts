import { Queue } from "bullmq";
import { redis } from "../config/redis";


export const mailQueue = new Queue(
    "mail-queue", 
    { 
        connection: redis,
        defaultJobOptions: {
            attempts: 3,

            backoff: {
                type: "exponential",
                delay: 5000
            },

            removeOnComplete: true,
            removeOnFail: false
        }
    }
);
