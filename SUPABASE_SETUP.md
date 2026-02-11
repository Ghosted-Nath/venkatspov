# Supabase Integration Guide

This project supports loading store products from Supabase with a safe fallback to local product data.

## 1) Environment Setup

Copy `.env.example` into `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

> Only use the **anon/public** key in frontend code. Never expose the service-role key in this app.

## 2) Create the `products` table

Use this schema in Supabase SQL Editor:

```sql
create table if not exists public.products (
  id bigint generated always as identity primary key,
  slug text unique not null,
  title text not null,
  price integer not null check (price >= 0),
  discount integer not null check (discount >= 0 and discount <= 100),
  limited boolean not null default false,
  images text[] not null default '{}'
);
```

## 3) Row Level Security (RLS)

Enable RLS and allow read-only access for public users:

```sql
alter table public.products enable row level security;

create policy "Public can read products"
on public.products
for select
to anon
using (true);
```

## 4) Seed data

Insert product records with valid local image paths (example: `/works/dashavatar.webp`).

## 5) Runtime behavior

- If Supabase is configured and reachable, products load from Supabase.
- If not configured or query fails, the app automatically falls back to local `app/store/products.js` data.
- Product input is sanitized before rendering.

## Security Notes

- Keep `.env.local` out of git.
- Do not store secrets in `NEXT_PUBLIC_*` variables.
- Use strict RLS policies in production.
