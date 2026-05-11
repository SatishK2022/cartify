import { imagekit } from "../config/imagekit";

export const deleteImage = async (fileId: string) => {

    await imagekit.delete(fileId);

    return true;
};