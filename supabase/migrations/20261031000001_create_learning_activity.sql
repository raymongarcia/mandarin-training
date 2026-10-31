create table if not exists public.learning_activity (
  user_id uuid not null references auth.users (id) on delete cascade,
  activity_date date not null default (now() at time zone 'UTC')::date,
  active_seconds integer not null check (active_seconds between 1 and 86400),
  primary key (user_id, activity_date)
);

alter table public.learning_activity enable row level security;

revoke all on table public.learning_activity from anon;
grant select, insert, update on table public.learning_activity to authenticated;

create policy "Learners can read their own study activity"
  on public.learning_activity
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Learners can create their own study activity"
  on public.learning_activity
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Learners can update their own study activity"
  on public.learning_activity
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create or replace function public.record_learning_activity(p_seconds integer)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Sign in is required to record learning activity.';
  end if;

  if p_seconds is null or p_seconds < 1 or p_seconds > 120 then
    raise exception 'Study activity updates must contain between 1 and 120 seconds.';
  end if;

  insert into public.learning_activity (user_id, activity_date, active_seconds)
  values ((select auth.uid()), (now() at time zone 'UTC')::date, p_seconds)
  on conflict (user_id, activity_date)
  do update set active_seconds = least(
    public.learning_activity.active_seconds + excluded.active_seconds,
    86400
  );
end;
$$;

revoke all on function public.record_learning_activity(integer) from public, anon;
grant execute on function public.record_learning_activity(integer) to authenticated;
