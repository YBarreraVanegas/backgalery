import app from './src/app.js';
import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 20;

const PORT = process.env.URL || 4000;

app.listen(PORT, () => {
    console.log('server corriendo en el port', PORT);
});