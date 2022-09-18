import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creatorUserId: number;

  @Column()
  createdAt: Date;

  @Column({
    nullable: true,
  })
  updatedAt: Date | null;

  @Column({
    nullable: true,
  })
  teamId: number | null;

  @Column('simple-array')
  plan: string[];

  @Column('simple-array')
  happend: string[];
}
