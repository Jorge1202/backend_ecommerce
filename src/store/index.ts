import { QueryResult } from 'pg'; // npm install pg
import pool from './db';
//#region ######################## FUNCIONES UTILITARIAS

// Consulta genérica para obtener todos los registros de una tabla
export const findAll = async (schema: string, table: string): Promise<any[]> => {
    try {
      const query = `SELECT * FROM ${schema}.${table}`;
      const result = await pool.query(query);
    //   console.log(`get all => ${table}`);
      return result.rows; // Devolvemos solo las filas
    } catch (err) {
      console.error(`Error obteniendo lista de ${table}:`, err);
      throw err;
    }
};
  
// Consulta genérica para obtener un registro por ID
export const findByPk = async (schema: string, table: string, id: string | number): Promise<any> => {
  try {

    const query = `SELECT * FROM "${schema}"."${table}" WHERE id_${table} = $1`;
    console.log(query);
    
    const result = await pool.query(query, [id]);
    // console.log(`get id => ${id} from table => ${table}`);
    return result.rows[0];
  } catch (err) {
    console.error(`Error obteniendo registro con id ${id} de ${table}:`, err);
    throw err;
  }
};

// Consulta con una cláusula WHERE dinámica
export const findByCondition = async (table: string, whereClause: string): Promise<any> => {
  try {
    const query = `SELECT * FROM ${table} WHERE ${whereClause}`;
    const result = await pool.query(query);
    // console.log(`get where => ${whereClause} from table => ${table}`);
    return result.rows;
  } catch (err) {
    console.error(`Error obteniendo registros de ${table} con where ${whereClause}:`, err);
    throw err;
  }
};

// Inserción de un registro
export const createData = async (table: string, data: any): Promise<number> => {
  try {
    const keys = Object.keys(data).join(',');
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(',');

    const query = `INSERT INTO ${table} (${keys}) VALUES (${placeholders}) RETURNING id`;
    const result = await pool.query(query, values);
    // console.log(`insert into ${table} =>`, data);

    return result.rows[0].id;
  } catch (err) {
    console.error(`Error insertando en ${table}:`, err);
    throw err;
  }
};

// Inserción masiva de registros
export const insertMany = async (table: string, data: any[]): Promise<void> => {
  try {
    const keys = Object.keys(data[0]);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(',');

    const values = data.map((item) => Object.values(item));
    const query = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`;

    await pool.query(query, values);
    // console.log(`insert many into ${table}`);
  } catch (err) {
    console.error(`Error insertando masivamente en ${table}:`, err);
    throw err;
  }
};

// Actualización de un registro por ID
export const updateById = async (table: string, id: string | number, data: any): Promise<void> => {
  try {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

    const query = `UPDATE ${table} SET ${setClause} WHERE id = $${keys.length + 1}`;
    await pool.query(query, [...values, id]);
    // console.log(`update ${table} with id => ${id}`);
  } catch (err) {
    console.error(`Error actualizando ${table} con id ${id}:`, err);
    throw err;
  }
};

// Eliminación de registros con cláusula WHERE
export const deleteById = async (table: string, whereClause: string): Promise<void> => {
  try {
    const query = `DELETE FROM ${table} WHERE ${whereClause}`;
    await pool.query(query);
    // console.log(`delete from ${table} where ${whereClause}`);
  } catch (err) {
    console.error(`Error eliminando de ${table} con where ${whereClause}:`, err);
    throw err;
  }
};

//#endregion

//#region ######################## PROCEDIMIENTOS ALMACENADOS

// Llamada a un procedimiento almacenado
export const callStoredProcedure = async (procedure: string, params: any[] = []): Promise<QueryResult<any>> => {
  try {
    const placeholders = params.map((_, index) => `$${index + 1}`).join(',');
    const query = `CALL ${procedure}(${placeholders})`;
    const result = await pool.query(query, params);
    // console.log(`call procedure ${procedure}`);
    return result;
  } catch (err) {
    console.error(`Error llamando al procedimiento ${procedure}:`, err);
    throw err;
  }
};

//#endregion
