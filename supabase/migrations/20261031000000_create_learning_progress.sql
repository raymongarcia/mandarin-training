create table if not exists public.learning_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  progress jsonb not null default '{"completedGoals":[],"completedLessons":[],"lesson":null}'::jsonb
    check (jsonb_typeof(progress) = 'object'),
  updated_at timestamptz not null default now()
);

alter table public.learning_progress enable row level security;

revoke all on table public.learning_progress from anon;
grant select, insert, update, delete on table public.learning_progress to authenticated;

create policy "Learners can read their own progress"
  on public.learning_progress
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Learners can create their own progress"
  on public.learning_progress
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Learners can update their own progress"
  on public.learning_progress
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Learners can delete their own progress"
  on public.learning_progress
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
