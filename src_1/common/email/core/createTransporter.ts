import nodemailer from 'nodemailer';
import { config } from '../../../core/config/mail.config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export async function createTransporter() {
  const options: SMTPTransport.Options = {
    host: config._host,
    port: config._port,
    secure: config._secure,
    auth: {
      user: config._user,
      pass: config._pass,
    },
  };
  return nodemailer.createTransport(options);
}
