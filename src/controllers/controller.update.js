import cloudinaryV2 from 'cloudinary';
import { config } from 'dotenv';
import sharp from 'sharp';
import getConnection from '../database/connection.js';

config();
cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const tableName = process.env.DATAIMAGEN;

export const updateImage = async (req, res) => {
    let client;
    try {
        // Verificar si se proporcionó un archivo de imagen en la solicitud
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No se proporcionó ningún archivo de imagen' });
        }

        // Guardar la nueva imagen en Cloudinary
        const newImageFile = req.files[0]; // Suponiendo que solo se envía una imagen en la solicitud
        const compressedImageBuffer = await compressImage(newImageFile);

        const newImageUrl = await cloudinaryUpload(compressedImageBuffer);

        // Obtener el nuevo título y descripción desde req.body
        const { id, titulo, descripcion } = req.body;

        const updatedImageUrl = await updateImageUrlInDatabase(id, newImageUrl, titulo, descripcion);

        res.status(200).json({ message: 'Imagen actualizada correctamente', imageUrl: updatedImageUrl });
    } catch (error) {
        console.error('Error al actualizar la imagen:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        if (client) {
            client.release(); // Liberar la conexión al pool si se ha inicializado
        }
    }
};



const updateImageUrlInDatabase = async (id, imageUrl, descripcion, titulo) => {
    let client;
    try {
        const { pool, client: connectedClient } = await getConnection();
        client = connectedClient;

        const query = `
        UPDATE ${tableName}
        SET imagen = $1, titulo = $3, descripcion = $2
        WHERE id = $4
        RETURNING imagen;
        `;

        const values = [imageUrl, titulo, descripcion, id];
        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            throw new Error('No se encontró la imagen con el ID proporcionado');
        }

        console.log('URL de imagen actualizada en la base de datos:', result.rows[0].imagen);
        return result.rows[0].imagen;
    } catch (error) {
        console.error('Error al actualizar la URL de la imagen en la base de datos:', error);
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
};

const compressImage = async (file) => {
    try {
        return await sharp(file.buffer)
            .resize({ width: 800, withoutEnlargement: true })
            .toFormat('webp', { quality: 50 })
            .toBuffer();
    } catch (error) {
        console.error('Error al comprimir la imagen:', error);
        throw error;
    }
};

const cloudinaryUpload = async (compressedImageBuffer) => {
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