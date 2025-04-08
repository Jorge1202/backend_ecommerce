"use strict";
// const express = require('express');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const app = express();
// app.use(express.json());
// const users = []; // Base de datos simulada
// const refreshTokens = []; // Aquí se almacenan los refresh tokens
// // Claves secretas para los tokens
// const ACCESS_TOKEN_SECRET = 'your_access_token_secret';
// const REFRESH_TOKEN_SECRET = 'your_refresh_token_secret';
// // Función para generar tokens
// function generateAccessToken(user) {
//   return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '15m' }); // Access token con caducidad de 15 minutos
// }
// function generateRefreshToken(user) {
//   const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET);
//   refreshTokens.push(refreshToken); // Guardar el refresh token
//   return refreshToken;
// }
// // Registro de usuario (simple)
// app.post('/register', async (req, res) => {
//   const { username, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   users.push({ username, password: hashedPassword });
//   res.send('Usuario registrado');
// });
// // Login de usuario
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   const user = users.find(u => u.username === username);
//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(403).send('Usuario o contraseña incorrectos');
//   }
//   const accessToken = generateAccessToken({ username });
//   const refreshToken = generateRefreshToken({ username });
//   res.json({ accessToken, refreshToken });
// });
// // Endpoint para refrescar el token
// app.post('/token', (req, res) => {
//   const { token } = req.body;
//   if (!token) return res.sendStatus(401);
//   if (!refreshTokens.includes(token)) return res.sendStatus(403);
//   jwt.verify(token, REFRESH_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     const accessToken = generateAccessToken({ username: user.username });
//     res.json({ accessToken });
//   });
// });
// // Endpoint protegido (requiere un token válido)
// app.get('/protected', authenticateToken, (req, res) => {
//   res.send('Acceso a la información protegida');
// });
// // Middleware para autenticar el token de acceso
// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (!token) return res.sendStatus(401);
//   jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }
// // Iniciar el servidor
// app.listen(3000, () => {
//   console.log('Servidor en ejecución en http://localhost:3000');
// });
