import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory before uploading to Cloudinary
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype) {
            return cb(null, true);
        }
        cb(new Error("Only JPEG, JPG, and PNG images are allowed"));
    },
});

export default upload;