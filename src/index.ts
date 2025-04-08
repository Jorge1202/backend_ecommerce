//Punto de entrada para levantar el servidor
import { app } from "./app";
import { config } from "./Config";

const startServer = async () => {
    try {
        
        app.listen(config.api.PORT, () => {
            console.log(`Api escuchando en puerto http://localhost:${config.api.PORT}/api`);
            console.log(`Swagger en: http://localhost:${config.api.PORT}/api-docs`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1); // Salir en caso de error grave
    }
};

startServer();