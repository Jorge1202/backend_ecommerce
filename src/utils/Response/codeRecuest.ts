export const statusMessage: Record<number, string> = {
    //#region CÓDIGOS MAS USADOS
        // Respuestas Exitosas (2xx)
        200: 'OK', // La solicitud fue exitosa.
        201: 'Created', // La solicitud fue exitosa y se creó un nuevo recurso.
        204: 'No Content', // La solicitud fue exitosa, pero no hay contenido para enviar.
        206: 'Partial Content', // El servidor está enviando solo una parte del recurso solicitado.
        
        // Respuestas de Redirección (3xx)
        301: 'Moved Permanently', // El recurso solicitado ha sido movido permanentemente a una nueva URL.
        302: 'Found', // El recurso solicitado ha sido encontrado en una URL temporalmente.
        303: 'See Other', // El recurso solicitado se encuentra en una URL diferente.
        304: 'Not Modified', // El recurso no ha sido modificado desde la última solicitud.
        307: 'Temporary Redirect', // El recurso solicitado se ha movido temporalmente a una URL diferente.
        308: 'Permanent Redirect', // El recurso solicitado se ha movido permanentemente a una URL diferente.
        
        // Respuestas de Error del Cliente (4xx)
        //codigos de response
        400: 'Bad Request', //(Error de sintaxis o datos incompletos o inválidos) Se utiliza cuando el servidor no puede procesar la solicitud debido a un error de sintaxis o datos incompletos o inválidos.
        422: 'Unprocessable Entity', // (Reglas de negocio) La solicitud estaba bien formada, pero no se pudo procesar debido a que los datos son lógicamente inválidos o no cumplen con las reglas de negocio.        
        //solo para tokens
        401: 'Unauthorized', // Se requiere autenticación para acceder al recurso.
        403: 'Forbidden', // El servidor entendió la solicitud pero se niega a autorizarla.
        //Metodos para catch
        409: 'Conflict', // (Conflicto con el estado actual del recurso) La solicitud no pudo ser completada debido a un conflicto con el estado actual del recurso. (ejemplo: Intentar registrar un email ya usado.)
        404: 'Not Found', // El recurso solicitado no se encontró en el servidor.
        429: 'Too Many Requests', // El usuario ha enviado demasiadas solicitudes en un período de tiempo dado.
        
        // Respuestas de Error del Servidor (5xx)
        500: 'Internal Server Error', // El servidor encontró un error inesperado al procesar la solicitud.
        501: 'Not Implemented', // El servidor no admite la funcionalidad requerida para cumplir con la solicitud.
        502: 'Bad Gateway', // El servidor recibió una respuesta inválida de un servidor de red.
        503: 'Service Unavailable', // El servidor no está disponible temporalmente (por mantenimiento u otras razones).
        504: 'Gateway Timeout', // El servidor, actuando como puerta de enlace o proxy, no recibió una respuesta a tiempo de un servidor ascendente.
    //#endregion CÓDIGOS MAS USADOS

    //#region CÓDIGOS MENOS USADOS
        // Respuestas Informativas (1xx)
        100: 'Continue', // El servidor ha recibido la solicitud inicial y el cliente debe continuar con la solicitud.
        101: 'Switching Protocols', // El servidor acepta cambiar el protocolo de la solicitud.
        102: 'Processing', // El servidor está procesando la solicitud pero aún no tiene una respuesta final.

        // Respuestas Exitosas (2xx)
        203: 'Non-Authoritative Information', // La solicitud fue exitosa, pero la información podría no ser la misma que la del servidor.        
        205: 'Reset Content', // La solicitud fue exitosa y el cliente debe reiniciar la vista.        
        207: 'Multi-Status', // La respuesta contiene múltiples códigos de estado para diferentes partes de la solicitud.
        208: 'Already Reported', // Los miembros de una colección ya han sido reportados.
        226: 'IM Used', // El servidor ha cumplido con una solicitud de rango para un recurso, y la respuesta es un documento que describe los cambios.

        // Respuestas de Redirección (3xx)
        300: 'Multiple Choices', // Hay múltiples opciones para el recurso solicitado.
        305: 'Use Proxy', // El recurso debe ser accedido a través de un proxy.
        306: 'Switch Proxy', // (No utilizado actualmente)


        // Respuestas de Error del Cliente (4xx)
        402: 'Payment Required', // (Reservado para futuras aplicaciones)        
        405: 'Method Not Allowed', // El método de la solicitud no está permitido para el recurso solicitado.
        406: 'Not Acceptable', // El recurso solicitado no es aceptable según las cabeceras `Accept`.
        407: 'Proxy Authentication Required', // Se requiere autenticación con un proxy para acceder al recurso.
        408: 'Request Timeout', // La solicitud ha tardado demasiado en completarse.
        410: 'Gone', // El recurso solicitado ya no está disponible y no se sabe dónde encontrarlo.
        411: 'Length Required', // El servidor requiere que la solicitud incluya una cabecera `Content-Length`.
        412: 'Precondition Failed', // Una condición previa en la cabecera de la solicitud falló.
        413: 'Payload Too Large', // La carga útil de la solicitud es demasiado grande para procesarla.
        414: 'URI Too Long', // La URI de la solicitud es demasiado larga para el servidor.
        415: 'Unsupported Media Type', // El tipo de medio de la solicitud no es compatible con el servidor.
        416: 'Range Not Satisfiable', // El servidor no puede proporcionar la parte del recurso solicitada.
        417: 'Expectation Failed', // La expectativa en la cabecera de la solicitud no pudo ser satisfecha.
        418: 'I’m a teapot', // (RFC 2324, usado como broma; el servidor se niega a realizar una solicitud de preparación de café en una tetera)
        421: 'Misdirected Request', // La solicitud fue dirigida a un servidor que no es capaz de producir una respuesta.        
        423: 'Locked', // El recurso está bloqueado y no se puede modificar.
        424: 'Failed Dependency', // La solicitud falló debido a una falla en una solicitud previa.
        425: 'Too Early', // La solicitud es demasiado temprana y no puede ser procesada.
        426: 'Upgrade Required', // El servidor requiere que el cliente actualice a un protocolo más reciente.
        428: 'Precondition Required', // El servidor requiere que la solicitud sea condicional.        
        431: 'Request Header Fields Too Large', // Los campos de la cabecera de la solicitud son demasiado grandes.
        451: 'Unavailable For Legal Reasons', // El recurso no está disponible por razones legales.

        // Respuestas de Error del Servidor (5xx)
        505: 'HTTP Version Not Supported', // El servidor no admite la versión del protocolo HTTP utilizada en la solicitud.
        506: 'Variant Also Negotiates', // El servidor tiene una configuración de negociación de contenido incorrecta.
        507: 'Insufficient Storage', // El servidor no puede almacenar la representación requerida para completar la solicitud.
        508: 'Loop Detected', // El servidor detectó un bucle infinito al procesar una solicitud.
        510: 'Not Extended', // La solicitud requiere extensiones adicionales para ser completada.
    //#endregion CÓDIGOS MENOS USADOS


    };
    