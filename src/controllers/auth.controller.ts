import z from "zod";
import { Request, Response } from "express";
import {
    CreateUserDto,
    LoginUserDto,
    UpdateUserDto,
    UploadProfilePhotoDto,
} from "../dtos/user.dtos.ts";
import { UserService } from "../services/user.services.ts";

let userService = new UserService();
export class AuthController {
    async createUser(req: Request, res: Response) {
        try {
            const parsedData = CreateUserDto.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                )
            }
            const newUser = await userService.registerUser(parsedData.data);
            return res.status(201).json(
                { success: true, message: 'Register Successful', data: newUser }
            )
        } catch (error: Error | any) {
            return res.status(error.statusCode || 500).json(
                { success: false, message: error.message || "Iternal Server Error" }
            )
        }
    };


async loginUser(req: Request, res: Response) {
        try {
            const parsedData = LoginUserDto.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                )
            }
            const { token, user } = await userService.loginUser(parsedData.data);
            return res.status(200).json(
                { success: true, message: 'Login Successful', data: user, token }
            )
        } catch (error: Error | any) {
            return res.status(error.statusCode || 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            )
        }
    }

    async updateUserProfile(req: Request, res: Response) {
        try {
            const userId = Array.isArray(req.params.userId)
                ? req.params.userId[0]
                : req.params.userId;
            const parsedData = UpdateUserDto.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                )
            }

            const updatedUser = await userService.updateUserProfile(
                userId,
                parsedData.data,
            );

            return res.status(200).json(
                { success: true, message: 'Profile updated successfully', data: updatedUser }
            )
        } catch (error: Error | any) {
            return res.status(error.statusCode || 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            )
        }
    }

    async uploadProfilePhoto(req: Request, res: Response) { //upload profile photo controller
        try {
            const parsedData = UploadProfilePhotoDto.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                )
            }

            const uploadedPhoto = await userService.uploadProfilePhoto(parsedData.data);

            return res.status(201).json(
                { success: true, message: 'Profile photo uploaded successfully', data: uploadedPhoto }
            )
        } catch (error: Error | any) {
            return res.status(error.statusCode || 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            )
        }
    }
}
