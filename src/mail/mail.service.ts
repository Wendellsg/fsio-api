import { Injectable } from '@nestjs/common';
import { render } from '@react-email/render';
import 'dotenv/config';
import * as nodemailer from 'nodemailer';

interface SendMailConfiguration {
  email: string;
  subject: string;
  text?: string;
  template: React.ReactElement;
}

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(
      {
        host: process.env.EMAIL_SERVICE_SMTP_HOST,
        port: process.env.EMAIL_SERVICE_SMTP_PORT,
        auth: {
          user: process.env.EMAIL_SERVICE_SMTP_USER,
          pass: process.env.EMAIL_SERVICE_SMTP_PASSWORD,
        },
      },
      {
        from: {
          name: process.env.EMAIL_CONTACT_EMAIL,
          address: process.env.EMAIL_CONTACT_EMAIL,
        },
      },
    );
  }

  private generateEmail = (template) => {
    return render(template);
  };

  async sendMail({ email, subject, template }: SendMailConfiguration) {
    const html = this.generateEmail(template);

    await this.transporter.sendMail({
      to: email,
      subject,
      html,
    });
  }
}
