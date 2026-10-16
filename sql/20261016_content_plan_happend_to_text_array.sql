-- content.plan / content.happend 컬럼을 simple-array(text) → text[] 로 변경
--
-- 배경
--   TypeORM simple-array 는 배열을 ',' 로 join 해 text 한 칸에 저장하고, 조회 시 ',' 로 split 한다.
--   그래서 한 항목 안에 ',' 가 있으면 여러 항목으로 쪼개져 돌아온다.
--   예) ["a, b", "c"] 저장 → 'a, b,c' → 조회 시 ["a", " b", "c"]
--
-- 실행 순서 (반드시 이 순서로)
--   1. 운영 DB 백업
--   2. 이 SQL 실행
--   3. 엔티티가 @Column('text', { array: true }) 로 바뀐 백엔드 배포
--   app.module 이 synchronize: true 이므로, 이 SQL 없이 엔티티만 바꿔 배포하면
--   TypeORM 이 컬럼을 DROP 후 `ADD "plan" text array NOT NULL` 로 재생성하려 한다.
--   (로컬 PostgreSQL 15 + typeorm 0.3.6 으로 확인)
--   - 기존 행이 있으면: NOT NULL 위반으로 실패 → 트랜잭션 롤백(데이터 유지)되지만 서버가 기동되지 않음
--   - 테이블이 비어 있으면: 그대로 재생성됨
--
-- 한계
--   이미 저장된 데이터는 저장 시점에 항목 경계가 사라졌으므로 원래 항목 수로 복원할 수 없다.
--   아래 변환은 현재 API 가 돌려주던 값(',' 기준 split 결과)을 그대로 유지한다.
--   simple-array 가 빈 배열을 '' 로 저장한 행은 빈 배열({})이 된다.

BEGIN;

ALTER TABLE content
  ALTER COLUMN plan    TYPE text[] USING string_to_array(plan, ','),
  ALTER COLUMN happend TYPE text[] USING string_to_array(happend, ',');

COMMIT;

-- 확인용
-- SELECT id, plan, happend FROM content ORDER BY id DESC LIMIT 20;
