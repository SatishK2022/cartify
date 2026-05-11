import multer from "multer";

export const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },

    fileFilter: (_req, file, cb) => {

        const allowedMimeTypes = [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/webp"
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(
                new Error("Only image files are allowed")
            );
        }

        cb(null, true);
    }
});