import { Router } from "express";
import * as userController from "./user.controller";
import * as userValidation from "./user.validation";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();

router
    .route("/profile")
    .get(authenticate, userController.me)
    .put(authenticate, validate(userValidation.updateProfileSchema), userController.updateProfile)

router
    .route("/address")
    .get(authenticate, userController.getAddresses)
    .post(authenticate, validate(userValidation.createAddressSchema), userController.createAddress)

router
    .route("/address/:id")
    .get(authenticate, validate(userValidation.getAddressSchema), userController.getAddress)
    .put(authenticate, validate(userValidation.updateAddressSchema), userController.updateAddress)
    .delete(authenticate, validate(userValidation.deleteAddressSchema), userController.deleteAddress)

export default router;
