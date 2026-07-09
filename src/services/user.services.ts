import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";

import type { CreateUserDto, LoginUserDto } from "../dtos/user.dtos.ts";
import { HttpError } from "../errors/http-error.ts";
import { UserRepository } from "../repositories/user.respository.ts";
import { JWT_SECRET } from "../configs/index.ts";
import { UpdateUserDto, UploadProfilePhotoDto } from "../dtos/user.dtos.ts";

const userRepository = new UserRepository();

export class UserService {
  async registerUser(userData: CreateUserDto) {
    const checkEmail = await userRepository.getUserByEmail(userData.email);

    if (checkEmail) {
      throw new HttpError(409, "Email already in use");
    }

    const hashedPassword = await bcryptjs.hash(userData.password, 10);

    const newUser = await userRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

    const { password, ...safeUser } = newUser.toObject();

    return safeUser;
  }

    async loginUser(loginData: LoginUserDto) {
        const user = await userRepository.getUserByEmail(loginData.email);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        const validPassword = await bcryptjs.compare(loginData.password, user.password);
        if (!validPassword) {
            throw new HttpError(401, "Invalid Credential");
        }
        const payload = {
            id: user._id,
            email: user.email,
        }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })
        return { token, user }
    }

    async updateUserProfile(userId: string, updateData: UpdateUserDto) {
      const existingUser = await userRepository.getUserById(userId);

      if (!existingUser) {
        throw new HttpError(404, "User not found");
      }

      if (updateData.email && updateData.email !== existingUser.email) {
        const userWithSameEmail = await userRepository.getUserByEmail(updateData.email);
        if (userWithSameEmail && userWithSameEmail._id.toString() !== userId) {
          throw new HttpError(409, "Email already in use");
        }
      }

      const updatedUser = await userRepository.updateUserById(userId, updateData);

      if (!updatedUser) {
        throw new HttpError(500, "Unable to update user profile"); 
      }

      return updatedUser;
    }

    async uploadProfilePhoto(payload: UploadProfilePhotoDto) {
      const uploadsDir = path.resolve(process.cwd(), "uploads", "profile");
      await fs.mkdir(uploadsDir, { recursive: true });

      const extension = resolveFileExtension(payload.fileName, payload.mimeType);
      const safeBaseName = payload.fileName
        .replace(/\.[^.]+$/, "")
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .replace(/-+/g, "-")
        .toLowerCase();
      const fileName = `${Date.now()}-${safeBaseName || "profile"}${extension}`;
      const filePath = path.join(uploadsDir, fileName);

      const buffer = Buffer.from(payload.base64Data, "base64");
      await fs.writeFile(filePath, buffer);

      return {
        profileUrl: `/uploads/profile/${fileName}`,
        fileName,
      };
    }

}

function resolveFileExtension(fileName: string, mimeType: string) {
  const fromName = path.extname(fileName).trim();
  if (fromName) {
    return fromName.toLowerCase();
  }

  if (mimeType.includes("png")) return ".png";
  if (mimeType.includes("webp")) return ".webp";
  if (mimeType.includes("gif")) return ".gif";

  return ".jpg";
}
