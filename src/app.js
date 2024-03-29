import express from 'express';
import cors from 'cors';
import router from './routes/index.rotutes.js';
import { config } from 'dotenv';
const app = express();
config();
const corsOptions = {
    origin: 'https://fotofascinante.onrender.com' && process.env.URL_DEV,
    optionsSuccessStatus: 200, // Algunos navegadores antiguos (como IE11) pueden necesitar esto para que funcione el CORS
};
app.use(cors(corsOptions));
app.use(router);
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

export default app;
