import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../../config/sequelizeORM'; // Asegúrate de importar tu instancia de Sequelize

export class AuthModel extends Model {
  public id_auth!: number;
  public password!: string;
  public status!: number;
  public id_user!: string;
  public data_create!: Date;
  public data_update!: Date | null;
}

AuthModel.init({
  id_auth: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_user: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  data_create: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  data_update: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'auth',
  schema: 'public', // Ajusta el esquema según tu configuración
  timestamps: false,
});

export default AuthModel;
