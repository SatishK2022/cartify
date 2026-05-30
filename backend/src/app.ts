import express, { Request, Response } from "express";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import categoryRoutes from "./modules/category/category.routes";
import productRoutes from "./modules/product/product.routes";
import cartRoutes from "./modules/cart/cart.routes";
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
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/category", categoryRoutes)
app.use("/api/v1/product", productRoutes)
app.use("/api/v1/cart", cartRoutes)


app.get("/", (_: Request, res: Response) => {
    res.status(200).json({ 
        success: true, 
        message: "Cartify API - V1" 
    });
});

app.use(errorHandler)

export default app;
