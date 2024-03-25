import { config } from 'dotenv';
import { compressImage } from '../util/compressImage.js';
import { cloudinaryUpload } from '../util/cloudinaryUpload.js';
import { saveProductToDatabase } from '../util/saveData.js';


config();



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
        const userId = req.user.userId;
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
            usuario_id: userId,
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




