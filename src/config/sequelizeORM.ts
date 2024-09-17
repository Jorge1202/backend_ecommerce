// sequelize.config.ts
import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno desde un archivo .env

// Definir los posibles entornos
type Environment = 'development' | 'test' | 'production';

// Configuración de la base de datos
const dbConfig = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'adminadmin12',
    database: process.env.DB_DATABASE || 'ecommerce',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres' as const,
  },
  test: {
    username: process.env.DB_USER || 'test_user',
    password: process.env.DB_PASSWORD || 'test_password',
    database: process.env.DB_DATABASE || 'test_database',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres' as const,
  },
  production: {
    username: process.env.DB_USER || 'test_user',
    password: process.env.DB_PASSWORD || 'test_password',
    database: process.env.DB_DATABASE || 'test_database',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres' as const,
    // Puedes agregar opciones adicionales para producción
  },
};

// Selección de configuración según el entorno
const environment: Environment = (process.env.NODE_ENV as Environment) || 'development';
const config = dbConfig[environment];

// Creación de la instancia de Sequelize
const sequelize = new Sequelize({
  dialect: config.dialect,
  host: config.host,
  database: config.database,
  username: config.username,
  password: config.password,
  // models: [__dirname + '/models'], // Ruta a los modelos
  
  // Opciones adicionales de Sequelize
  // logging: environment === 'development', // Habilitar logging solo en desarrollo
  logging: false, // Habilitar logging solo en desarrollo
});


// Verificar la conexión a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('Conectado a PostgreSQL by ORM');
  })
  .catch((error) => {
    console.error('No se pudo conectar a la base de datos:', error);
  });

  // Sincronizar la base de datos
  sequelize.sync({ force: false, alter: true })
  .then(() => {
    console.log('Base de datos sincronizada');
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
  });

export { sequelize };



// import { Pool } from 'pg';
// import dotenv from 'dotenv';

// // Cargar las variables de entorno desde el archivo .env
// dotenv.config();

// // Configurar la conexión con la base de datos PostgreSQL
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_DATABASE,
//   password: process.env.DB_PASSWORD,
//   port: Number(process.env.DB_PORT),
// });

// pool.on('connect', () => {
//   console.log('Conectado a PostgreSQL');
// });

// pool.on('error', (err) => {
//   console.error('Error en la conexión con PostgreSQL', err);
//   process.exit(-1);
// });

// // Exportar el pool para usar en las consultas
// export default pool;
