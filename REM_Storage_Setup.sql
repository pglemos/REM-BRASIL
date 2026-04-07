-- Criar o bucket media-assets se não existir
insert into storage.buckets (id, name, public) 
values ('media-assets', 'media-assets', true) 
on conflict (id) do nothing;

-- Remover políticas antigas se existirem para evitar conflitos
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Auth Insert" on storage.objects;
drop policy if exists "Auth Update" on storage.objects;
drop policy if exists "Auth Delete" on storage.objects;

-- Configurar RLS (Row Level Security) para o bucket
-- 1. Leitura pública (qualquer um pode ver/baixar os arquivos)
create policy "Public Access" 
on storage.objects for select 
using ( bucket_id = 'media-assets' );

-- 2. Inserção apenas para usuários autenticados
create policy "Auth Insert" 
on storage.objects for insert 
with check ( bucket_id = 'media-assets' and auth.role() = 'authenticated' );

-- 3. Atualização apenas para usuários autenticados
create policy "Auth Update" 
on storage.objects for update 
using ( bucket_id = 'media-assets' and auth.role() = 'authenticated' );

-- 4. Deleção apenas para usuários autenticados
create policy "Auth Delete" 
on storage.objects for delete 
using ( bucket_id = 'media-assets' and auth.role() = 'authenticated' );
