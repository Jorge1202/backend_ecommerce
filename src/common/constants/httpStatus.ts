export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    // RESET_CONTENT = 205,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
}

export const HTTP_STATUS = {
    // Respuestas Exitosas (2xx)
    200: { CODE: 200, STATUS: "OK", DESCRIPTION: "La solicitud fue exitosa." },
    201: { CODE: 201, STATUS: "Created", DESCRIPTION: "La solicitud fue exitosa y se creó un nuevo recurso." },
    204: { CODE: 204, STATUS: "No Content", DESCRIPTION: "La solicitud fue exitosa, pero no hay contenido para enviar." },
    205: { CODE: 205, STATUS: "Reset Content", DESCRIPTION: "La solicitud fue exitosa y el cliente debe reiniciar la vista." },
    206: { CODE: 206, STATUS: "Partial Content", DESCRIPTION: "El servidor está enviando solo una parte del recurso solicitado." },

    // Respuestas de Redirección (3xx)
    301: { CODE: 301, STATUS: "Moved Permanently", DESCRIPTION: "El recurso solicitado ha sido movido permanentemente a una nueva URL." },
    302: { CODE: 302, STATUS: "Found", DESCRIPTION: "El recurso solicitado ha sido encontrado en una URL temporalmente." },
    303: { CODE: 303, STATUS: "See Other", DESCRIPTION: "El recurso solicitado se encuentra en una URL diferente." },
    304: { CODE: 304, STATUS: "Not Modified", DESCRIPTION: "El recurso no ha sido modificado desde la última solicitud." },
    307: { CODE: 307, STATUS: "Temporary Redirect", DESCRIPTION: "El recurso solicitado se ha movido temporalmente a una URL diferente." },
    308: { CODE: 308, STATUS: "Permanent Redirect", DESCRIPTION: "El recurso solicitado se ha movido permanentemente a una URL diferente." },
    
    // Respuestas de Error del Cliente (4xx)    
    400: { CODE: 400, STATUS: "Bad Request", DESCRIPTION: "Se utiliza cuando el servidor no puede procesar la solicitud debido a un error de sintaxis o datos incompletos o inválidos." },
    401: { CODE: 401, STATUS: "Unauthorized", DESCRIPTION: "Se requiere autenticación para acceder al recurso." },
    403: { CODE: 403, STATUS: "Forbidden", DESCRIPTION: "El servidor entendió la solicitud pero se niega a autorizarla." },
    404: { CODE: 404, STATUS: "Not Found", DESCRIPTION: "El recurso solicitado no se encontró en el servidor." },
    409: { CODE: 409, STATUS: "Conflict", DESCRIPTION: "La solicitud no pudo ser completada debido a un conflicto con el estado actual del recurso. (ej: email ya usado)." },
    422: { CODE: 422, STATUS: "Unprocessable Entity", DESCRIPTION: "La solicitud estaba bien formada, pero los datos son lógicamente inválidos o no cumplen con las reglas de negocio." },    
    429: { CODE: 429, STATUS: "Too Many Requests", DESCRIPTION: "El usuario ha enviado demasiadas solicitudes en un período de tiempo dado." },
    
    // Respuestas de Error del Servidor (5xx)
    500: { CODE: 500, STATUS: "Internal Server Error", DESCRIPTION: "El servidor encontró un error inesperado al procesar la solicitud." },
    501: { CODE: 501, STATUS: "Not Implemented", DESCRIPTION: "El servidor no admite la funcionalidad requerida para cumplir con la solicitud." },
    502: { CODE: 502, STATUS: "Bad Gateway", DESCRIPTION: "El servidor recibió una respuesta inválida de un servidor de red." },
    503: { CODE: 503, STATUS: "Service Unavailable", DESCRIPTION: "El servidor no está disponible temporalmente (por mantenimiento u otras razones)." },
    504: { CODE: 504, STATUS: "Gateway Timeout", DESCRIPTION: "El servidor, actuando como puerta de enlace o proxy, no recibió una respuesta a tiempo de un servidor ascendente." }  
};

