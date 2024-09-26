//Punto de entrada para levantar el servidor
import { app } from "./app";
import { config } from "./Config";
const cors = require("cors"); 

const startServer = async () => {
    try {
        //await connectDatabase(); // Conectar a la base de datos
        //#region CORS
        var corsOptions = {
            origin: config.CORS.origin,
            optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        };
        app.use(cors(corsOptions));
        //#endregion


        app.listen(config.api.PORT, () => {
            console.log(`Api escuchando en puerto http://localhost:${config.api.PORT}/api`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1); // Salir en caso de error grave
    }
};

startServer();