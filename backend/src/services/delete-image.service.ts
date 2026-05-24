import { imagekit } from "../config/imagekit";

export const deleteImage = async (fileId: string) => {

    await imagekit.files.delete(fileId);

    return true;
};
