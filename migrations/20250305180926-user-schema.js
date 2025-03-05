'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      IdUser: {
        type: DataTypes.STRING(50),
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
      schema: 'user',
      timestamps: false,
      indexes: [
        {
          name: "id_user_pkey",
          unique: true,
          fields: [
            { name: "id_user" },
          ]
        },
      ]
    });

    await queryInterface.createTable('auth', {
      IdAuth: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'id_auth'
      },
      Password: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'password'
      },
      Status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'status'
      },
      IdUser: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
          model: 'user',
          key: 'id_user'
        },
        field: 'id_user',
        onUpdate: 'CASCADE', // Actualizar en cascada
        onDelete: 'SET NULL', // Establecer como NULL si el usuario es eliminado
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
      Pw: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'pw'
      },
      Username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'username'
      }
    }, {
      schema: 'user',
      timestamps: false,
    });

    await queryInterface.createTable('code_autentication', {
      IdCodeAutentication: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'id_code_autentication'
      },
      Code: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'code'
      },
      IsActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
        field: 'is_active'
      },
      IdAuth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'auth',
          key: 'id_auth'
        },
        field: 'id_auth',
        onUpdate: 'CASCADE', // Actualizar en cascada
        onDelete: 'CASCADE', // Eliminar en cascada
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
      IdTypeCode: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'type_code',
          key: 'id'
        },
        field: 'id_type_code',
        onUpdate: 'CASCADE', // Actualizar en cascada
        onDelete: 'SET NULL', // Establecer como NULL 
      },
      Description: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'description'
      }
    }, {
      schema: 'user',
      timestamps: false,
    });

    await queryInterface.createTable('device_auth', {
      IdDeviceAuth: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'id_device_auth'
      },
      IdDevice: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'devices',
          key: 'id_devices'
        },
        field: 'id_device',
        onUpdate: 'CASCADE', // Actualizar en cascada
        onDelete: 'SET NULL', // Establecer como NULL 
      },
      IdAuth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'auth',
          key: 'id_auth'
        },
        field: 'id_auth',
        onUpdate: 'CASCADE', // Actualizar en cascada
        onDelete: 'CASCADE', // Establecer como NULL 
      }
    }, {
      schema: 'user',
      timestamps: false,
    });

    await queryInterface.createTable('devices', {
      IdDevices: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'id_devices'
      },
      UserAgent: {
        type: DataTypes.STRING(160),
        allowNull: true,
        field: 'user_agent'
      },
      Plataform: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'plataform'
      },
      Token: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'token'
      },
      Mobile: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        field: 'mobile '
      },
      Ip: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: 'ip'
      },
      Location: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'location'
      },
      VersionPlataform: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'version_plataform'
      },
      Cpu: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'cpu'
      },
      Browser: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'browser'
      },
      IsActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
        field: 'isActive'
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
      schema: 'user',
      timestamps: false,
    });

    await queryInterface.createTable('history_register', {
      Id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'id'
      },
      Email: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'email'
      },
      Name: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'name'
      },
      Firstname: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'firstname'
      },
      Lastname: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'lastname'
      },
      Username: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'username'
      },
      StatusRegister: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
        field: 'status_register'
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
      HasPassword: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        field: 'has_password'
      }
    }, {
      schema: 'user',
      timestamps: false,
    });

    await queryInterface.createTable('login', {
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
        field: 'id_auth',
        onUpdate: 'CASCADE', // Actualizar en cascada
        onDelete: 'SET NULL', // Establecer como NULL 
      },
      IdDeviceAuth: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'device_auth',
          key: 'id_device_auth'
        },
        field: 'id_device_auth',
        onUpdate: 'CASCADE', // Actualizar en cascada
        onDelete: 'SET NULL', // Establecer como NULL 
      }
    }, {
      schema: 'user',
      timestamps: false,
    });

    await queryInterface.createTable('refresh_token', {
      IdRefreshToken: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'id_refresh_token'
      },
      Token: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'token'
      },
      ExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'expires_at'
      },
      IdAuth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'auth',
          key: 'id_auth'
        },
        field: 'id_auth',
        onUpdate: 'CASCADE', // Actualizar en cascada
        onDelete: 'SET NULL', // Establecer como NULL 
      },
      IdDeviceAuth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'device_auth',
          key: 'id_device_auth'
        },
        field: 'id_device_auth',
        onUpdate: 'CASCADE', // Actualizar en cascada
        onDelete: 'SET NULL', // Establecer como NULL 
      },
      LastUsedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'last_used_at'
      },
      IsActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
      }
    }, {
      schema: 'user',
      timestamps: true,
    });

    await queryInterface.createTable('status_auth', {
      Id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'id'
      },
      Status: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'status'
      },
      Description: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'description'
      }
    }, {
      schema: 'user',
      timestamps: false,
    });

    await queryInterface.createTable('status_register', {
      Id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'id'
      },
      Status: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'status'
      },
      Description: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'description'
      }
    }, {
      schema: 'user',
      timestamps: false,
    });

    await queryInterface.createTable('type_code', {
      Id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        field: 'id'
      },
      Type: {
        type: DataTypes.STRING(30),
        allowNull: true,
        field: 'type'
      },
      Description: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'description'
      }
    }, {
      schema: 'user',
      timestamps: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('refresh_token', { schema: 'user' });
    await queryInterface.dropTable('auth', { schema: 'user' });
    await queryInterface.dropTable('devices', { schema: 'user' });
    await queryInterface.dropTable('device_auth', { schema: 'user' });
    await queryInterface.dropTable('code_autentication', { schema: 'user' });
    await queryInterface.dropTable('login', { schema: 'user' });
    await queryInterface.dropTable('user', { schema: 'user' });

  }
};
