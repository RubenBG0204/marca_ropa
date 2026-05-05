create table if not exists public.products (
  id text primary key,
  name text not null,
  price numeric not null check (price >= 0),
  category text not null check (category in ('tshirts', 'hoodies', 'pants', 'accessories', 'shoes')),
  image text not null default 'img-1',
  description text not null default '',
  sizes text[] not null default array['S', 'M', 'L', 'XL'],
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "products are public readable" on public.products;
create policy "products are public readable"
on public.products
for select
to anon
using (true);

drop policy if exists "products can be managed by anon for demo" on public.products;
create policy "products can be managed by anon for demo"
on public.products
for all
to anon
using (true)
with check (true);

insert into public.products (id, name, price, category, image, description, sizes)
values
  ('p1', 'Camiseta Costura Contour', 42, 'tshirts', 'img-2', 'Algodon transpirable con ajuste entallado.', array['S', 'M', 'L', 'XL']),
  ('p2', 'Sudadera Airline Tech', 98, 'hoodies', 'img-1', 'Felpa suave con capucha estructurada.', array['S', 'M', 'L', 'XL']),
  ('p3', 'Pantalon Studio Taper', 76, 'pants', 'img-3', 'Pierna entallada con elasticidad premium.', array['S', 'M', 'L', 'XL']),
  ('p4', 'Gorra Aero', 28, 'accessories', 'img-8', 'Bordado minimalista, tejido ligero.', array['M', 'L']),
  ('p5', 'Zapatilla Momentum', 120, 'shoes', 'img-9', 'Suela amortiguada, lista para la ciudad.', array['39', '40', '41', '42', '43', '44']),
  ('p6', 'Camiseta Soft Rib', 35, 'tshirts', 'img-5', 'Textura acanalada sutil, fit slim.', array['S', 'M', 'L']),
  ('p7', 'Sudadera Cloud', 86, 'hoodies', 'img-6', 'Ajuste relajado con interior perchado.', array['S', 'M', 'L', 'XL']),
  ('p8', 'Pantalon Flow', 72, 'pants', 'img-7', 'Caida fluida con acabado sastre.', array['S', 'M', 'L', 'XL']),
  ('p9', 'Cinturon Signature', 26, 'accessories', 'img-4', 'Hebilla mate, diseno minimalista.', array['S', 'M', 'L'])
on conflict (id) do update set
  name = excluded.name,
  price = excluded.price,
  category = excluded.category,
  image = excluded.image,
  description = excluded.description,
  sizes = excluded.sizes;
