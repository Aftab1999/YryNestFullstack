import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
}
