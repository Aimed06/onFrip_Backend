
import ejs from 'ejs';
import path from 'path';
import { MailTransporter } from '../../config/nodemailer';

const EMAIL_TEMPLATES = {
    REGISTRATION: "registration.ejs",
    LOGIN: "login.ejs"
}

export class EmailService {

    public static async sendEmail(email: string, subject: string, template: string, data: object): Promise<void> {

        const TemplatePath = path.join(__dirname, '../templates', template);
        const html: string = await ejs.renderFile(TemplatePath, data);

        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject,
            html,
        };

        await MailTransporter.sendMail(mailOptions);
    }

    public static async sendLoginEmail(email: string, user: object, secretCode: number): Promise<void> {
        const subject = "OTP Code";
        const template = EMAIL_TEMPLATES.LOGIN;
        const data = {
            user,
            email,
            secretCode
        }
        await this.sendEmail(email, subject, template, data);
    }

    public static async sendRegistrationEmail(email: string, secretCode: number): Promise<void> {
        const subject = "OTP Code";
        const template = EMAIL_TEMPLATES.REGISTRATION;
        const data = { 
            email,
            secretCode
        }
        await this.sendEmail(email, subject, template, data);
    }

}