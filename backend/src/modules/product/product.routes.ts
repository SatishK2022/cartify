import { Router } from "express";
import * as productController from "./product.controller";
import * as productValidation from "./product.validation";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();

router
    .route("/")
    .post(authenticate, authorize("ADMIN"), upload.array("images", 10), validate(productValidation.createProductSchema), productController.createProduct)
    .get(validate(productValidation.getProductsSchema), productController.getProducts)


router.get("/trash",authenticate, authorize("ADMIN"), productController.getTrashProducts)
router.delete("/delete-permanently/:id",authenticate, authorize("ADMIN"), validate(productValidation.deletePermanentlyProductSchema), productController.deletePermanentlyProduct)

router
    .route("/:id")
    .get(authenticate, validate(productValidation.getProductSchema), productController.getProduct)
    .put(authenticate, authorize("ADMIN"), upload.array("images", 10), validate(productValidation.updateProductSchema), productController.updateProduct)
    .delete(authenticate, authorize("ADMIN"), validate(productValidation.deleteProductSchema), productController.deleteProduct)

export default router;
