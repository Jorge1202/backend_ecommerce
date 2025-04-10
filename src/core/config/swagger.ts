import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Marketplace API",
      version: "1.0.0",
      description: "Documentación de la API del Marketplace",
    },
    servers: [{ url: "http://localhost:3005" }],
  },
  apis: ["./src_1/api/v1/docs/**/*.yaml"], // Ubicación de las rutas documentadas
  
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;