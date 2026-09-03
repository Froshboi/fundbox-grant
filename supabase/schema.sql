-- Run this entire file in Supabase SQL Editor.
-- The bucket is private: files are never exposed as public URLs.

create extension if not exists "pgcrypto";

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  type text not null default 'system',
  read boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.notifications enable row level security;
drop policy if exists "Users read own notifications" on public.notifications;
create policy "Users read own notifications" on public.notifications for select to authenticated using (user_id = auth.uid());
drop policy if exists "Users update own notifications" on public.notifications;
create policy "Users update own notifications" on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
alter table public.notifications replica identity full;
do $$ begin
  alter publication supabase_realtime add table public.notifications;
exception when duplicate_object then null;
end $$;

create or replace function public.is_support_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false) $$;

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null check (char_length(subject) between 3 and 200),
  category text not null default 'General',
  status text not null default 'Open' check (status in ('Open', 'Pending', 'Resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 5000),
  attachment_path text,
  attachment_name text,
  created_at timestamptz not null default now()
);

alter table public.support_messages add column if not exists attachment_path text;
alter table public.support_messages add column if not exists attachment_name text;

create or replace function public.notify_support_message()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  ticket_owner uuid;
begin
  select user_id into ticket_owner from public.support_tickets where id = new.ticket_id;
  if new.sender_id = ticket_owner then
    insert into public.notifications (user_id, title, body, type)
    select id, 'New customer support message', 'A customer has replied to a support ticket.', 'system'
    from auth.users where raw_app_meta_data ->> 'role' = 'admin';
  else
    insert into public.notifications (user_id, title, body, type)
    values (ticket_owner, 'Support replied to your ticket', 'Your support team sent a new message.', 'system');
  end if;
  return new;
end;
$$;
drop trigger if exists support_message_notification on public.support_messages;
create trigger support_message_notification after insert on public.support_messages
for each row execute function public.notify_support_message();

alter table public.support_tickets enable row level security;
alter table public.support_messages enable row level security;

drop policy if exists "Customers read own support tickets" on public.support_tickets;
create policy "Customers read own support tickets" on public.support_tickets for select to authenticated using (user_id = auth.uid() or public.is_support_admin());
drop policy if exists "Customers create support tickets" on public.support_tickets;
create policy "Customers create support tickets" on public.support_tickets for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "Admins update support tickets" on public.support_tickets;
create policy "Admins update support tickets" on public.support_tickets for update to authenticated using (public.is_support_admin()) with check (public.is_support_admin());

drop policy if exists "Participants read support messages" on public.support_messages;
create policy "Participants read support messages" on public.support_messages for select to authenticated using (
  sender_id = auth.uid() or public.is_support_admin() or exists (select 1 from public.support_tickets t where t.id = ticket_id and t.user_id = auth.uid())
);
drop policy if exists "Participants create support messages" on public.support_messages;
create policy "Participants create support messages" on public.support_messages for insert to authenticated with check (
  sender_id = auth.uid() and (public.is_support_admin() or exists (select 1 from public.support_tickets t where t.id = ticket_id and t.user_id = auth.uid()))
);

alter table public.support_tickets replica identity full;
alter table public.support_messages replica identity full;

do $$ begin
  alter publication supabase_realtime add table public.support_tickets;
exception when duplicate_object then null;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('support-attachments', 'support-attachments', false, 10485760,
  array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv','image/png','image/jpeg','image/webp','text/plain'])
on conflict (id) do update set public = false, file_size_limit = 10485760;

drop policy if exists "Support participants upload attachments" on storage.objects;
create policy "Support participants upload attachments" on storage.objects for insert to authenticated
with check (
  bucket_id = 'support-attachments' and
  ((storage.foldername(name))[1] = (select auth.uid()::text) or public.is_support_admin())
);
drop policy if exists "Support participants read attachments" on storage.objects;
create policy "Support participants read attachments" on storage.objects for select to authenticated
using (
  bucket_id = 'support-attachments' and (
    (storage.foldername(name))[1] = (select auth.uid()::text)
    or public.is_support_admin()
    or exists (
      select 1 from public.support_messages m
      join public.support_tickets t on t.id = m.ticket_id
      where m.attachment_path = name and t.user_id = auth.uid()
    )
  )
);
drop policy if exists "Support participants delete attachments" on storage.objects;
create policy "Support participants delete attachments" on storage.objects for delete to authenticated
using (bucket_id = 'support-attachments' and (storage.foldername(name))[1] = (select auth.uid()::text));
do $$ begin
  alter publication supabase_realtime add table public.support_messages;
exception when duplicate_object then null;
end $$;

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  doc_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 10485760),
  mime_type text not null,
  storage_path text not null unique,
  uploaded_at timestamptz not null default now()
);

alter table public.documents enable row level security;

drop policy if exists "Users can read their own document metadata" on public.documents;
create policy "Users can read their own document metadata"
  on public.documents for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users can create their own document metadata" on public.documents;
create policy "Users can create their own document metadata"
  on public.documents for insert to authenticated
  with check (user_id = auth.uid() and (storage_path like auth.uid()::text || '/%'));

drop policy if exists "Users can delete their own document metadata" on public.documents;
create policy "Users can delete their own document metadata"
  on public.documents for delete to authenticated
  using (user_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  10485760,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'image/png',
    'image/jpeg'
  ]
)
on conflict (id) do update set public = false, file_size_limit = 10485760;

drop policy if exists "Users can upload their own documents" on storage.objects;
create policy "Users can upload their own documents"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = (select auth.uid()::text));

drop policy if exists "Users can read their own documents" on storage.objects;
create policy "Users can read their own documents"
  on storage.objects for select to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = (select auth.uid()::text));

drop policy if exists "Users can delete their own documents" on storage.objects;
create policy "Users can delete their own documents"
  on storage.objects for delete to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = (select auth.uid()::text));
