import { Router } from "express";
import * as authController from "./auth.controller";
import * as authValidation from "./auth.validation";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import * as authRateLimiter from "./auth.rate-limiters";

const router = Router();

router.post("/register", authRateLimiter.registerRateLimiter, validate(authValidation.registerSchema), authController.register);
router.post("/login", authRateLimiter.loginRateLimiter, validate(authValidation.loginSchema), authController.login);
router.post("/logout", authenticate, authController.logout);

router.post("/verify-email", validate(authValidation.verifyEmailSchema), authController.verifyEmail);
router.post("/resend-verification-email", authRateLimiter.resendVerificationEmailRateLimiter, authenticate, authController.resendVerifyEmail);

router.post("/refresh-token", authRateLimiter.refreshTokenRateLimiter, authController.refreshToken);

router.post("/forgot-password", authRateLimiter.forgotPasswordRateLimiter, validate(authValidation.forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", authRateLimiter.resetPasswordRateLimiter, validate(authValidation.resetPasswordSchema), authController.resetPassword);

router.post("/change-password", authenticate, validate(authValidation.changePasswordSchema), authController.changePassword);


// TODO: Add other routes
// router.patch("/profile", authenticate, authController.updateProfile);
// router.delete("/delete-account", authenticate, authController.deleteAccount);


export default router;
