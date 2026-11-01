# Mandarin for Work

A practical Mandarin course for communicating with Chinese clients, suppliers, business partners, and colleagues.

## Course approach

- Standard Mandarin (Putonghua)
- Simplified Chinese characters and Hanyu Pinyin
- Learn one practical lesson at a time, from beginner foundations to workplace conversations
- Aim for 1–2 hours of study a day, or approximately 7–10 hours per week

Study-time recommendations are targets, not guaranteed fluency milestones. Build skills steadily and at your own pace.

The 46-lesson course covers introductions, everyday work talk, meetings, client relationships, supplier negotiations, and review scenarios. Each guided lesson teaches practical Mandarin phrases with Pinyin and English meanings, a short speaking activity, and a comprehension check. The first lesson also includes Mandarin audio, tones, and expanded pronunciation practice.

## Enable progress sync

Progress and study activity are private to each signed-in learner. Supabase sends a one-time email sign-in link; progress is saved to rows protected by Supabase Row Level Security. Progress is also saved in this browser, so completing a lesson does not depend on signing in or on a temporary network connection; sign in to sync it across devices. The dashboard API calculates study time, daily streaks, completed lessons, practiced phrases, and weekly activity from Supabase records. Time is tracked while a guided lesson is open.

The authenticated `GET /api/progress` endpoint loads the current learner's progress, and `PUT /api/progress` accepts `{ "progress": { ... } }` to save it. `GET /api/dashboard` returns learner metrics, and `POST /api/dashboard` accepts `{ "seconds": 60 }` to record active study time. All endpoints require the learner's Supabase access token and enforce row-level security.

1. Create a Supabase project and run both SQL files in [`supabase/migrations`](./supabase/migrations) in timestamp order in its SQL Editor.
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
