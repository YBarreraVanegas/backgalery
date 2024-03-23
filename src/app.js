import express from 'express';
import cors from 'cors';
import router from './routes/index.rotutes.js';
const app = express();

app.use(router);
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

export default app;