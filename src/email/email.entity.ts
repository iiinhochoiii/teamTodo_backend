import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Email {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  certificationNumber: string;

  @Column({
    nullable: true,
  })
  createdAt: Date | null;
}
