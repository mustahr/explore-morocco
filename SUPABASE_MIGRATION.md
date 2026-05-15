# Supabase Migration

This project can now use Supabase as the online database while keeping local JSON files as a fallback.

## 1. Create The Table

Open your Supabase project SQL editor and run:

```sql
-- paste supabase/schema.sql here
```

## 2. Add Environment Variables

Create `.env.local` from `.env.example` and fill:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=your-admin-password
ADMIN_SESSION_SECRET=your-long-random-secret
```

Use the service role key only on the server. Do not expose it in client code.

## 3. Seed Current Local Data

After the table exists and env vars are set:

```bash
npm run db:seed
```

This uploads:

- trips
- destinations
- experiences
- blog posts
- testimonials
- bookings
- leads
- trip generator options
- trip detail content

## 4. Run The App

```bash
npm run dev
```

When Supabase env vars are present, the app reads/writes Supabase. Without them, it continues using `data/*.json`.
