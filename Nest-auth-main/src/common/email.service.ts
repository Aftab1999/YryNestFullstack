import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;
  private fromAddress = process.env.SMTP_FROM || '"Digilocker Support" <no-reply@digilocker.local>';
  private etherealAccount: any = null;

  constructor() {
    this.initTransporter();
  }

  async initTransporter() {
    // For testing, let's ALWAYS use Ethereal (no real SMTP needed)
    console.log('🚀 [EmailService] Setting up ETHEREAL email for TESTING...');
    
    try {
      // Create a test Ethereal account
      this.etherealAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: this.etherealAccount.user,
          pass: this.etherealAccount.pass,
        },
      });
      
      console.log('✅ [EmailService] Ethereal setup complete!');
      console.log('📧 Ethereal Test Email:', this.etherealAccount.user);
      console.log('🔑 Ethereal Test Password:', this.etherealAccount.pass);
      console.log('🌐 Check emails at: https://ethereal.email/');
      console.log('👉 Login with the email and password above\n');
      
    } catch (e) {
      console.error('❌ Failed to create Ethereal test account:', e.message);
    }
  }

  async sendMail(to: string, subject: string, text: string, html: string) {
    console.log('\n📧 ================= EMAIL SENDING =================');
    console.log(`   To: ${to}`);
    console.log(`   Subject: "${subject}"`);
    
    // Extract and show the reset link
    const linkMatch = text.match(/https?:\/\/[^\s]+/);
    if (linkMatch) {
      console.log(`   🔗 Reset Link: ${linkMatch[0]}`);
      console.log(`   ✨ Click this link to reset password!`);
    }
    
    console.log('\n   📝 Email Preview (first 200 chars):');
    console.log('   ' + text.substring(0, 200).replace(/\n/g, '\n   ') + '...');
    
    if (!this.transporter) {
      console.log('   ❌ Transporter not ready - email NOT sent');
      console.log('==============================================\n');
      return false;
    }

    try {
      const mailOptions = {
        from: this.fromAddress,
        to: to,
        subject: subject,
        text: text,
        html: html,
      };

      console.log('   📤 Sending via Ethereal...');
      const info = await this.transporter.sendMail(mailOptions);
      
      console.log(`   ✅ Email sent successfully!`);
      console.log(`   📨 Message ID: ${info.messageId}`);
      console.log(`   👉 PREVIEW EMAIL HERE: ${nodemailer.getTestMessageUrl(info)}`);
      console.log('==============================================\n');
      
      // Also log the Ethereal login info again for easy access
      if (this.etherealAccount) {
        console.log('💡 QUICK ACCESS:');
        console.log(`   Website: https://ethereal.email/`);
        console.log(`   Email: ${this.etherealAccount.user}`);
        console.log(`   Password: ${this.etherealAccount.pass}`);
        console.log('');
      }
      
      return true;
    } catch (err) {
      console.error(`   ❌ Error sending email: ${err.message}`);
      console.log('==============================================\n');
      return false;
    }
  }
}