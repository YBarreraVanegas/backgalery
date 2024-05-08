import getConnection from "../database/connection.js";
import { config } from "dotenv";
import { getUsuarioIdFromDatabase, getUsuarioIdFromDatabasePerfil } from "./controller.getusuario.js";

config();

const tableName = process.env.DATAIMAGEN;
const tableNamePerfil = process.env.DATAPERFIL;

export const deleteImage = async (req, res) => {
    let client;
    try { // Obtener el nuevo título y descripción desde req.body
        const { id } = req.params;
        const usuarioId = await getUsuarioIdFromDatabase(id);
        // Verificar si el usuario tiene permisos para actualizar la imagen
        if (req.user.userId !== usuarioId) {
            return res.status(403).json({ message: 'No tiene permiso para eliminar esta imagen' });
        }
        const { client: connectedClient } = await getConnection();
        client = connectedClient;

        if (!client) {
            throw new Error('Failed to connect to the database');
        }

        const result = await client.query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING id`, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        if (client) {
            client.release(); // Liberar la conexión al pool si se ha inicializado
        }
    }
};



export const deleteCategoria = async (req, res) => {
    let client;
    try {
        const { id } = req.params;

        // Obtener el ID del usuario desde la base de datos
        const usuarioId = await getUsuarioIdFromDatabasePerfil(id);

        // Verificar si el usuario tiene permisos para eliminar la categoría
        if (req.user.userId !== usuarioId) {
            return res.status(403).json({ message: 'No tiene permiso para eliminar esta categoría' });
        }

        // Eliminar el ID de favoritos y guardados
        await eliminarIdEnFavoritosGuardados(id);

        // Obtener la conexión a la base de datos para eliminar la categoría asociada a la imagen
        const { client: connectedClient } = await getConnection();
        client = connectedClient;

        if (!client) {
            throw new Error('Error al conectar con la base de datos');
        }

        // Eliminar la categoría asociada a la imagen
        const result = await client.query(`UPDATE ${tableNamePerfil} SET favoritos = NULL WHERE id = $1 RETURNING id`, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Imagen no encontrada' });
        }

        return res.json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        res.status(500).send('Error interno del servidor');
    } finally {
        if (client) {
            client.release(); // Liberar la conexión al pool si se ha inicializado
        }
    }
};



export const eliminarIdEnFavoritosGuardados = async (id) => {
    let client;
    try {
        // Obtener la conexión a la base de datos
        const { client: connectedClient } = await getConnection();
        client = connectedClient;

        // Obtener el perfil actual para obtener los favoritos y guardados
        const consultaPerfil = `
            SELECT favoritos, guardados
            FROM ${tableNamePerfil}
            WHERE id = $1;
        `;
        const perfilResult = await client.query(consultaPerfil, [id]);

        let favoritosActuales = perfilResult.rows[0]?.favoritos || [];
        let guardadosActuales = perfilResult.rows[0]?.guardados || [];

        // Eliminar el ID de favoritos y guardados si existe en las listas
        favoritosActuales = favoritosActuales.filter(item => item !== id);
        guardadosActuales = guardadosActuales.filter(item => item !== id);

        // Actualizar la columna favoritos y guardados con los valores modificados
        const query = `
            UPDATE ${tableNamePerfil}
            SET favoritos = $1,
                guardados = $2
            WHERE id = $3
            RETURNING favoritos, guardados;
        `;

        // Ejecutar la consulta con los valores modificados
        const values = [favoritosActuales, guardadosActuales, id];
        const result = await client.query(query, values);

        // Verificar si se encontró el perfil y mostrar los favoritos y guardados actualizados
        if (result.rows.length === 0) {
            throw new Error('No se encontró el perfil con el ID proporcionado');
        }

        console.log('Favoritos actualizados en la base de datos:', result.rows[0].favoritos);
        console.log('Guardados actualizados en la base de datos:', result.rows[0].guardados);

        // Devolver los favoritos actualizados
        return result.rows[0].favoritos;
    } catch (error) {
        console.error('Error al eliminar el ID en favoritos y guardados:', error.message);
        throw error;
    } finally {
        // Liberar la conexión al cliente de la base de datos
        if (client) {
            client.release();
        }
    }
};
