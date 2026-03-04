import multer from 'multer';
import AppError from '../../utils/appError.js';

// Use memory storage for Cloudinary stream upload
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    }
});

export const uploadSingle = (fieldName) => upload.single(fieldName);

export default upload;
