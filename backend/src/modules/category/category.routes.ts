import { Router } from "express";
import * as categoryController from "./category.controller";
import * as categoryValidation from "./category.validation";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();

router
    .route("/")
    .post(authenticate, authorize("ADMIN"), validate(categoryValidation.createCategorySchema), categoryController.createCategory)
    .get(authenticate, validate(categoryValidation.getCategoriesSchema), categoryController.getCategories)

router
    .route("/trash")
    .get(authenticate, authorize("ADMIN"), categoryController.getTrashCategories)

router
    .route("/:id")
    .get(authenticate, validate(categoryValidation.getCategorySchema), categoryController.getCategory)
    .put(authenticate, authorize("ADMIN"), validate(categoryValidation.updateCategorySchema), categoryController.updateCategory)
    .delete(authenticate, authorize("ADMIN"), validate(categoryValidation.deleteCategorySchema), categoryController.deleteCategory)

export default router;
