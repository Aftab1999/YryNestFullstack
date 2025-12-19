import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from './user.entity';
import { EmailService } from '../common/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  // =========================
  // AUTH
  // =========================

  // CREATE USER (SIGNUP)
  async create(dto: { email: string; password: string; name?: string }) {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      email: dto.email,
      password: hashed,
      name: dto.name ?? null,
      role: 'USER',
    });

    const savedUser = await this.userRepository.save(user);

    // remove password before returning
    const { password, ...safe } = savedUser;
    return safe;
  }

  // VERIFY PASSWORD (LOGIN)
  async verifyPassword(email: string, plain: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) return null;

    const match = await bcrypt.compare(plain, user.password);
    if (!match) return null;

    const { password, ...safe } = user;
    return safe;
  }

  // =========================
  // PROFILE (NEW)
  // =========================

  // GET LOGGED-IN USER PROFILE (FROM DB)
  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...safe } = user;
    return safe;
  }

  // UPDATE LOGGED-IN USER PROFILE
  async updateProfile(
    userId: number,
    data: {
      name?: string;
      dateOfBirth?: string;
      profileImage?: string;
    },
  ) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // update only provided fields
    if (data.name !== undefined) {
      user.name = data.name;
    }

    if (data.dateOfBirth !== undefined) {
      user.dateOfBirth = data.dateOfBirth;
    }

    if (data.profileImage !== undefined) {
      user.profileImage = data.profileImage;
    }

    const updatedUser = await this.userRepository.save(user);

    const { password, ...safe } = updatedUser;
    return safe;
  }

  // =========================
  // ADMIN
  // =========================

  // GET ALL USERS (ADMIN)
  async findAll() {
    const users = await this.userRepository.find();
    return users.map(({ password, ...rest }) => rest);
  }

  // FIND USER BY ID
  async findById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) return null;

    const { password, ...safe } = user;
    return safe;
  }

  // =========================
  // FORGOT PASSWORD
  // =========================

async forgotPassword(email: string) {
  const user = await this.userRepository.findOne({ where: { email } });
  if (!user) {
    throw new NotFoundException('User with this email does not exist');
  }

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

  await this.userRepository.save(user);

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
  const resetLink = `${frontendUrl}/reset-password?token=${token}`;
  
  // ✅ CRITICAL FIX: Send to the USER'S REAL EMAIL, not a test email
  const recipientEmail = user.email; // This is the key change
  const recipientName = user.name ? user.name : 'User';
  
  // ✅ Use a real subject (remove "TEST -")
  const subject = 'Reset your Digilocker password';
  const textBody = `Dear ${recipientName},

You requested to reset your Digilocker account password.

Reset your password using the link below:
${resetLink}

This link will expire in 1 hour.

If you did not request this, please ignore this email.`;

  const htmlBody = `
<div style="font-family: Arial, sans-serif; color:#333; max-width:600px; margin:auto; padding:24px; border: 1px solid #e0e0e0; border-radius: 8px;">
  <h2 style="margin:0 0 12px; color: #6200ea;">Reset Your Password</h2>
  <p style="margin:0 0 16px;">Dear ${recipientName},</p>
  <p style="margin:0 0 16px;">You requested to reset your Digilocker account password.</p>
  <p style="margin:0 0 24px;">Click the button below to reset your password:</p>
  <p style="margin:0 0 24px;">
    <a href="${resetLink}" style="display:inline-block; background:#6200ea; color:#fff; text-decoration:none; padding:12px 24px; border-radius:6px; font-weight:bold;">Reset Password</a>
  </p>
  <p style="margin:0 0 8px; font-size:14px; color:#666;">If the button does not work, copy and paste this link into your browser:</p>
  <p style="word-break:break-all; color:#555; background:#f9f9f9; padding:12px; border-radius:4px; font-size:14px;">${resetLink}</p>
  <p style="font-size:12px; color:#999; margin:24px 0 8px 0;">
    This link will expire in 1 hour. If you did not request this, you can safely ignore this email.
  </p>
  <hr style="border:none; border-top:1px solid #eee; margin:24px 0;">
  <p style="font-size:11px; color:#777; margin:0;">Digilocker Support Team</p>
</div>`;

  console.log(`\n🔐 FORGOT PASSWORD REQUEST:`);
  console.log(`   User: ${user.name} (ID: ${user.id})`);
  console.log(`   Sending reset email to: ${recipientEmail}`); // Logs the real email
  console.log(`   Reset Token: ${token}`);
  console.log(`   Reset Link: ${resetLink}\n`);

  // ✅ Send to the user's actual email address
  await this.emailService.sendMail(recipientEmail, subject, textBody, htmlBody);

  return { 
    message: 'Password reset link has been sent to your email',
    // Removed test email note since it's now a real email
  };
}

  async resetPassword(token: string, newPass: string) {
    const user = await this.userRepository.findOne({ where: { resetPasswordToken: token } });

    if (!user) {
        throw new BadRequestException('Invalid or expired token');
    }

    if (new Date() > user.resetPasswordExpires) {
        throw new BadRequestException('Token expired');
    }

    const hashed = await bcrypt.hash(newPass, 10);
    user.password = hashed;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.userRepository.save(user);
    
    return { message: 'Password reset successfully' };
  }
}
