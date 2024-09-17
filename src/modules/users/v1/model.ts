import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../../config/sequelizeORM'; // Asegúrate de importar tu instancia de Sequelize

export class UserModel extends Model {
  public id_user!: string;
  public email!: string;
  public username!: string;
  public name!: string;
  public firstname!: string;
  public lastname!: string;
  public phone!: string;
  public genero!: string;
  public active!: boolean;
  public date_create!: Date;
  public date_update!: Date;
}

UserModel.init({
  id_user: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
  },
  firstname: {
    type: DataTypes.STRING,
  },
  lastname: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  genero: {
    type: DataTypes.STRING,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  date_create: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  date_update: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  tableName: 'user',
  schema: 'user',
  timestamps: true, // Cambia a true para gestionar automáticamente los timestamps
  createdAt: 'date_create',
  updatedAt: 'date_update',
});

export default UserModel;
