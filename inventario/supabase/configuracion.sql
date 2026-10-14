-- 1. Tabla de productos 
create table if not exists public.productos (
  id bigint generated always as identity primary key,
  nombre text not null,
  created_at timestamptz not null default now()
);

alter table public.productos
  add column if not exists foto_url text;

-- 2. Permisos de la tabla 
alter table public.productos enable row level security;

drop policy if exists "Leer productos" on public.productos;
create policy "Leer productos"
on public.productos for select
to anon
using (true);

drop policy if exists "Crear productos" on public.productos;
create policy "Crear productos"
on public.productos for insert
to anon
with check (true);

-- 3. Bucket público para las fotos
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do update set public = true;

-- 4. Permitir subir fotos al bucket 
drop policy if exists "Subir fotos de productos" on storage.objects;
create policy "Subir fotos de productos"
on storage.objects for insert
to anon
with check (bucket_id = 'productos');