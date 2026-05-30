import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import * as cartController from "./cart.controller";
import * as cartValidation from "./cart.validation";

const router = Router();

router.get("/", authenticate, validate(cartValidation.getCartSchema), cartController.getCart)
router.post("/items", authenticate, validate(cartValidation.addProductToCartSchema), cartController.addProductToCart)

router.patch("/items/:id", authenticate, validate(cartValidation.updateProductInCartSchema), cartController.updateProductInCart)
router.delete("/items/:id", authenticate, validate(cartValidation.deleteProductFromCartSchema), cartController.deleteProductFromCart)

router.delete("/clear", authenticate, validate(cartValidation.clearCartSchema), cartController.clearCart)


export default router;
