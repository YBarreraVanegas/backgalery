import bcrypt from 'bcrypt';
import multer from 'multer';
import getConnection from '../database/connection.js';
import { authenticateUser } from '../middelware/middel.js';
import jw from 'jsonwebtoken';
const saltRounds = 10;
const secretKey = process.env.SECRETKEY;
const upload = multer().none();
const { pool } = await getConnection();

export const registerUser = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            console.error('Error al subir el formulario:', err);
            return res.status(500).send('Internal Server Error');
        }

        const { email, password_hash } = req.body;
        console.log({ email, password_hash });
        try {
            const hashedPassword = await bcrypt.hash(password_hash, saltRounds);

            // Insertar el usuario en la base de datos

            const result = await pool.query(
                'INSERT INTO usuarios (email, password_hash) VALUES ($1, $2) RETURNING id, email',
                [email, hashedPassword]
            );

            // Generar token JWT
            const token = jw.sign({ userId: result.rows[0].id, email: result.rows[0].email }, secretKey, { expiresIn: '1h' });

            res.status(201).json({ id: result.rows[0].id, email: result.rows[0].email, token }); // Devolver el token en la respuesta
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(500).send('Internal Server Error');
        }
    });
};



export const loginUser = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            console.error('Error al subir el formulario:', err);
            return res.status(500).send('Internal Server Error');
        }
        const { email, password } = req.body;

        try {
            // Verificar la autenticación del usuario y generar token JWT
            const user = await authenticateUser(email, password);
            const token = jw.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

            res.status(200).json({ token });
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            res.status(500).send('Internal Server Error');
        }
    });
};