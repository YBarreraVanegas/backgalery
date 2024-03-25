import { getUsuarioIdFromDatabase } from './controller.getusuario.js';
import { compressImage } from '../util/compressImage.js';
import { cloudinaryUpdate } from '../util/cloudinaryUpload.js';



export const updateImage = async (req, res) => {
    let client;
    try {
        // Obtener el nuevo título y descripción desde req.body
        const { id, titulo, descripcion } = req.body;
        const usuarioId = await getUsuarioIdFromDatabase(id);
        // Verificar si el usuario tiene permisos para actualizar la imagen
        if (req.user.userId !== usuarioId) {
            return res.status(403).json({ message: 'No tiene permiso para actualizar esta imagen' });
        }
        // Verificar si se proporcionó un archivo de imagen en la solicitud
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No se proporcionó ningún archivo de imagen' });
        }

        // Guardar la nueva imagen en Cloudinary
        const newImageFile = req.files[0]; // Suponiendo que solo se envía una imagen en la solicitud
        const compressedImageBuffer = await compressImage(newImageFile);

        const newImageUrl = await cloudinaryUpdate(compressedImageBuffer);



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





