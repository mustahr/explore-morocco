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
SUPABASE_STORAGE_BUCKET=morocco-travel-images
```

Use the service role key only on the server. Do not expose it in client code.

## 3. Image Uploads

Admin image uploads use Supabase Storage. The app will create the bucket named by `SUPABASE_STORAGE_BUCKET` when the first upload runs. If your Supabase project blocks bucket creation from the service role key, create a public bucket with that name in the Supabase dashboard.

## 4. Seed Current Local Data

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

## 5. Run The App

```bash
npm run dev
```

When Supabase env vars are present, the app reads/writes Supabase. Without them, it continues using `data/*.json`.
