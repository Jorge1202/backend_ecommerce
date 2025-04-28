import {app} from './app';
import { connectAndSyncDatabase } from './core/database/connectAndSyn'; // Importar la función de conexión y sincronización de la base de datos 
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3005;

const startServer = async () => {
  try {
    await connectAndSyncDatabase()  // Conectar y sincronizar la base de datos

    console.log(`📄 Swagger en: http://localhost:${PORT}/api/swagger`);

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
