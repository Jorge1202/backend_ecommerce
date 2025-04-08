import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Mi Proyecto",
      version: "1.0.0",
      description: "Documentación de mi API con Swagger",
    },
    servers: [{ url: "http://localhost:3005" }],
  },
  apis: ["./src/v1/Routes/*.ts"], // Ubicación de las rutas documentadas
  
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
