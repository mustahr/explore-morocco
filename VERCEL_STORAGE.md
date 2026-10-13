# Vercel storage setup

## Connect PostgreSQL

1. Open the existing Explore Morocco project in Vercel.
2. Open **Storage**, choose **Create Database**, and select **Neon Postgres** from the Marketplace.
3. Create a database on the plan you choose, and connect it to this project for Production. Use a separate database/branch for Preview environments.
4. Confirm Vercel added `DATABASE_URL` in Project Settings → Environment Variables. `POSTGRES_URL` is also supported for existing installations.
5. Redeploy the latest commit from `main`.

The first database request creates the tables and initializes the public content from `data/*.json`. Initialization is transactional, runs once per database, preserves existing matching records, and never restores deleted starter content on later deploys. Sample bookings and leads from the repository are not imported.

For local development, pull the connected environment variables using `vercel env pull .env.local`, then run `npm run db:init` if desired. Production initialization does not require a local command or build-time database connection.

## Images

Create a **public Vercel Blob** store from the same Storage tab and connect it to the project. Vercel supplies `BLOB_READ_WRITE_TOKEN`. Redeploy after connecting it. New admin uploads go to Blob; existing image URLs remain unchanged. Server uploads are limited to 4MB.

## Required environment variables

- `DATABASE_URL`: Neon Postgres connection string (server only).
- `ADMIN_PASSWORD`: admin login password.
- `ADMIN_SESSION_SECRET`: long random session signing secret.
- `NEXT_PUBLIC_SITE_URL`: production website URL.

`BLOB_READ_WRITE_TOKEN` is required for new image uploads. Notification and VAPID variables remain optional.

Supabase environment variables are no longer used by the project.

## Existing Supabase data

Automatic initialization loads the checked-in public content, not a live Supabase export. Live bookings, leads, admin content edits, and images are not transferred from Supabase automatically. Keep the old database and storage until any needed records have been exported and imported into the new database. Existing image URLs still require their original host to stay available.

## Verification

Open `/admin` → Settings → System status. The database check must say **Database connected**. Create a real inquiry, verify it appears in the admin dashboard, and confirm it remains after a redeploy.

If no database is connected, the public site can display the repository content. Production writes are blocked with a setup error instead of saving to Vercel's temporary filesystem. Database connection failures are not silently treated as successful saves.

Validation: `npm run test:db`, `npx tsc --noEmit`, and `npm run build`.
