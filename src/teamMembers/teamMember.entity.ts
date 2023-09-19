import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
