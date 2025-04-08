import { Transporter } from 'nodemailer';
import { ErrorResult } from '../../utils/response-servece/service-response';

export async function verifyTransporter(transporter: Transporter) {
  try {
    await transporter.verify();
    console.log('✔️ Transportador verificado');
  } catch (err) {
    throw ErrorResult({ status: 500, message: 'Error al verificar el servicio de correo' });
  }
}
