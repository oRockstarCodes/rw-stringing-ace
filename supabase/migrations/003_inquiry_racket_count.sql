-- Add racket count to public contact inquiries
alter table public.inquiries
  add column if not exists racket_count integer check (racket_count is null or racket_count > 0);
