import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn
} from 'typeorm';
import { User } from './User';

@Entity()
export class ResetToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.resetTokens, {
    onDelete: 'CASCADE',
  })
  user: User

  @Column()
  token: string;

  @Column()
  expires_at: Date;

  @Column({ default: false })
  used: boolean;

  @CreateDateColumn()
  created_at: Date;
}
