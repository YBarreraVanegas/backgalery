import cloudinaryV2 from 'cloudinary';
import { config } from 'dotenv';
config();
cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const cloudinaryUpload = async (file, compressedImagenData) => {
    try {

        const uploadOptions = {
            folder: 'web',
            public_id: `${Date.now()}-${file.originalname}`
        };
        const result = await cloudinaryV2.uploader.upload(`data:image/webp;base64,${compressedImagenData.toString('base64')}`, {
            ...uploadOptions,
            public_id: uploadOptions.public_id,
            resource_type: 'image',
            filename: `${Date.now()}-${file.originalname}`,
        });

        console.log('se creo la imagen', result.secure_url);
        return result.secure_url;
    } catch (error) {
        console.error('Error al subir imagen a Cloudinary:', error);
        throw error;
    }
};
export const cloudinaryUpdate = async (compressedImageBuffer) => {
    try {
        const base64String = compressedImageBuffer.toString('base64');

        const uploadOptions = {
            folder: 'web',
            public_id: `${Date.now()}`
        };
        const result = await cloudinaryV2.uploader.upload(`data:image/webp;base64,${base64String}`, {
            ...uploadOptions,
            resource_type: 'image',
        });

        console.log('Imagen subida a Cloudinary:', result.secure_url);
        return result.secure_url;
    } catch (error) {
        console.error('Error al subir la imagen a Cloudinary:', error);
        throw error;
    }
};