# 배포 및 설정 가이드

이 문서는 전시 작품 소개 웹앱을 실제로 배포하기 위한 순서입니다.

## 1. 로컬 확인

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm dev
```

환경 변수가 없으면 로컬 데모 모드로 실행됩니다. 이때 관리자 로그인 화면의 기본 이메일과 비밀번호를 그대로 사용할 수 있고, 작품 데이터는 브라우저 localStorage에 저장됩니다.

## 2. Supabase 프로젝트 만들기

1. Supabase에서 새 프로젝트를 만듭니다.
2. SQL editor에서 `supabase/schema.sql` 내용을 실행합니다.
3. Authentication에서 관리자 이메일 계정을 만듭니다.
4. Storage에 `artwork-images` 버킷이 공개 버킷으로 만들어졌는지 확인합니다.

## 3. 환경 변수 준비

프로젝트 루트에 `.env.local`을 만들고 아래 값을 넣습니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_ARTWORK_BUCKET=artwork-images
```

Supabase를 연결하면 관리자 로그인은 Supabase Auth 계정을 사용합니다.

## 4. Vercel 배포

1. Vercel에서 GitHub 저장소 `song0966-lab/al-pet`을 연결합니다.
2. Framework Preset은 Next.js로 둡니다.
3. Environment Variables에 `.env.local`과 같은 세 값을 넣습니다.
4. 배포 후 공개 주소에서 `/`와 `/admin/login`을 확인합니다.

## 5. 배포 후 확인

- 공개 홈에서 작품 목록이 보이는지 확인합니다.
- `/admin/login`에서 관리자 계정으로 로그인합니다.
- 작품을 하나 등록하고 공개 상태로 바꿉니다.
- 공개 홈에 새 작품이 나타나는지 확인합니다.
- 비공개 작품이 공개 화면과 직접 URL에서 보이지 않는지 확인합니다.

## 6. 다음 개선 후보

- QR 코드 생성과 다운로드
- 전시 정보 편집 화면
- 작가와 섹션 관리
- 전시 아카이브 페이지
- PWA 설치 지원
