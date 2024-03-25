import jw from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import getConnection from '../database/connection.js';
import multer from 'multer';
const upload = multer().none();
const secretKey = process.env.SECRETKEY;
// Middleware para verificar el token de autenticación
export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Token de autenticación no proporcionado' });
    }

    // Verificar y decodificar el token
    jw.verify(token.replace('Bearer ', ''), secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token de autenticación inválido' });
        }

        // Si el token es válido, se decodifica y se agrega al objeto req para usarlo en las rutas protegidas
        req.userId = decoded.userId;
        next();
    });
};
// Middleware de autenticación
export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Token de autenticación no proporcionado' });
    }

    jw.verify(token.replace('Bearer ', ''), secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token no válido' });
        }
        req.user = decoded; // Guardar el usuario decodificado en el objeto de solicitud
        next();
    });
};
// Función para autenticar al usuario
export const authenticateUser = async (email, password) => {
    try {
        const { pool } = await getConnection();
        // Buscar el usuario por email en la base de datos
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            throw new Error('Correo electrónico no registrado');
        }

        const user = result.rows[0];

        // Comparar la contraseña hasheada
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            throw new Error('Contraseña incorrecta');
        }

        return user; // Devolver el usuario autenticado
    } catch (error) {
        throw error;
    }
};
export const auth = async (req, res) => {


    upload(req, res, async function (err) {
        if (err) {
            console.error('Error al subir el formulario:', err);
            return res.status(500).send('Internal Server Error');
        }

        const { email, password } = req.body;

        try {
            const user = await authenticateUser(email, password);
            const token = jw.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
            res.json({ token });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    });
};