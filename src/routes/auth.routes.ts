import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.ts";

let authController = new AuthController();

const router = Router();
router.post("/register", authController.createUser)
router.post("/login", authController.loginUser)
router.put("/profile/:userId", authController.updateUserProfile) 
router.post("/profile/upload-photo", authController.uploadProfilePhoto) 

export default router;
