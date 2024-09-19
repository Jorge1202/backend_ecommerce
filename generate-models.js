
//npx sequelize-auto -h localhost -d ecommerce -u postgres -x adminadmin12 --dialect postgres --noInitModels --noAlias --caseModel p --caseFile k --caseProp p --lang ts -o "./models"


const fs = require('fs');
const path = require('path');

// Directorio donde se encuentran los modelos generados
const modelsDir = path.join(__dirname, 'models');

// Define el esquema predeterminado
const defaultSchema = 'pages';

// Función para actualizar el archivo del modelo
function updateModelSchema(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Actualiza el esquema en las referencias
  content = content.replace(/references: {\s*model: '(\w+)',\s*key: '(\w+)'}/g, (match, tableName, key) => {
    return `references: {
      model: {
        schema: '${defaultSchema}',
        tableName: '${tableName}'
      },
      key: '${key}'
    }`;
  });

  fs.writeFileSync(filePath, content, 'utf8');
}

// Lee el directorio y actualiza los archivos de modelos
fs.readdir(modelsDir, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    const filePath = path.join(modelsDir, file);
    if (filePath.endsWith('.js')) { // Ajusta la extensión según sea necesario
      updateModelSchema(filePath);
    }
  });
});
