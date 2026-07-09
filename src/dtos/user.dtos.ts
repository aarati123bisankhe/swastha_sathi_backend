import z, { email } from "zod";
import { UserSchema } from "../types/user.type.ts";


export const CreateUserDto = UserSchema.pick(
    {
        fullname: true,
        email: true,
        password: true,
        phonenumber: true,
        district: true,
        bloodgroup: true,
        profileUrl: true,
    }
)
export type CreateUserDto = z.infer<typeof CreateUserDto>;



export const LoginUserDto = z.object({
    email: z.email(),
    password: z.string().min(6),
});
export type LoginUserDto = z.infer<typeof LoginUserDto>;



export const UpdateUserDto = UserSchema.partial();
export type UpdateUserDto = z.infer<typeof UpdateUserDto>;

export const UploadProfilePhotoDto = z.object({  //profile photo upload dto
    fileName: z.string().trim().min(1),
    mimeType: z.string().trim().min(1),
    base64Data: z.string().trim().min(1),
});
export type UploadProfilePhotoDto = z.infer<typeof UploadProfilePhotoDto>;
