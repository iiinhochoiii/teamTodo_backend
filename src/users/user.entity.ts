import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  profile: string | null;

  @Column({ nullable: true })
  position: string | null;

  @Column({
    nullable: true,
  })
  createdAt: Date | null;

  @Column({
    nullable: true,
  })
  updatedAt: Date | null;

  @Column({
    nullable: true,
  })
  lastLoginedAt: Date | null;
}
