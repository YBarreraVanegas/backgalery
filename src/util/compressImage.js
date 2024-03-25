import sharp from "sharp";

//Función para la compresión de imágenes:
export const compressImage = async (file) => {
    try {
        return await sharp(file.buffer)
            .resize({ width: 800, withoutEnlargement: true })
            .toFormat('webp', { quality: 50 })
            .toBuffer();
    } catch (error) {
        console.error('error al comprimir:', error);
        throw error;
    }

};