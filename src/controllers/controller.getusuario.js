import getConnection from "../database/connection.js";
const tableName = process.env.DATAIMAGEN;
const tableNamePerfil = process.env.DATAPERFIL;

export const getUsuarioIdFromDatabase = async (id) => {
    let client;
    try {
        const { pool, client: connectedClient } = await getConnection();
        client = connectedClient;

        const query = `
            SELECT usuario_id FROM ${tableName}
            WHERE id = $1;
        `;

        const result = await client.query(query, [id]);

        if (result.rows.length === 0) {
            throw new Error('No se encontró la imagen con el ID proporcionado');
        }

        return result.rows[0].usuario_id;
    } catch (error) {
        console.error('Error al obtener el usuario_id de la imagen:', error);
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
};

export const getUsuarioIdFromDatabasePerfil = async (id) => {
    let client;
    try {
        const { pool, client: connectedClient } = await getConnection();
        client = connectedClient;

        const query = `
            SELECT usuario_id FROM ${tableNamePerfil}
            WHERE id = $1;
        `;

        const result = await client.query(query, [id]);

        if (result.rows.length === 0) {
            throw new Error('No se encontró la imagen con el ID proporcionado');
        }

        return result.rows[0].usuario_id;
    } catch (error) {
        console.error('Error al obtener el usuario_id de la imagen:', error);
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
};

export const updateFavoritesOrSaved = async (id, type, imageIds) => {
    const { client } = await getConnection();
    try {
        let columnToUpdate = type === 'favoritos' ? 'favoritos' : 'guardados';

        // Obtener los favoritos/guardados actuales del perfil
        const query = `SELECT ${columnToUpdate} FROM perfil WHERE id = $1`;
        const result = await client.query(query, [id]);

        let updatedIds = [];
        if (result.rows.length > 0) {
            const currentIds = result.rows[0][columnToUpdate] || [];
            if (type === 'favoritos') {
                updatedIds = [...currentIds, ...imageIds.filter(id => !currentIds.includes(id))];
            } else {
                updatedIds = currentIds.filter(id => !imageIds.includes(id));
            }
        } else {
            throw new Error('Perfil no encontrado');
        }

        // Actualizar la columna favoritos/guardados en la base de datos
        const updateQuery = `UPDATE perfil SET ${columnToUpdate} = $1 WHERE id = $2 RETURNING *`;
        const updateResult = await client.query(updateQuery, [updatedIds, id]);

        return updateResult.rows[0];
    } finally {
        client.release();
    }
};