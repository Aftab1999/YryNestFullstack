import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  // ✅ NEW: Date of birth
  @Column({ nullable: true })
  dateOfBirth: string;

  // ✅ NEW: Profile image URL
  @Column({ nullable: true })
  profileImage: string;

  @Column({
    type: 'enum',
    enum: ['ADMIN', 'USER'],
    default: 'USER',
  })
  role: 'ADMIN' | 'USER';

  @CreateDateColumn()
  createdAt: Date;
}
