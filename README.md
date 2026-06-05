# 전시 작품 소개 웹앱

단일 전시를 위한 반응형 작품 카탈로그입니다. 관람객은 전시 소개와 작품 목록, 작품 상세 해설을 보고, 관리자는 로그인 후 작품 등록, 수정, 이미지 업로드, 공개/비공개 전환을 관리합니다.

## 실행

```bash
pnpm install
pnpm dev
```

현재 프로젝트는 `Next.js`, `TypeScript`, `Tailwind CSS`, `Supabase`를 기준으로 구성되어 있습니다.

## Supabase 설정

1. Supabase 프로젝트를 만들고 `supabase/schema.sql`을 SQL editor에서 실행합니다.
2. Authentication에서 관리자 이메일 계정을 생성합니다.
3. `.env.example`을 참고해 `.env.local`에 값을 넣습니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_ARTWORK_BUCKET=artwork-images
```

환경 변수가 없으면 로컬 데모 모드로 동작합니다. 이때 관리자 로그인은 화면의 기본값을 그대로 사용할 수 있고, 작품 데이터는 브라우저 localStorage에 저장됩니다.

## 주요 경로

- `/`: 공개 전시 홈과 작품 목록
- `/artworks/[slug]`: 작품 상세, 추후 QR 링크 대상
- `/admin/login`: 관리자 로그인
- `/admin/artworks`: 작품 관리
- `/admin/artworks/new`: 작품 등록
- `/admin/artworks/[id]`: 작품 수정

## 검증

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```
