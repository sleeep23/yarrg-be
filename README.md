# YarrG API

YarrG API는 캠퍼스 공동 배달 주문을 위한 NestJS 백엔드입니다. 사용자는 Gistory IdP로 로그인하고, 배달 그룹을 만들거나 참여하고, 메뉴 요청을 등록한 뒤 주문과 정산을 진행합니다.

## 기술 스택

- NestJS
- Bun
- PostgreSQL
- Prisma
- Swagger/OpenAPI
- Gistory OAuth + JWT

## 핵심 도메인

- Delivery Group은 하나의 공동 배달 주문 그룹입니다.
- Organizer는 Delivery Group을 만든 사용자입니다.
- Organizer도 Participant입니다.
- Participant는 특정 Delivery Group 안에서 하나의 IdP 사용자를 나타냅니다.
- Participant는 모집 중일 때 자신의 Menu Request 목록을 통째로 교체할 수 있습니다.
- Recruitment Deadline이 지나면 참여, 탈퇴, 메뉴 변경이 막히지만 상태가 자동으로 바뀌지는 않습니다.
- Delivery Group 상태는 보통 `RECRUITING`, `ORDER_CLOSED`, `ORDER_PLACED`, `ARRIVED`, `COMPLETED` 순서로 진행됩니다.
- Delivery Group은 `RECRUITING` 상태에서만 `CANCELED`가 될 수 있습니다.
- Settlement는 Organizer가 실제 주문을 완료 처리할 때 생성됩니다.
- Payment Confirmation은 Organizer만 변경할 수 있습니다.

## 로컬 실행

의존성 설치:

```bash
bun install
```

로컬 PostgreSQL 실행:

```bash
docker compose up -d
```

`.env.example`을 참고해서 `.env`를 작성합니다.

Prisma Client 생성 및 마이그레이션:

```bash
bunx prisma generate
bunx prisma migrate dev
```

개발 서버 실행:

```bash
bun run start:dev
```

Swagger UI:

```text
http://localhost:3000/api
```

Prisma Studio:

```bash
bun run prisma:studio
```

## 환경 변수

```env
DATABASE_URL=

NODE_ENV=development
CORS_ORIGIN=

JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=1h

GISTORY_CLIENT_ID=
GISTORY_CLIENT_SECRET=

GISTORY_AUTHORIZE_URL=https://idp.gistory.me/authorize
GISTORY_TOKEN_URL=https://api.idp.gistory.me/oauth/token
GISTORY_USERINFO_URL=https://api.idp.gistory.me/oauth/userinfo

GISTORY_REDIRECT_URI=http://localhost:3000/auth/gistory/callback
GISTORY_SCOPES=profile email student_id
GISTORY_CODE_CHALLENGE=
```

`JWT_ACCESS_SECRET`은 충분히 긴 랜덤 문자열을 사용합니다.

```bash
openssl rand -base64 32
```

## 인증 흐름

Gistory 로그인 시작:

```text
GET /auth/gistory
```

Gistory callback:

```text
GET /auth/gistory/callback?code=...
```

서버는 authorization code를 Gistory token으로 교환하고, Gistory userinfo를 조회한 뒤 YarrG access token을 발급합니다.

보호된 API에는 YarrG access token을 bearer token으로 전달합니다.

```bash
curl http://localhost:3000/auth/me \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

## 주요 API

Auth:

- `GET /auth/gistory`
- `GET /auth/gistory/callback`
- `GET /auth/me`

Delivery Groups:

- `POST /delivery-groups`
- `GET /delivery-groups`
- `GET /delivery-groups/:id`
- `POST /delivery-groups/:id/cancel`
- `POST /delivery-groups/:id/participants`
- `DELETE /delivery-groups/:id/participants/me`
- `PUT /delivery-groups/:id/my-menu-requests`
- `POST /delivery-groups/:id/close-order`
- `POST /delivery-groups/:id/place-order`
- `POST /delivery-groups/:id/arrive`
- `POST /delivery-groups/:id/complete`
- `GET /delivery-groups/:id/settlement`

Settlement Items:

- `PATCH /settlement-items/:id/payment-confirmation`

## 자주 쓰는 명령

```bash
bun run build
bun run start:dev
bun run start:prod
bun run prisma:generate
bun run prisma:migrate
bun run prisma:deploy
bun run prisma:studio
bun run lint
bunx jest --watchman=false
```

로컬 Watchman 권한 문제로 `bun run test`가 실패하면 `bunx jest --watchman=false`를 사용합니다.

## 배포 메모

- 운영 DB 마이그레이션에는 `prisma migrate deploy`를 사용합니다.
- `prisma migrate dev`는 로컬 개발용입니다.
- Prisma Client는 `bun run build` 과정에서 생성됩니다.
- 배포 환경의 `GISTORY_REDIRECT_URI`는 실제 public domain 기준 callback URL이어야 합니다.
- public callback URL에는 별도 포트를 붙이지 않습니다.
- 프론트엔드 배포 URL이 정해지면 `CORS_ORIGIN`을 설정해야 합니다.

## 주의사항

- `.env`는 커밋하지 않습니다.
- `DATABASE_URL`, `JWT_ACCESS_SECRET`, `GISTORY_CLIENT_SECRET`은 외부에 노출되면 안 됩니다.
- 이 저장소 설정에서는 `CONTEXT.md`, `STEPS.md`, `docs/`를 로컬 프로젝트 노트로 보고 Git에서 제외합니다.
