import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface UserAttributes {
  IdUser: string;
  Email: string;
  Username: string;
  Name: string;
  Firstname: string;
  Lastname?: string;
  Phone?: string;
  Genero?: string;
  Active?: boolean;
  DateCreate?: Date;
  DateUpdate?: Date;
}

export type UserPk = "IdUser";
export type UserId = User[UserPk];
export type UserOptionalAttributes = "IdUser" | "Lastname" | "Phone" | "Genero" | "Active" | "DateCreate" | "DateUpdate";
export type UserCreationAttributes = Optional<UserAttributes, UserOptionalAttributes>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  IdUser!: string;
  Email!: string;
  Username!: string;
  Name!: string;
  Firstname!: string;
  Lastname?: string;
  Phone?: string;
  Genero?: string;
  Active?: boolean;
  DateCreate?: Date;
  DateUpdate?: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof User {
    return User.init({
    IdUser: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      field: 'id_user'
    },
    Email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'email'
    },
    Username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'username'
    },
    Name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'name'
    },
    Firstname: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'firstname'
    },
    Lastname: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'lastname'
    },
    Phone: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'phone'
    },
    Genero: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'genero'
    },
    Active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      field: 'active'
    },
    DateCreate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'date_create'
    },
    DateUpdate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'date_update'
    }
  }, {
    sequelize,
    tableName: 'user',
    schema: 'user',
    timestamps: true, // ✅ activa los timestamps
    createdAt: 'DateCreate', 
    updatedAt: 'DateUpdate',
    indexes: [
      {
        name: "id_user_pkey",
        unique: true,
        fields: [
          { name: "id_user" },
        ]
      },
      {
        name: "user_pkey",
        unique: true,
        fields: [
          { name: "id_user" },
        ]
      },
    ]
  });
  }
}
