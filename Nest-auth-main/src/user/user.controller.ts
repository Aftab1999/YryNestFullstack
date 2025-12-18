import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { JwtGuard } from '../auth/jwt.guard';

import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { RolesGuard } from '../auth/roles.guard';

import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';


@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // =========================
  // AUTH
  // =========================

  // Signup
  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  // Login
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.userService.verifyPassword(
      body.email,
      body.password,
    );

    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    const token = this.authService.generateToken(user);

    return {
      success: true,
      token,
      user,
    };
  }

  // =========================
  // PROFILE (NEW)
  // =========================

  // Get logged-in user profile (from DB)
  @UseGuards(JwtGuard)
  @Get('profile')
  getMyProfile(@Req() request: any) {
    return this.userService.getProfile(request.user.id);
  }

  // Update logged-in user profile
  @UseGuards(JwtGuard)
  @Put('profile')
  updateProfile(
    @Req() request: any,
    @Body()
    body: {
      name?: string;
      dateOfBirth?: string;
      profileImage?: string;
    },
  ) {
    return this.userService.updateProfile(request.user.id, body);
  }


  @UseGuards(JwtGuard)
  @Post('profile/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = './uploads/profile-images';
            // Ensure directory exists
            const fs = require('fs');
            if (!fs.existsSync(uploadPath)){
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: (req: any, file, cb) => {
          const uniqueName = `user-${req.user.id}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async uploadProfileImage(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
        throw new Error('File upload failed');
    }
    console.log('✅ File uploaded:', file);
    const imagePath = `/uploads/profile-images/${file.filename}`;
    return this.userService.updateProfile(req.user.id, {
      profileImage: imagePath,
    });
  }


  // =========================
  // ADMIN
  // =========================

  // Get all users (ADMIN only)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  getAllUsers() {
    return this.userService.findAll();
  }

  // Get user by ID (ADMIN use mostly)
  @Get(':id')
  getById(@Param('id') id: string) {
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      return { success: false, message: 'Invalid user id' };
    }

    const user = this.userService.findById(userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    return { success: true, user };
  }

  // =========================
  // FORGOT PASSWORD
  // =========================

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.userService.forgotPassword(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPass: string }) {
    return this.userService.resetPassword(body.token, body.newPass);
  }
}
