import { Pool } from 'pg';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Configurar la conexión con la base de datos PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

pool.on('connect', () => {
  console.log('Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Error en la conexión con PostgreSQL', err);
  process.exit(-1);
});

// Exportar el pool para usar en las consultas
export default pool;
