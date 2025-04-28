Estructura final 
/proyecto
 ├── src/                          # Código fuente principal

 │   ├── api/                      # Reciben peticiones, validan y responden
 │   │   ├── models/               # Versión 1 de la API
 │   │   │   ├── shared/           # Si hay modelos en comun se pueden incluir en esta carpeta
 │   │   │   ├── initModels.ts     # Inicializa los modelos
 │   │   ├── v1/                   # Versión 1 de la API
 │   │   │   ├── controllers/      # Controladores, gestionan la lógica de las rutas (responden las peticiones)
 │   │   │   ├── docs/             # Documentación swagger 
 │   │   │   │   ├── paths/              # Archivos de operacion 
 │   │   │   │   ├── /paths.swagger.yaml # Paths
 │   │   │   ├── services/         # Lógica de negocio, procesamiento de datos
 │   │   │   ├── models/           # Modelos de base de datos (por ejemplo, Sequelize models)
 │   │   │   ├── routes/           # Rutas de la API para esta versión
 │   │   │   ├── test/             # Pruebas unitarias y de integración para v1
 │   │   │   ├── validators/       # Funciones para validar datos de entrada
 │   │   ├── v2/                   # Versión 2 de la API
 │   │   │   ├── controllers/      # Controladores, gestionan la lógica de las rutas (responden las peticiones)
 │   │   │   ├── docs/             # Documentación swagger 
 │   │   │   │   ├── paths/              # Archivos de operacion 
 │   │   │   │   ├── /paths.swagger.yaml # Paths
 │   │   │   ├── services/         # Lógica de negocio, procesamiento de datos
 │   │   │   ├── models/           # Modelos de base de datos (por ejemplo, Sequelize models)
 │   │   │   ├── routes/           # Rutas de la API para esta versión
 │   │   │   ├── test/             # Pruebas unitarias y de integración para v2
 │   │   │   ├── validators/       # Funciones para validar datos de entrada

 │   ├── common/                   # (Tipos y recursos compartidos) Ideal para evitar duplicación de código y tener centralizado lo compartido.
 │   │   ├── constants/            # Constantes globales
 │   │   │   ├── httpStatus.ts     # Códigos de estado HTTP con descripciones
 │   │   ├── database/             # Conexión a la base de datos y helpers
 │   │   │   ├── transaction_helper.ts   # Funciones auxiliares para manejar transacciones en DB
 │   │   ├── mail/                 # Envío de correos
 │   │   │   ├── core/             # Lógica centralizada para el envío de correos
 │   │   │   ├── templates/        # Plantillas de correos
 │   │   │   ├── index.ts          # Punto de entrada para el servicio de correo
 │   │   │   ├── MailProcessor.ts  # Procesador de correos
 │   │   ├── interfaces/           # Interfaces y tipos globales
 │   │   │   ├── config.ts         # Interfaces para la configuración global
 │   │   │   ├── mails.ts          # Interfaces relacionadas con el sistema de correos
 │   │   ├── middlewares/          # Funciones intermedias (auth, logs, validaciones)
 │   │   │   ├── errorsr.ts        # Middleware para manejo de errores
 │   │   ├── utils/                # (Funciones auxiliares puras) Funciones pequeñas, puras, independientes, que no pertenecen a un dominio en específico.
 │   │   │   ├── response-controller/ # Funciones para controlar las respuestas de la API
 │   │   │   ├── response-service/   # Servicios para manipular y devolver respuestas

 │   ├── core/                               # (Lógica de negocio) Ideal para tener la lógica central de la app
 │   │   ├── config/               # Configuración general del sistema
 │   │   │   ├── database.ts       # Configuración de la base de datos
 │   │   │   ├── swagger.ts        # Configuración de Swagger para la documentación de la API
 │   │   │   ├── security.ts      # Configuración de JWT y seguridad general
 │   │   ├── database/             # Conexión a la base de datos
 │   │   │   ├── connectAndSyn.ts   # Funciones apara la coneccion y sincronizacion de la bd
 │   │   ├── docs/                           # Configuración de la documentación
 │   │   │   ├── definition.swagger.yaml     # Definicion de swagger
 │   │   │   ├── swagger.ts        # Configuración de Swagger para la documentación de la API
 │   │   ├── logger/               # Configuración de logs para registrar errores y actividades
 │   │   │   ├── index.ts          # Punto de entrada de configuración de 
 
 │   ├── routes/                   # Definición y gestión de las rutas de la API
 │   │   ├── index.ts              # Archivo principal para la gestión de las rutas

 │   ├── logs/                     # Archivos de registro (logs) del servidor
 │   │   ├── access.log            # Registro de accesos y solicitudes a la API
 │   │   ├── app.log               # Registro de eventos generales de la aplicación (errores, información)

 │   ├── types/                     # 
 │   │   ├── express/               # 
 │   │   │   ├── index.d.ts          # 

 │   ├── app.ts                    # Configuración principal de Express, middlewares globales, etc.
 │   ├── index.ts                  # Punto de entrada del servidor, donde se inicializa la app
 ├── node_modules/                 # Dependencias instaladas por npm
 ├── package.json                  # Configuración del proyecto y dependencias
 ├── README.md                     # Documentación del proyecto
