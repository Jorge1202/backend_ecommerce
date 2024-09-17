// generate-models.js
const SequelizeAuto = require('sequelize-auto');
const auto = new SequelizeAuto('ecommerce', 'postgres', 'adminadmin12', {
  host: 'localhost',
  dialect: 'postgres',
  directory: './models', // Carpeta donde se guardarán los modelos
});

auto.run((err) => {
  if (err) throw err;
  console.log('Models generated successfully!');
});
