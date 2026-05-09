import express, { Request, Response } from "express";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./modules/auth/auth.routes";
import cookieParser from "cookie-parser";
import morgan from "morgan"
import cors from "cors"

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true }));
app.use(morgan("dev"));


// Routes
app.use("/api/v1/auth", authRoutes)


app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ 
        success: true, 
        message: "Cartify API - V1" 
    });
});

app.use(errorHandler)

export default app;
