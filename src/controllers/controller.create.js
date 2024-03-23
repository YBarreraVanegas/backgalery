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
const tableName = 'imagen';


// declarar una variable para manejar la req
const extractFileAndBody = (req) => {
    const { files, body } = req;
    return { files, body };
};

//guardar la imagen
export const saveImage = async (req, res) => {
    try {
        const { files, body } = extractFileAndBody(req);
        // Verificamos que se hayan enviado archivos
        if (!files || files.length === 0) {
            console.error('Error: No se proporcionaron imágenes o las imágenes están vacías.');
            return res.status(403).send('Error: No se proporcionaron imágenes o las imágenes están vacías.');
        }
        // Array para almacenar las URLs de las imágenes subidas a Cloudinary
        const imagenUrls = [];
        // Iteramos sobre cada imagen recibida
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Llama a la función de compresión para cada imagen
            const compressedImagenData = await compressImage(file);
            const imageUrl = await cloudinaryUpload(file, compressedImagenData);
            // Pasamos el nombre de la carpeta como argumento
            imagenUrls.push(imageUrl);
        }
        // Guardamos los productos en la base de datos con las URLs de las imágenes
        saveProductToDatabase({

            titulo: body.titulo,
            descripcion: body.descripcion,
            imagen: imagenUrls
        });

        res.status(200).json({ message: 'Producto creado correctamente', imagenUrls });
    } catch (error) {
        console.error('Error al procesar las imágenes o al crear el producto:', error);
        res.status(500).send({ message: 'Error interno del servidor' });
    }

};
//Función para la compresión de imágenes:
const compressImage = async (file) => {
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

const cloudinaryUpload = async (file, compressedImagenData) => {
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

//Función para guardar productos en la base de datos:
const saveProductToDatabase = async (product) => {
    let client;
    try {
        const { pool, client: connectedClient } = await getConnection();
        client = connectedClient;

        const query = `
            INSERT INTO ${tableName} (titulo, descripcion, imagen)
            VALUES ($1, $2, $3)
            RETURNING id;
        `;

        const values = [product.titulo, product.descripcion, product.imagen];

        const result = await client.query(query, values);
    } catch (error) {
        console.error('Error al guardar el producto en la base de datos:', error);
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
};

