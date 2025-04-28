import {db} from '../../core/config/database.core'; // Asegúrate de que la ruta sea correcta
import { Transaction } from 'sequelize';

export async function withTransaction<T>(callback: (transaction: Transaction) => Promise<T>): Promise<T> {
  const transaction = await db.transaction();
  try {
    const result = await callback(transaction);
    await transaction.commit(); // ✅ Si todo salió bien, se confirma
    return result; // Retorna el resultado de la transacción
  } catch (error) {
    await transaction.rollback(); // ❌ Si algo falla, se revierte todo
    throw error;
  }
} 
  