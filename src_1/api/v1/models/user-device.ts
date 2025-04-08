import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface UserDeviceAttributes {
  IdUserDevice: number;
  IdDevice: number;
  IdAuth: number;
}

export type UserDevicePk = "IdUserDevice";
export type UserDeviceId = UserDevice[UserDevicePk];
export type UserDeviceOptionalAttributes = "IdUserDevice";
export type UserDeviceCreationAttributes = Optional<UserDeviceAttributes, UserDeviceOptionalAttributes>;

export class UserDevice extends Model<UserDeviceAttributes, UserDeviceCreationAttributes> implements UserDeviceAttributes {
  IdUserDevice!: number;
  IdDevice!: number;
  IdAuth!: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof UserDevice {
    return UserDevice.init({
    IdUserDevice: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'id_userDevice'
    },
    IdDevice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_device'
    },
    IdAuth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_auth'
    }
  }, {
    sequelize,
    tableName: 'user_device',
    schema: 'user',
    timestamps: false,
    indexes: [
      {
        name: "user_device_pkey",
        unique: true,
        fields: [
          { name: "id_userDevice" },
        ]
      },
    ]
  });
  }
}
