import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.ts";

let authController = new AuthController();

const router = Router();
router.post("/register", authController.createUser)
router.post("/login", authController.loginUser)
router.put("/profile/:userId", authController.updateUserProfile) // Add this line to handle the update user profile route
router.post("/profile/upload-photo", authController.uploadProfilePhoto) // Add this line to handle the upload profile photo route

export default router;
