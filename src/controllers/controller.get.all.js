import getConnection from "../database/connection.js";
import { config } from "dotenv";
config();

const tableName = process.env.DATAIMAGEN;
const tableNamePerfil = process.env.DATAPERFIL;

export const getAllImages = async (req, res) => {
    let client;
    try {
        const { pool, client: obtainedClient } = await getConnection();
        client = obtainedClient;
        const result = await client.query(`SELECT * FROM ${tableName}`);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        if (client) {
            client.release();
        }
    }
};
export const getAllPerfils = async (req, res) => {
    let client;
    try {
        const { pool, client: obtainedClient } = await getConnection();
        client = obtainedClient;
        const result = await client.query(`SELECT * FROM ${tableNamePerfil}`);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        if (client) {
            client.release();
        }
    }
};