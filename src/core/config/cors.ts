
const CORS = {
    origin: process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:3000',
      'http://192.168.1.70:3000',
    ],
}

const corsOptions = {
    origin: CORS.origin, // Permite solicitudes desde tu frontend en localhost:3000
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
    credentials: true, // Si necesitas enviar cookies o cabeceras de autenti.cación
    optionsSuccessStatus: 200 // Para algunos navegadores antiguos (como IE)
};

export { corsOptions }