import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Team } from '../teams/team.entity';

@Entity()
export class TeamMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  team_id: number;

  @Column()
  user_id: number;

  @Column()
  role: string;

  @Column()
  isActive: boolean;
}
