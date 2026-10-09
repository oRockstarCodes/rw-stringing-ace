-- Fix: allow first admin promotion from SQL Editor (auth.uid() is null there).
-- Run this in Supabase SQL Editor, then promote your user.

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    raise exception 'Only admins can change roles';
  end if;
  return new;
end;
$$;

-- Then promote your Auth user (replace the UUID):
-- update public.profiles
-- set role = 'admin', full_name = 'Your Name'
-- where id = '<auth-user-uuid>';
