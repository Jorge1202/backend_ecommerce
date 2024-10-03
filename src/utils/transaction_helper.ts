import { sequelize } from '../Database/sequelizeORM';
import { Transaction } from 'sequelize';

export async function withTransaction<T>(callback: (transaction: Transaction) => Promise<T>): Promise<T> {
  const transaction = await sequelize.transaction();
  try {
    const result = await callback(transaction);
    await transaction.commit();
    return result; // Retorna el resultado de la transacción
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
  