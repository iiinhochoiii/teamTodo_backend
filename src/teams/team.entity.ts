import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  // 팀 이름
  @Column()
  name: string;

  @Column()
  creatorUserId: number;

  @Column({
    nullable: true,
  })
  description: string | null;

  @Column({
    nullable: true,
  })
  maskcot: string | null;

  @Column({
    nullable: true,
  })
  createdAt: Date | null;

  @Column({
    nullable: true,
  })
  updatedAt: Date | null;
}
