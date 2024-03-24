import getConnection from "../database/connection.js";
import { config } from "dotenv";

config();

const tableName = process.env.DATAIMAGEN;

export const deleteImage = async (req, res) => {
    let client;
    try {
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
