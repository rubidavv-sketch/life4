# Login + Content Management for Life After Climate Change

This code adds:

- Admin login using Supabase Auth
- Protected admin dashboard
- Permanent article database
- Create / edit / publish / delete articles
- Public article pages
- Public users can only read published articles

## How to use

1. Create a Supabase project.
2. Run `supabase/schema.sql` in Supabase SQL Editor.
3. Create your admin user in Supabase Authentication.
4. Copy the admin user UUID.
5. Insert the UUID into the `admins` table.
6. Add your Supabase keys in `.env.local` and Vercel environment variables.
7. Add these React files to your existing project.
8. Route `/admin/login`, `/admin`, `/admin/articles/new`, `/admin/articles/:id`.

## Environment variables

Create `.env.local` locally:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key
```

Add the same variables in Vercel:

Project > Settings > Environment Variables

## Important

Never use the Supabase service role key in frontend code.
Use only the anon public key in the browser.
Row Level Security in `schema.sql` protects the database.
