import { sequelize } from '../Database/pg.db/sequelizeORM';
import { Transaction } from 'sequelize';

export async function withTransaction(callback: (transaction: Transaction) => Promise<void>): Promise<void> {
  const transaction = await sequelize.transaction();
  
  try {
    await callback(transaction);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Transaction failed: ${error}`);
  }
}
