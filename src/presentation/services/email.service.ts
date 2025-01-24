import nodemailer, { Transporter } from "nodemailer";
import { CustomError } from "../../domain";

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachements?: Attachement[];
}

export interface Attachement {
  filename: string;
  path: string;
}

export class EmailService {
  private transporter: Transporter;

  constructor(
    public mailerService: string,
    public mailerEmail: string,
    public mailerSecretKey: string
  ) {
    this.transporter = nodemailer.createTransport({
      service: mailerService,
      auth: {
        user: mailerEmail,
        pass: mailerSecretKey,
      },
    });
  }

  //* this can be done with a USE CASE
  async sendEmail(options: SendMailOptions): Promise<boolean | string> {
    const { to, subject, htmlBody, attachements = [] } = options;

    try {
      const sentInformation = await this.transporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody,
        attachments: attachements,
      });

      console.log("this is sentInformation", sentInformation);

      return sentInformation;
    } catch (error) {
      throw CustomError.serverError(error as string);
    }
  }
}
