// import * as Sequelize from 'sequelize';
// import { DataTypes, Model, Optional } from 'sequelize';
// import type { Auth, AuthId } from './auth';

// export interface LoginAttributes {
//   IdLogin: number;
//   Active?: boolean;
//   DateCreate?: Date;
//   DateUpdate?: Date;
//   IdAuth?: number;
//   IdDevice?: number;
// }

// export type LoginPk = "IdLogin";
// export type LoginId = Login[LoginPk];
// export type LoginOptionalAttributes = "IdLogin" | "Active" | "DateCreate" | "DateUpdate" | "IdAuth" | "IdDevice";
// export type LoginCreationAttributes = Optional<LoginAttributes, LoginOptionalAttributes>;

// export class Login extends Model<LoginAttributes, LoginCreationAttributes> implements LoginAttributes {
//   IdLogin!: number;
//   Active?: boolean;
//   DateCreate?: Date;
//   DateUpdate?: Date;
//   IdAuth?: number;
//   IdDevice?: number;

//   // Login belongsTo Auth via IdAuth
//   IdAuthAuth!: Auth;
//   getIdAuthAuth!: Sequelize.BelongsToGetAssociationMixin<Auth>;
//   setIdAuthAuth!: Sequelize.BelongsToSetAssociationMixin<Auth, AuthId>;
//   createIdAuthAuth!: Sequelize.BelongsToCreateAssociationMixin<Auth>;

//   static initModel(sequelize: Sequelize.Sequelize): typeof Login {
//     return Login.init({
//     IdLogin: {
//       autoIncrement: true,
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true,
//       field: 'id_login'
//     },
//     Active: {
//       type: DataTypes.BOOLEAN,
//       allowNull: true,
//       defaultValue: true,
//       field: 'active'
//     },
//     DateCreate: {
//       type: DataTypes.DATE,
//       allowNull: true,
//       field: 'date_create'
//     },
//     DateUpdate: {
//       type: DataTypes.DATE,
//       allowNull: true,
//       field: 'date_update'
//     },
//     IdAuth: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'auth',
//         key: 'id_auth'
//       },
//       field: 'id_auth'
//     },
//     IdDevice: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       field: 'id_device'
//     }
//   }, {
//     sequelize,
//     tableName: 'login',
//     schema: 'user',
//     timestamps: true, // Utiliza timestamps automáticos
//     createdAt: 'DateCreate',
//     updatedAt: 'DateUpdate',
//     hooks: {
//       beforeCreate: (login: Login) => {
//         const now = new Date();
//         login.DateCreate = now;
//         login.DateUpdate = now;
//       },
//       beforeUpdate: (login: Login) => {
//         login.DateUpdate = new Date();
//       }
//     },
//     indexes: [
//       {
//         name: "login_pkey",
//         unique: true,
//         fields: [
//           { name: "id_login" },
//         ]
//       },
//     ]
//   });
//   }
// }


import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Auth, AuthId } from './auth';
import type { Devices, DevicesId } from './devices';

export interface LoginAttributes {
  IdLogin: number;
  Active?: boolean;
  DateCreate?: Date;
  DateUpdate?: Date;
  IdAuth?: number;
  IdDevice?: number;
}

export type LoginPk = "IdLogin";
export type LoginId = Login[LoginPk];
export type LoginOptionalAttributes = "IdLogin" | "Active" | "DateCreate" | "DateUpdate" | "IdAuth" | "IdDevice";
export type LoginCreationAttributes = Optional<LoginAttributes, LoginOptionalAttributes>;

export class Login extends Model<LoginAttributes, LoginCreationAttributes> implements LoginAttributes {
  IdLogin!: number;
  Active?: boolean;
  DateCreate?: Date;
  DateUpdate?: Date;
  IdAuth?: number;
  IdDevice?: number;

  // Login belongsTo Auth via IdAuth
  IdAuthAuth!: Auth;
  getIdAuthAuth!: Sequelize.BelongsToGetAssociationMixin<Auth>;
  setIdAuthAuth!: Sequelize.BelongsToSetAssociationMixin<Auth, AuthId>;
  createIdAuthAuth!: Sequelize.BelongsToCreateAssociationMixin<Auth>;
  // Login belongsTo Devices via IdDevice
  IdDeviceDevice!: Devices;
  getIdDeviceDevice!: Sequelize.BelongsToGetAssociationMixin<Devices>;
  setIdDeviceDevice!: Sequelize.BelongsToSetAssociationMixin<Devices, DevicesId>;
  createIdDeviceDevice!: Sequelize.BelongsToCreateAssociationMixin<Devices>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Login {
    return Login.init({
    IdLogin: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_login'
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
    },
    IdAuth: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'auth',
        key: 'id_auth'
      },
      field: 'id_auth'
    },
    IdDevice: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'devices',
        key: 'id_devices'
      },
      field: 'id_device'
    }
  }, {
    sequelize,
    tableName: 'login',
    schema: 'user',
    timestamps: false,
    indexes: [
      {
        name: "login_pkey",
        unique: true,
        fields: [
          { name: "id_login" },
        ]
      },
    ]
  });
  }
}
