import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const logging = process.env.DB_LOGGING === 'true';


const getModelsPath = (version: string) => {
  return path.join(__dirname, `/src/api/${version}/models`); // Esto carga los modelos de la versión indicada
};

const db = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  models: [
    getModelsPath('v1'),
    getModelsPath('v2')
  ], 
  logging: logging ? console.log : false, // Para ver las consultas SQL en la consola
});

export {db};
