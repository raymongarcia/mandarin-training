# Mandarin for Work

A practical Mandarin course for communicating with Chinese clients, suppliers, business partners, and colleagues.

## Course approach

- Standard Mandarin (Putonghua)
- Simplified Chinese characters and Hanyu Pinyin
- Learn one practical lesson at a time, from beginner foundations to workplace conversations
- Aim for 1–2 hours of study a day, or approximately 7–10 hours per week

Study-time recommendations are targets, not guaranteed fluency milestones. Build skills steadily and at your own pace.

The first guided lesson includes five pronunciation and speaking activities. Audio uses an installed Mandarin voice when available; otherwise, short phrases are requested from Google Translate text-to-speech through the app's pronunciation endpoint.

## Enable progress sync

Progress is private to each signed-in learner. Supabase sends a one-time email sign-in link; progress is saved to a row protected by Supabase Row Level Security.

1. Create a Supabase project and run [`supabase/migrations/20261031000000_create_learning_progress.sql`](./supabase/migrations/20261031000000_create_learning_progress.sql) in its SQL Editor.
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from your Supabase project's API settings.
3. Add those same two variables to the Vercel project's Production and Preview environments, then redeploy.
4. In Supabase Authentication URL Configuration, set `https://mandarin-training.vercel.app` as the Site URL and allow the deployed site's callback URL. Add your local development URL (for example `http://localhost:3000`) while testing locally.
5. In Supabase Authentication, enable email sign-in and configure the email provider's magic-link template.

Only the Supabase publishable key is used in the browser. Never add a Supabase service-role key to a `NEXT_PUBLIC_` variable or commit it to source control.

## Run locally

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run start` — serve a production build
