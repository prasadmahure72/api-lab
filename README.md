# APILab — Cloud Mock API Platform

Create live, callable mock API endpoints in seconds — no backend required.

---

## What it does

APILab lets developers define mock HTTP endpoints (path, method, JSON response, status code, optional delay) and get an instantly callable public URL. Useful for frontend development, QA testing, and demoing without a live backend.

**Example:** Define `GET /users` → get `https://apilab.vercel.app/api/mock/users` → returns your configured JSON immediately.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Auth | Supabase Auth (email/password + Google OAuth) |
| Database | PostgreSQL via Supabase, Prisma ORM |
| Styling | Tailwind CSS 4 + inline styles |
| Deployment | Vercel |

---

## Local Setup

```bash
# 1. Clone
git clone https://github.com/your-username/api-lab.git
cd api-lab

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Fill in your Supabase URL, anon key, and database URL (see Supabase Setup below)

# 4. Run database migrations
npx prisma migrate dev --name init

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Go to **Project Settings → Database → Connection string (URI)** and copy it → `DATABASE_URL`
4. **Enable Email Auth:** Authentication → Providers → Email → Enable
5. **Enable Google OAuth:**
   - Authentication → Providers → Google → Enable
   - Create OAuth 2.0 credentials at [console.cloud.google.com](https://console.cloud.google.com):
     - Create project → APIs & Services → Credentials → Create OAuth Client ID
     - Application type: **Web application**
     - Authorized redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`
   - Paste Client ID + Client Secret into Supabase Google provider settings
6. **Add redirect URL:** Authentication → URL Configuration:
   - Site URL: `http://localhost:3000` (or your production domain)
   - Redirect URLs: `http://localhost:3000/auth/callback`

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL=postgresql://postgres:password@db.your-project-ref.supabase.co:5432/postgres
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Vercel Deployment

1. Push your repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository
3. Add all environment variables in the Vercel dashboard (Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SITE_URL` → set to your Vercel domain (e.g. `https://apilab.vercel.app`)
4. Update Supabase redirect URLs to include your Vercel domain:
   - Site URL: `https://apilab.vercel.app`
   - Redirect URLs: add `https://apilab.vercel.app/auth/callback`
5. Click **Deploy**

> Prisma runs `prisma generate` automatically. Migrations must be run manually via `npx prisma migrate deploy` or through Supabase SQL editor.

---

## Mock API Usage

### Base URL
```
https://your-domain.vercel.app/api/mock
```

### Calling a mock endpoint
```bash
# GET example
curl https://apilab.vercel.app/api/mock/users

# POST example
curl -X POST https://apilab.vercel.app/api/mock/orders \
  -H "Content-Type: application/json" \
  -d '{"product": "widget"}'
```

- No authentication required to call mock endpoints
- CORS enabled for all origins (`Access-Control-Allow-Origin: *`)
- Returns your configured JSON body and status code
- If `delay` is set, the response is held for that many milliseconds
- Returns `404` with `{ error: "Mock not found" }` if no matching endpoint+method exists

---

## Pre-deploy Checklist

- [ ] `.env.local.example` committed (no real secrets in repo)
- [ ] `npx prisma migrate dev` creates tables correctly
- [ ] Signup → email confirmation → signin flow works
- [ ] Google OAuth callback redirects to `/dashboard`
- [ ] Dashboard loads only the signed-in user's APIs
- [ ] Create API → live URL works immediately
- [ ] Edit and delete work correctly
- [ ] Mock URL returns correct JSON + status code
- [ ] Delay simulation works (add 1000ms delay, confirm response is slow)
- [ ] `404` returned for unknown mock endpoints
- [ ] CORS headers present on mock responses (`curl -I` to verify)
- [ ] Security headers present (`X-Frame-Options`, `X-Content-Type-Options`)
- [ ] Mobile layout looks clean
- [ ] Vercel build passes with zero errors (`npm run build` locally first)
