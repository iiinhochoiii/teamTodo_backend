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

  // simple-array 는 배열을 ',' 로 join 해 text 로 저장하므로 항목 안의 ',' 가 구분자로 오인되어 쪼개짐.
  // PostgreSQL 배열(text[])로 저장해 항목을 그대로 보존한다.
  // ⚠️ synchronize: true 환경이므로 배포 전에 sql/20261016_content_plan_happend_to_text_array.sql 을 먼저 실행할 것
  //    (SQL 없이 배포하면 synchronize 가 컬럼 재생성을 시도하다 실패해 서버가 기동되지 않음)
  @Column('text', { array: true })
  plan: string[];

  @Column('text', { array: true })
  happend: string[];
}
