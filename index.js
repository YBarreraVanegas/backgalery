import app from './src/app.js';
import { config } from 'dotenv';
config();
const PORT = process.env.URL || 4000;

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(PORT, () => {
    console.log('Servidor corriendo en el puerto', PORT);
});
