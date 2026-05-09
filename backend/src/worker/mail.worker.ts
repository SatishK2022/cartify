import { Worker } from "bullmq";
import { redis } from "../config/redis";
import { sendEmail } from "../services/mail.service";


const mailWorker = new Worker("mail-queue", async (job) => {
    await sendEmail(job.data);
}, { connection: redis });


mailWorker.on("completed", (job) => {
    console.log("Job completed: ", job.id)
});

mailWorker.on("failed", (job, err) => {
    console.log("Job failed: ", job?.id, err.message);
});