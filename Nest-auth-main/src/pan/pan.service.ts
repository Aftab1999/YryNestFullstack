import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PanRequest, PanStatus } from './pan.entity';
import { User } from '../user/user.entity';


@Injectable()
export class PanService {
  constructor(
    @InjectRepository(PanRequest)
    private readonly panRepository: Repository<PanRequest>,
  ) {}

  async createPanRequest(
    data: {
      fullName: string;
      dateOfBirth: string;
      requestType: 'NEW' | 'CORRECTION';
      documentUrl?: string;
    },
    user: User,
  ) {
    const panRequest = this.panRepository.create({
      ...data,
      user,
      status: PanStatus.PENDING,
    });

    return this.panRepository.save(panRequest);
  }

  async findMyRequests(user: User) {
    return this.panRepository.find({
      where: { user: { id: user.id } },
      relations: ['user'],
    });
  }

  // ADMIN: get all PAN requests
async findAllRequests() {
  return this.panRepository.find({
    relations: ['user'],
    order: { createdAt: 'DESC' },
  });
}


// ADMIN: update PAN status
async updateStatus(id: number, status: PanStatus) {
  await this.panRepository.update(id, { status });
  return this.panRepository.findOne({
    where: { id },
    relations: ['user'],
  });
}
  
}
