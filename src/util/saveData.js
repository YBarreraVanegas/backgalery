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


export const addFavInData = async (id, nuevoFavorito, nuevoGuardado) => {
    let client;
    try {
        // Obtener la conexión a la base de datos
        const { client: connectedClient } = await getConnection();
        client = connectedClient;

        // Consultar el perfil actual para obtener los favoritos actuales
        const consultaPerfil = `
            SELECT favoritos, guardados
            FROM ${tableName}
            WHERE id = $1;
        `;
        const perfilResult = await client.query(consultaPerfil, [id]);
        let favoritosActuales = perfilResult.rows[0]?.favoritos || [];
        let guardadosActuales = perfilResult.rows[0]?.guardados || [];

        // Verificar si el nuevo guardado ya existe en la lista actual
        if (nuevoGuardado !== undefined && guardadosActuales.includes(nuevoGuardado)) {
            throw new Error('El valor ya existe en la lista de guardados');
        }

        // Si el nuevo guardado no existe en la lista actual, agregarlo
        if (nuevoGuardado !== undefined) {
            guardadosActuales.push(nuevoGuardado);
        }

        // Verificar si el nuevo favorito ya existe en la lista actual
        if (nuevoFavorito !== undefined && favoritosActuales.includes(nuevoFavorito)) {
            throw new Error('El valor ya existe en la lista de favoritos');
        }

        // Si el nuevo favorito no existe en la lista actual, agregarlo
        if (nuevoFavorito !== undefined) {
            favoritosActuales.push(nuevoFavorito);
        }

        // Actualizar la columna favoritos y guardados con los nuevos valores
        const query = `
            UPDATE ${tableName}
            SET favoritos = $1,
                guardados = $2
            WHERE id = $3
            RETURNING favoritos, guardados;
        `;

        // Ejecutar la consulta con los valores proporcionados
        const values = [favoritosActuales, guardadosActuales, id];
        const result = await client.query(query, values);

        // Verificar si se encontró el perfil y actualizar los favoritos
        if (result.rows.length === 0) {
            throw new Error('No se encontró el perfil con el ID proporcionado');
        }

        // Mostrar los favoritos y guardados actualizados en la base de datos
        console.log('Favoritos actualizados en la base de datos:', result.rows[0].favoritos);
        console.log('Guardados actualizados en la base de datos:', result.rows[0].guardados);

        // Devolver los favoritos actualizados
        return result.rows[0].favoritos;
    } catch (error) {
        // Manejar errores durante la actualización
        console.error('Error al actualizar los favoritos en la base de datos:', error.message);
        throw error;
    } finally {
        // Liberar la conexión al cliente de la base de datos
        if (client) {
            client.release();
        }
    }
};






