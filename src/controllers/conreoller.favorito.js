// En el controlador del servidor (controller.favorito.js)
export const guardarImagenFav = async (req, res) => {
    try {
        const { imagenId, favorito } = req.body;
        const perfilId = req.user.id; // Suponiendo que tienes el ID del perfil desde el usuario autenticado

        // Aquí deberías guardar el ID de la imagen favorita en la tabla `perfil`
        // Por ejemplo, puedes tener un modelo y utilizar el método de tu ORM para guardar la relación

        res.status(200).json({ message: 'Imagen guardada como favorita' });
    } catch (error) {
        console.error('Error al guardar la imagen como favorita:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
