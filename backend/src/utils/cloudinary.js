import { v2 as cloudinary } from 'cloudinary';
import logger from './logger.js';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload an image to Cloudinary
 * @param {String} filePath Local path or buffer
 * @param {String} folder Cloudinary folder
 * @returns {Promise<Object>} Upload result
 */
export const uploadImage = async (fileBuffer, folder = 'campusone/users') => {
    try {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            uploadStream.end(fileBuffer);
        });
    } catch (error) {
        logger.error('Cloudinary Upload Error:', error);
        throw error;
    }
};

export default cloudinary;
