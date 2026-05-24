import { imagekit } from "../config/imagekit";
import { ApiError } from "../utils/api-error";

export const uploadImage = async (file: Express.Multer.File, folder = "/products") => {
    if (!file) {
        throw new ApiError(400, "File is required");
    }

    const uploadedFile = await imagekit.files.upload({
        file: file.buffer.toString('base64'),
        fileName:`${Date.now()}-${file.originalname}`,
        folder
    });

    return {
        url: uploadedFile.url,
        fileId: uploadedFile.fileId,
        thumbnailUrl:uploadedFile.thumbnailUrl
    };
};