import fs from 'fs';
import path from 'path';

// Carpeta para guardar logs
const logDirectory = path.join(__dirname, '../../logs');  
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Crear stream para escribir logs
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, 'access.log'),
  { flags: 'a' }
);

export { accessLogStream };
