import { Injectable } from '@nestjs/common';
import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';

type SendEmailDto = {
  to: string;
  subject: string;
  variables: Record<string, string>[];
};

@Injectable()
export class MailService {
  async sendMail(sendEmailDto: any) {
    const mailerSend = new MailerSend({
      apiKey: process.env.API_KEY,
    });

    const sentFrom = new Sender('you@yourdomain.com', 'Your name');

    const recipients = [new Recipient('your@client.com', 'Your Client')];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject('This is a Subject')
      .setTemplateId('template-id')
      .setVariables(
        sendEmailDto.variables.map((variable) => {
          return {
            email: sendEmailDto.to,
            substitutions: variable.substitutions,
          };
        }),
      );

    await mailerSend.email.send(emailParams);
  }
}
