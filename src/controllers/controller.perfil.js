import { config } from 'dotenv';
import { compressImage } from '../util/compressImage.js';
import { cloudinaryUpdate, cloudinaryUpload } from '../util/cloudinaryUpload.js';
import { savePerfilToDatabase, updatePerfilInDatabase } from '../util/saveData.js';
import { getUsuarioIdFromDatabasePerfil, } from './controller.getusuario.js';


config();
const extractFileAndBody = (req) => {
    const { files, body } = req;
    return { files, body };
};

//guardar la imagen
export const saveProfileToDatabase = async (req, res) => {
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
        savePerfilToDatabase({
            usuario_id: userId,
            nombre: body.nombre,
            descripcion: body.descripcion,
            imagen_perfil: imagenUrls
        });

        res.status(200).json({ message: 'Producto creado correctamente', imagenUrls });
    } catch (error) {
        console.error('Error al procesar las imágenes o al crear el producto:', error);
        res.status(500).send({ message: 'Error interno del servidor' });
    }

};

export const updateProfileToDatabase = async (req, res) => {
    let client;
    try {
        // Obtener el nuevo título y descripción desde req.body
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        const usuarioId = await getUsuarioIdFromDatabasePerfil(id);
        // Verificar si el usuario tiene permisos para actualizar la imagen
        if (req.user.userId !== usuarioId) {
            return res.status(403).json({ message: 'No tiene permiso para actualizar este perfil' });
        }
        // Verificamos que se hayan enviado archivos
        if (!req.files || req.files.length === 0) {
            console.error('Error: No se proporcionaron imágenes o las imágenes están vacías.');
            return res.status(403).send('Error: No se proporcionaron imágenes o las imágenes están vacías.');
        }

        // Guardar la nueva imagen en Cloudinary
        const file = req.files[0]; // Suponiendo que solo se envía una imagen en la solicitud
        const compressedImageBuffer = await compressImage(file);

        const newImageUrl = await cloudinaryUpdate(compressedImageBuffer);



        const updatedImageUrl = await updatePerfilInDatabase(id, newImageUrl, nombre, descripcion, id);

        res.status(200).json({ message: 'perfil actualizada correctamente', imageUrl: updatedImageUrl });
    } catch (error) {
        console.error('Error al actualizar la imagen:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        if (client) {
            client.release(); // Liberar la conexión al pool si se ha inicializado
        }
    }
};







