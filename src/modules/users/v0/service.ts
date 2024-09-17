// services/UserService.ts
import pool from '../../../config/db';
import { findAll, findByPk } from '../../../store';
import { User } from './model'; // Importar la interfaz


const schema = 'user'
const nameTable = 'user'


class UserService {
  // Obtener todos los usuarios
  async findAll(): Promise<User[]> {
    const result = await findAll(schema, nameTable)
    // const result = await pool.query('SELECT * FROM "user".user where id_user = \'1\'');
    return result.map((row) => ({
      id_user: row.id_user,
      email: row.email,
      username: row.username,
      name: row.name,
      firstname: row.firstname,
      lastname: row.lastname,
      phone: row.phone,
      genero: row.genero,
      active: row.active,
      date_create: row.date_create,
      date_update: row.date_update,
    }));
  }

  // Obtener un usuario por ID
  async findByPk(id: string): Promise<User | null> {
    
    // const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const result = await findByPk(schema, nameTable, id)
    if (result.rows.length) {
      const row = result.rows[0];
      return {
        id_user: row.id_user,
        email: row.email,
        username: row.username,
        name: row.name,
        firstname: row.firstname,
        lastname: row.lastname,
        phone: row.phone,
        genero: row.genero,
        active: row.active,
        date_create: row.date_create,
        date_update: row.date_update,
      };
    }
    return null;
  }

}

export default new UserService();
