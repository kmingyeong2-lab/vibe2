# 과외 매칭 (Tutor Match)

개인 과외 선생님과 학생을 연결하는 간단한 웹사이트입니다.

- 프레임워크: Next.js 14 (App Router, JavaScript)
- 백엔드: Supabase (Auth + Postgres + RLS)
- 배포: Vercel

## 주요 기능

1. 회원가입 / 로그인 (Supabase Auth, 이메일 + 비밀번호)
2. 선생님 / 학생 등록 (역할, 과목, 소개, 연락처)
3. 선생님 · 학생 목록에서 상대에게 수업 신청 보내기
4. 받은 신청 수락 / 거절, 보낸 신청 상태 확인

## 1. Supabase 설정

이미 `.env.local`에 프로젝트 URL과 anon key가 채워져 있습니다.

1. [Supabase 대시보드](https://supabase.com/dashboard) → 해당 프로젝트 → **SQL Editor**로 이동
2. `supabase/schema.sql` 파일 내용을 그대로 붙여넣고 실행 (테이블 2개 + RLS 정책 생성)
3. **Authentication → Providers → Email**에서 Email 로그인이 켜져 있는지 확인
   - 테스트를 빠르게 하고 싶다면 **Authentication → Settings**에서 "Confirm email"을 꺼두면
     가입 즉시 로그인할 수 있습니다 (운영 시에는 켜두는 것을 권장합니다).

## 2. 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 3. Vercel 배포

1. GitHub 등에 이 프로젝트를 push
2. [vercel.com](https://vercel.com) → New Project → 방금 만든 저장소 선택
3. Environment Variables에 아래 두 값을 추가
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - (값은 `.env.local` 파일 참고 — `.env.local`은 git에 커밋되지 않으므로 Vercel에는 직접 입력해야 합니다)
4. Deploy 클릭

## 폴더 구조

```
app/
  page.js            홈
  signup/page.js      회원가입
  login/page.js       로그인
  profile/page.js      선생님/학생 등록·수정
  teachers/page.js     선생님 목록 + 수업 신청
  students/page.js     학생 목록 + 수업 신청
  requests/page.js     받은/보낸 신청 관리
  components/          Navbar, PersonCard
lib/
  supabaseClient.js    Supabase 클라이언트
  useSession.js        로그인 세션 훅
supabase/
  schema.sql           테이블 및 RLS 정책
```

## 참고

- anon key는 공개되어도 되는 키이지만(RLS로 보호됨), 그래도 외부에 공유하지 않는 것이 좋습니다.
- 이 프로젝트는 학습/소규모 운영용으로 최소 기능만 구현했습니다. 필요에 따라 프로필 이미지,
  채팅, 결제 등을 추가로 확장할 수 있습니다.
