-- ===================================================================
-- 개인과외 매칭 사이트 - Supabase 스키마 및 RLS 정책
-- Supabase 대시보드 > SQL Editor 에서 그대로 실행하세요.
-- ===================================================================

-- 1) 프로필 테이블 (선생님/학생 등록 정보)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('teacher', 'student')),
  name text not null,
  subject text not null,
  bio text,
  contact text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

-- 로그인한 사용자는 모든 프로필을 조회할 수 있음 (선생님/학생 목록 노출용)
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

-- 본인 프로필만 생성 가능
create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- 본인 프로필만 수정 가능
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 2) 수업 신청 테이블
create table if not exists public.lesson_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users (id) on delete cascade,
  target_id uuid not null references auth.users (id) on delete cascade,
  message text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamp with time zone default now(),
  check (requester_id <> target_id)
);

alter table public.lesson_requests enable row level security;

-- 본인이 보냈거나 받은 신청만 조회 가능
create policy "requests_select_own"
  on public.lesson_requests for select
  to authenticated
  using (auth.uid() = requester_id or auth.uid() = target_id);

-- 본인이 신청자인 경우에만 생성 가능
create policy "requests_insert_own"
  on public.lesson_requests for insert
  to authenticated
  with check (auth.uid() = requester_id);

-- 받은 사람(target)은 상태 변경(수락/거절) 가능
create policy "requests_update_target"
  on public.lesson_requests for update
  to authenticated
  using (auth.uid() = target_id)
  with check (auth.uid() = target_id);

-- updated_at 자동 갱신 (선택)
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
