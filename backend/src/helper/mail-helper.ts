import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export const Sender = {
  REGISTRATION: "registration@scribe.sauriel.net"
}

export declare type MailConfig = Mail.Options;

const transporter = nodemailer.createTransport({
  service: process.env.NODEMAILER_SERVICE,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  }
});

export default class MailHelper {

  public static sendMail(mail: MailConfig) {
    transporter.sendMail(mail, (err, info) => {
      console.log(err);
      console.log(info);
    })
  }
}