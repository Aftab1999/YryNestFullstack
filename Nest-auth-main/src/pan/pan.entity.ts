import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

export enum PanStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

@Entity('pan_requests')
export class PanRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  dateOfBirth: string;

  @Column({
    type: 'enum',
    enum: ['NEW', 'CORRECTION'],
  })
  requestType: 'NEW' | 'CORRECTION';

  @Column({
    type: 'enum',
    enum: PanStatus,
    default: PanStatus.PENDING,
  })
  status: PanStatus;

  @Column({ nullable: true })
  documentUrl: string;

  // Many PAN requests can belong to one user
  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
