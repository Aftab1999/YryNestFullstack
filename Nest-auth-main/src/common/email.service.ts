import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;
  private fromAddress = process.env.SMTP_FROM || '"Digilocker Support" <no-reply@digilocker.local>';

  constructor() {
    // Create a transporter using Ethereal (fake SMTP service) for development
    // In production, use real credentials (e.g., Gmail, SendGrid)
    this.initTransporter();
  }

  async initTransporter() {
    // Prefer real SMTP via env vars; fallback to Ethereal for dev
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 0);
    const secure = (process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && port && user && pass) {
      try {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure,
          auth: { user, pass },
        });
        console.log('[EmailService] Transporter initialized with real SMTP host:', host);
        return;
      } catch (e) {
        console.error('Failed to create real SMTP transporter, falling back to Ethereal', e);
      }
    }

    try {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('[EmailService] Transporter initialized with Ethereal');
    } catch (e) {
      console.error('Failed to create email transporter', e);
    }
  }

  async sendMail(to: string, subject: string, text: string, html: string) {
    console.log(`[EmailService] Attempting to send email to ${to}`);
    
    // Always log to console as backup/fast-check
    console.log('📧 ================= LOCAL LOG ================= 📧');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    // Extract link roughly for easy clicking in terminal
    const linkMatch = text.match(/http:\/\/[^\s]+/);
    if (linkMatch) {
        console.log(`Link: ${linkMatch[0]}`);
    } else {
        console.log(`Body: ${text}`);
    }
    console.log('📧 =========================================== 📧');

    if (this.transporter) {
        try {
            const info = await this.transporter.sendMail({
                from: this.fromAddress,
                to,
                subject,
                text,
                html
            });
            console.log('✅ Email sent via Ethereal!');
            console.log('👉 Preview URL: %s', nodemailer.getTestMessageUrl(info));
        } catch (err) {
            console.error('❌ Error sending email via transporter:', err);
        }
    } else {
        console.warn('⚠️ Transporter not ready, relying on console log.');
    }
  }
}
