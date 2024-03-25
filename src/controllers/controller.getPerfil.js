import getConnection from "../database/connection.js";
import { config } from "dotenv";
config();

const tableName = process.env.DATAPERFIL;


export const getOnePerfil = async (req, res) => {
    let client;
    try {
        const { id } = req.params;
        const parsedId = parseInt(id);
        if (isNaN(parsedId)) {
            return res.status(400).json({ message: 'Invalid ID provided' });
        }
        const { client: obtainedClient } = await getConnection();
        client = obtainedClient;
        const result = await client.query(`SELECT * FROM ${tableName} WHERE id = $1`, [parsedId]);
        // Verificar si se encontró un producto
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        if (client) {
            client.release();
        }
    }
};
