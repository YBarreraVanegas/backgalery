import { config } from 'dotenv';
import pgk from 'pg';

config();
const { Pool } = pgk;
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL_URL
});

const getConnection = async () => {
    try {
        const client = await pool.connect();
        return { client, pool };

    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }

};
export default getConnection;