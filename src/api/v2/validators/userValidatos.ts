// import Joi from 'joi';

// // Definir el esquema de validación para el usuario
// const userValidator = Joi.object({
//   username: Joi.string()
//     .min(3)
//     .max(30)
//     .required()
//     .messages({
//       'string.base': '"username" debe ser una cadena de caracteres',
//       'string.empty': '"username" no puede estar vacío',
//       'string.min': '"username" debe tener al menos {#limit} caracteres',
//       'string.max': '"username" no puede exceder los {#limit} caracteres',
//       'any.required': '"username" es un campo obligatorio'
//     }),

//   email: Joi.string()
//     .email()
//     .required()
//     .messages({
//       'string.base': '"email" debe ser una cadena de caracteres',
//       'string.empty': '"email" no puede estar vacío',
//       'string.email': '"email" debe ser un correo electrónico válido',
//       'any.required': '"email" es un campo obligatorio'
//     }),

//   password: Joi.string()
//     .min(8)
//     .required()
//     .messages({
//       'string.base': '"password" debe ser una cadena de caracteres',
//       'string.empty': '"password" no puede estar vacío',
//       'string.min': '"password" debe tener al menos {#limit} caracteres',
//       'any.required': '"password" es un campo obligatorio'
//     }),

//   // Otros campos del usuario, como nombre, teléfono, etc.
//   phoneNumber: Joi.string()
//     .pattern(/^[0-9]{10}$/)  // Aseguramos que sea un teléfono de 10 dígitos
//     .optional()
//     .messages({
//       'string.base': '"phoneNumber" debe ser una cadena de caracteres',
//       'string.empty': '"phoneNumber" no puede estar vacío',
//       'string.pattern.base': '"phoneNumber" debe ser un número de teléfono válido'
//     }),

//   // Validación para un campo opcional como dirección
//   address: Joi.string()
//     .optional()
//     .messages({
//       'string.base': '"address" debe ser una cadena de caracteres'
//     }),
  
// });

// // Función para validar el cuerpo de la solicitud
// const validateUser = (userData: any) => {
//   return userValidator.validate(userData, { abortEarly: false });
// };

// export default validateUser;
