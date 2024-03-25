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
