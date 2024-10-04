import { DataMail } from "../mail";

export const newDevice = (param:DataMail):string =>  `
    <tr>
        <td>
            <table style='width: 100%; padding: 25px 50px;'>
                <tr>
                    <td style='font-size:18px; line-height: 22px; font-weight: bold; text-align: center; text-align: center;'>
                        Verificación de dispositivo
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td>
            <table style='width: 100%; padding: 0px 60px 25px 60px;'>
                <tr>
                    <td style='font-size:12px; line-height: 40px;'>
                        Hola <strong>${param.name} ${param.firstname}</strong>.
                    </td> 
                </tr>
                <tr>
                    <td style='font-size: 12px; text-align: justify; line-height: 22px;'>
                        Se ha detectado un inicio de sesión a ${param.company} desde un nuevo dispositivo <br/>
                        Para acceder al sistema ingresa el siguiente código.
                    </td>   
                </tr>
                <tr>
                    <td>
                        <table align='left' border='0' cellpadding='0' cellspacing='0' style='width: 100%; margin: 15px 0px; line-height: 22px; font-size: 12px; text-align: justify;'>  
                            <tr><td>El código de verificación es: <strong style='letter-spacing: 2pt; font-size: 15px;'>${param.code}</strong></td></tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style='font:15px/1.25em Helvetica Neue,Arial,Helvetica; font-size: 12px; text-align: justify; line-height: 22px;'>
                        <strong style='letter-spacing: 2pt; font-size: 15px;'>Importante:</strong> Si no has sido tu, es posible que otra persona esté intentando acceder a tu cuenta de ${param.company}. 
                        Por seguridad no reenvíes ni proporciones este código a otra persona.
                    </td>   
                </tr>
                <tr>
                    <td>
                        <table align='left' border='0' cellpadding='0' cellspacing='0' style='width: 100%; margin: 15px 0px; line-height: 22px; font-size: 12px;'>  
                            <tr><td>Un saludo.</td> </tr>
                            <tr><td>El equipo ${param.company}.</td></tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
`;

