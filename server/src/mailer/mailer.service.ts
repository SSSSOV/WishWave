import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,            
      port: Number(process.env.SMTP_PORT),    
      secure: false,                          
      auth: {
        user: process.env.SMTP_USER,          
        pass: process.env.SMTP_PASS,          
      },
    });
  }

  async sendVerificationEmail(to: string, code: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM, 
        to,
        subject: "Ваш код подтверждения для регистрации",
        html: `
          <p>Здравствуйте!</p>
          <p>Чтобы завершить регистрацию, введите этот код на сайте:</p>
          <h2>${code}</h2>
          <p>Если вы не запрашивали код, просто проигнорируйте это письмо.</p>
        `,
      });
    } catch (err) {
      console.error("MailerService.sendVerificationEmail error:", err);
      throw new InternalServerErrorException("Не удалось отправить письмо с кодом подтверждения");
    }
  }
}
