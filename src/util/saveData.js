import { getUsuarioIdFromDatabase } from "../controllers/controller.getusuario.js";
import getConnection from "../database/connection.js";
const tableName = process.env.DATAPERFIL;
const tableNameImage = process.env.DATAIMAGEN;

//Función para guardar productos en la base de datos:
export const savePerfilToDatabase = async (product) => {
    let client;
    try {
        const { pool, client: connectedClient } = await getConnection();
        client = connectedClient;

        const query = `
            INSERT INTO ${tableName} (nombre, descripcion, imagen_perfil, usuario_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `;

        const values = [product.nombre, product.descripcion, product.imagen_perfil, product.usuario_id];

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

//Función para guardar imagenes en la base de datos:
export const saveProductToDatabase = async (product) => {
    let client;
    try {
        const { pool, client: connectedClient } = await getConnection();
        client = connectedClient;

        const query = `
            INSERT INTO ${tableNameImage} (titulo, descripcion, imagen, categorias, usuario_id)
            VALUES ($1, $2, $3, $5, $4)
            RETURNING id;
        `;

        const values = [product.titulo, product.descripcion, product.imagen, product.usuario_id, product.categorias];

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
///Imagen
export const updateImageUrlInDatabase = async (id, imageUrl, descripcion, titulo, categorias) => {
    let client;
    try {
        const { client: connectedClient } = await getConnection();
        client = connectedClient;

        const query = `
        UPDATE ${tableNameImage}
        SET imagen = $1, titulo = $3, descripcion = $2, categorias= $4
        WHERE id = $5
        RETURNING imagen;
        `;

        const values = [imageUrl, titulo, descripcion, id, categorias];
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
//perfil
export const updatePerfilInDatabase = async (id, imageUrl, descripcion, nombre) => {
    let client;
    try {

        const { client: connectedClient } = await getConnection();
        client = connectedClient;
        const query = `
        UPDATE ${tableName}
        SET imagen_perfil = $1, nombre = $3, descripcion = $2
        WHERE id= $4
        RETURNING imagen_perfil;
        `;

        const values = [imageUrl, nombre, descripcion, id];
        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            throw new Error('No se encontró la imagen con el ID proporcionado');
        }

        console.log('URL de imagen actualizada en la base de datos:', result.rows[0].imagen_perfil);
        return result.rows[0].imagen_perfil;
    } catch (error) {
        console.error('Error al actualizar la URL de la imagen en la base de datos:', error);
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
};