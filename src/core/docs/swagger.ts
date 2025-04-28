// import YAML from 'yamljs';
// import path from 'path';

// const swaggerSpec = YAML.load(path.resolve(__dirname, './definition.swagger.yaml'));
// export default swaggerSpec;




import swaggerJSDoc from 'swagger-jsdoc';
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Marketplace API",
      version: "1.0.0",
      description: "Documentación de la API del Marketplace",
    },
    servers: [{ url: "http://localhost:3005/api" }],
  },
  apis: [
    "./src/api/v1/docs/*.yaml", 
    './src/api/v1/docs/components/**/*.yaml',
    // './src/api/v1/docs/paths/register/index.yaml', 
    // './src/api/v1/docs/paths/register/verifyEmail.yaml', 
  ], // Ubicación de las rutas documentadas
  
};


const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;


