**Backend API Documentation**

Este backend maneja las solicitudes enviadas desde el front y crea una API REST para gestionar los datos recibidos.

---

**Documentación del Archivo de Inicio del Servidor**

Este archivo inicia el servidor de la aplicación y lo configura para escuchar las solicitudes entrantes en un puerto específico.

1. **Importación de Módulos y Configuración**
   - `import app from './src/app.js';`: Importa el módulo principal de la aplicación.
   - `import { EventEmitter } from 'events';`: Importa la clase EventEmitter para gestionar eventos.
2. **Configuración de EventEmitter**
   - `EventEmitter.defaultMaxListeners = 20;`: Establece el número máximo de escuchadores en 20.
3. **Configuración del Puerto**
   - `const PORT = process.env.URL || 4000;`: Configura el puerto en el que escuchará el servidor.
4. **Inicio del Servidor**
   - `app.listen(PORT, () => { ... });`: Inicia el servidor y muestra un mensaje en la consola.

---

**Documentación del Enrutador de Express**

1. **Importación de Módulos y Configuración:**

   ```javascript
   import { Router } from 'express'
   import { config } from 'dotenv'
   import multer from 'multer'
   import { saveImage } from '../controllers/controller.create.js'
   import { getAllImages } from '../controllers/controller.get.all.js'
   import { getOneImage } from '../controllers/controller.get.one.js'
   import cors from 'cors'
   import { deleteImage } from '../controllers/controller.delete.js'
   import { updateImage } from '../controllers/controller.update.js'
   cors()
   config()
   const upload = multer({ limits: { fieldSize: 10 * 1024 * 1024 } })
   const router = Router()
   ```

   - **`Router`**: Importa el módulo Router de Express para definir las rutas.
   - **`config`**: Importa la función `config` de dotenv para cargar las variables de entorno.
   - **`multer`**: Importa el módulo Multer para el manejo de archivos en las solicitudes HTTP.
   - **`saveImage`**: Importa la función para guardar imágenes en la base de datos.
   - **`getAllImages`**: Importa la función para obtener todas las imágenes.
   - **`getOneImage`**: Importa la función para obtener una imagen específica por ID.
   - **`cors`**: Importa el módulo CORS para habilitar el intercambio de recursos entre dominios.
   - **`deleteImage`**: Importa la función para eliminar una imagen de la base de datos.
   - **`updateImage`**: Importa la función para actualizar una imagen en la base de datos.

2. **Configuración de Multer:**

   ```javascript
   const upload = multer({ limits: { fieldSize: 10 * 1024 * 1024 } })
   ```

   - **Descripción**: Configura Multer para manejar la carga de archivos con un límite de tamaño de 10 MB.

3. **Creación de Rutas:**

   ```javascript
   router.get('/api', getAllImages)
   router.get('/api/:id', getOneImage)
   router.put('/api', upload.array('imagen', 10), updateImage)
   router.post('/api', upload.array('imagen', 10), saveImage)
   router.delete('/api/:id', deleteImage)
   ```

   - **Ruta GET `/api`**: Obtiene todas las imágenes almacenadas en la base de datos.
   - **Ruta GET `/api/:id`**: Obtiene una imagen específica por ID.
   - **Ruta PUT `/api`**: Actualiza una imagen en la base de datos.
   - **Ruta POST `/api`**: Guarda una nueva imagen en la base de datos.
   - **Ruta DELETE `/api/:id`**: Elimina una imagen de la base de datos por ID.

4. **Configuración de CORS:**

   ```javascript
   cors()
   ```

   - **Descripción**: Habilita el intercambio de recursos entre dominios para permitir solicitudes desde diferentes orígenes.

5. **Exportación del Enrutador:**

   ```javascript
   export default router
   ```

   - **Descripción**: Exporta el enrutador creado para ser utilizado en otras partes de la aplicación.

---

**Documentación de la Función `saveImage`**

1. **Importación de Módulos y Configuración:**

   ```javascript
   import cloudinaryV2 from 'cloudinary'
   import { config } from 'dotenv'
   import sharp from 'sharp'
   import getConnection from '../database/connection.js'
   ```

   - **`cloudinaryV2`**: Importa la biblioteca Cloudinary para la gestión de imágenes.
   - **`config`**: Importa la función `config` de dotenv para cargar las variables de entorno.
   - **`sharp`**: Importa la biblioteca Sharp para la compresión de imágenes.
   - **`getConnection`**: Importa la función para establecer la conexión a la base de datos PostgreSQL.

2. **Configuración de Cloudinary:**

   ```javascript
   config()
   cloudinaryV2.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET,
   })
   ```

   - **Variables de Entorno**: Carga las claves de API de Cloudinary desde el archivo `.env`.

3. **Función `extractFileAndBody`**

   ```javascript
   const extractFileAndBody = (req) => { ... };
   ```

   - **Descripción**: Extrae los archivos y el cuerpo de la solicitud HTTP.

4. **Función `saveImage`**

   ```javascript
   export const saveImage = async (req, res) => { ... };
   ```

   - **Descripción**: Maneja las solicitudes para cargar imágenes a Cloudinary y guardar datos en la base de datos PostgreSQL.
   - **Flujo de la Función**:
     1. Extrae archivos y cuerpo de la solicitud HTTP.
     2. Verifica la existencia y no vaciedad de los archivos.
     3. Comprime las imágenes y las sube a Cloudinary.
     4. Guarda las URLs de las imágenes y otros datos en la base de datos.
     5. Maneja los errores y envía respuestas adecuadas.

5. **Función `compressImage`**

   ```javascript
   const compressImage = async (file) => { ... };
   ```

   - **Descripción**: Comprime las imágenes utilizando la biblioteca Sharp.

6. **Función `cloudinaryUpload`**

   ```javascript
   const cloudinaryUpload = async (file, compressedImagenData) => { ... };
   ```

   - **Descripción**: Sube imágenes comprimidas a Cloudinary y devuelve las URLs de las imágenes.

7. **Función `saveProductToDatabase`**

   ```javascript
   const saveProductToDatabase = async (product) => { ... };
   ```

   - **Descripción**: Guarda los productos en la base de datos PostgreSQL junto con las URLs de las imágenes.

---

**Documentación de getConnection**

Este código establece una conexión a la base de datos PostgreSQL.

1. **Importación de módulos y configuración**
   - Importa la función `config` de dotenv y el módulo pg.
   - Configura las variables de entorno y crea un nuevo objeto `Pool` para manejar conexiones.
2. **Función `getConnection`**
   - Función asincrónica para obtener una conexión a la base de datos.
   - Intenta conectarse a la base de datos y maneja errores adecuadamente.

---

**Documentación de la Función `getImagen`**

1. **Importación de Módulos y Configuración:**

   ```javascript
   import getConnection from '../database/connection.js'
   import { config } from 'dotenv'
   config()
   ```

   - **`getConnection`**: Importa la función `getConnection` para establecer la conexión a la base de datos.
   - **`dotenv`**: Importa la función `config` de dotenv para cargar las variables de entorno.

2. **Variables de Entorno:**

   ```javascript
   const tableName = process.env.DATAIMAGEN
   ```

   - **`tableName`**: Obtiene el nombre de la tabla desde las variables de entorno en `process.env.DATAIMAGEN`.

3. **Función `getImagen`**

   ```javascript
   export const getImagen = async (req, res) => {
     let client
     try {
       const { pool, client: obtainedClient } = await getConnection()
       client = obtainedClient
       const result = await client.query(`SELECT * FROM ${tableName}`)
       res.json(result.rows)
     } catch (error) {
       console.error(error)
       res.status(500).send('Internal Server Error')
     } finally {
       if (client) {
         client.release()
       }
     }
   }
   ```

   - **Descripción**: Esta función maneja las solicitudes para obtener imágenes desde la base de datos PostgreSQL y enviarlas como respuesta en formato JSON.
   - **Variables utilizadas**:
     - `client`: Variable para almacenar el cliente de la conexión.
     - `pool`: Variable para almacenar el pool de conexiones.
   - **Flujo de la Función**:
     1. Establece una conexión a la base de datos utilizando `getConnection`.
     2. Realiza una consulta SQL para seleccionar todas las filas de la tabla especificada en `tableName`.
     3. Devuelve los resultados como una respuesta JSON al cliente.
     4. Maneja los errores internos y envía una respuesta de error 500 si ocurre un problema.
     5. Libera el cliente de la conexión después de completar la consulta en el bloque `finally`.

---

**Documentación de la Función `getOneImage`**

1. **Importación de Módulos y Configuración:**

   ```javascript
   import getConnection from '../database/connection.js'
   import { config } from 'dotenv'
   config()
   ```

   - **`getConnection`**: Importa la función para establecer la conexión a la base de datos PostgreSQL.
   - **`config`**: Importa la función `config` de dotenv para cargar las variables de entorno.

2. **Variables de Entorno Utilizadas:**

   - **`tableName`**: Nombre de la tabla en la base de datos donde se almacenan las imágenes.

3. **Función `getOneImage`**

   ```javascript
   export const getOneImage = async (req, res) => { ... };
   ```

   - **Descripción**: Obtiene una imagen específica de la base de datos según el ID proporcionado en la solicitud.
   - **Parámetros de Entrada**:
     - **`req`**: Objeto de solicitud HTTP que contiene el ID de la imagen a recuperar.
     - **`res`**: Objeto de respuesta HTTP para enviar la respuesta al cliente.
   - **Flujo de la Función**:
     1. Extrae el ID de la imagen de los parámetros de la solicitud.
     2. Verifica si el ID proporcionado es un número válido. Si no es válido, devuelve un error de solicitud con código 400.
     3. Establece una conexión a la base de datos.
     4. Realiza una consulta para obtener la imagen correspondiente al ID proporcionado.
     5. Verifica si se encontró la imagen y envía la respuesta adecuada.
     6. Maneja los errores y envía respuestas de error si es necesario.

4. **Manejo de Respuestas**:

   - **Código 200**: Si se encuentra la imagen, se envía como respuesta en formato JSON.
   - **Código 400**: Si se proporciona un ID inválido, se envía un mensaje indicando el error de solicitud.
   - **Código 404**: Si no se encuentra la imagen, se envía un mensaje indicando que el producto no fue encontrado.
   - **Código 500**: Si ocurre un error interno del servidor, se envía un mensaje de error.

5. **Manejo de Errores**:
   - Se capturan y manejan los errores para evitar que la aplicación se bloquee.
   - Se muestra un mensaje de error genérico en caso de error interno del servidor.

---

**Documentación de la Función `updateImage`**

1. **Importación de Módulos y Configuración:**

   ```javascript
   import cloudinaryV2 from 'cloudinary'
   import { config } from 'dotenv'
   import sharp from 'sharp'
   import getConnection from '../database/connection.js'
   ```

   - **`cloudinaryV2`**: Importa el módulo Cloudinary para el manejo de imágenes en la nube.
   - **`config`**: Importa la función `config` de dotenv para cargar las variables de entorno.
   - **`sharp`**: Importa la biblioteca Sharp para la compresión de imágenes.
   - **`getConnection`**: Importa la función para obtener una conexión a la base de datos.

2. **Configuración de Cloudinary:**

   ```javascript
   config()
   cloudinaryV2.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET,
   })
   ```

   - **Descripción**: Configura Cloudinary con las claves de API obtenidas de las variables de entorno.

3. **Variables Utilizadas:**

   ```javascript
   const tableName = process.env.DATAIMAGEN
   ```

   - **`tableName`**: Almacena el nombre de la tabla en la base de datos donde se guardarán las imágenes.

4. **Función `updateImage`**:

   ```javascript
   export const updateImage = async (req, res) => {
     // Código de la función updateImage
   }
   ```

   - **Descripción**: Función asincrónica para actualizar una imagen en la base de datos y en Cloudinary.

5. **Parámetros de Entrada**:

   - **`req`**: Objeto de solicitud HTTP que contiene los datos de la solicitud.
   - **`res`**: Objeto de respuesta HTTP utilizado para enviar la respuesta al cliente.

6. **Pasos de la Función**:

   - **Verificación de Archivos**: Se verifica si se proporcionó un archivo de imagen en la solicitud.
   - **Guardado en Cloudinary**: Se guarda la nueva imagen en Cloudinary después de comprimirla.
   - **Actualización en la Base de Datos**: Se actualiza la URL de la imagen en la base de datos con el nuevo enlace de Cloudinary.
   - **Respuesta al Cliente**: Se envía una respuesta al cliente indicando el éxito de la actualización.

7. **Excepciones Manejadas**:

   - **Errores al Actualizar**: Se manejan errores que puedan ocurrir durante el proceso de actualización de la imagen.

8. **Exportación de la Función**:

   ```javascript
   export const updateImage = async (req, res) => {
     // Código de la función updateImage
   }
   ```

   - **Descripción**: Exporta la función `updateImage` para que esté disponible para ser utilizada en otras partes de la aplicación.
