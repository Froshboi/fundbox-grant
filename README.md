# Fundbox Grants — US Grant Discovery & Management Platform

A production-quality **Fundbox Grants Ltd** grant discovery, application management, and funding assistance platform.

> Production authentication, support messaging, and document storage are provided by Supabase.

## Tech Stack

- **React 18 + TypeScript**
- **Vite 5** (build & dev server)
- **Tailwind CSS 3** (design system)
- **React Router 6** (SPA routing)
- **lucide-react** (iconography)
- **PWA-ready manifest**
- **Dark mode** via `class` strategy
- **Role-based routing** (`applicant` / `admin`)

## Quick Start

```bash
npm install     # or: pnpm install / bun install
npm run dev     # start dev server → http://localhost:5173
npm run build   # production build → ./dist
npm run preview # preview the production build
```

## Deploy to Vercel

Zero configuration. Two options:

**Option A — Vercel dashboard**
1. Push this repo to GitHub / GitLab / Bitbucket.
2. Import the project in Vercel.
3. Framework preset: **Vite** (auto-detected). Build command: `npm run build`. Output directory: `dist`.
4. Deploy.

**Option B — Vercel CLI**
```bash
npm i -g vercel
vercel        # deploy preview
vercel --prod # deploy to production
```

The included `vercel.json` handles SPA client-side routing (all paths fall back to `index.html`).

## Feature Map

| Area                  | Route                             | Notes                                                   |
| --------------------- | --------------------------------- | ------------------------------------------------------- |
| Landing               | `/`                               | Hero, trust indicators, categories, CTAs                |
| Grant Marketplace     | `/grants`                         | 30 realistic US grants, filters, search, sort, bookmark |
| Grant Details         | `/grants/:id`                     | Overview, eligibility, timeline, FAQ, similar grants    |
| Auth                  | `/auth`                           | Supabase Auth                                             |
| Applicant Dashboard   | `/dashboard`                      | Overview, widgets, profile completion                   |
| Saved Grants          | `/dashboard/saved`                | Bookmarks                                               |
| Applications          | `/dashboard/applications`         | Full status pipeline                                    |
| AI Matches            | `/dashboard/matches`              | Match reasoning                                         |
| Document Vault        | `/dashboard/documents`            | Upload by document type                                 |
| Notifications         | `/dashboard/notifications`        | In-app inbox                                            |
| Organization Profile  | `/dashboard/profile`              | EIN, industry, revenue, diversity, certifications       |
| Admin Analytics       | `/admin`                          | KPIs, monthly chart, category breakdown                 |
| Admin Applicants      | `/admin/applicants`               | Applicant management                                    |
| Admin Grants          | `/admin/grants`                   | Grant CMS                                               |
| Admin Reviews         | `/admin/reviews`                  | Application review queue                                |
| Admin Content         | `/admin/content`                  | Blog CMS (20 articles)                                  |
| Admin Documents       | `/admin/documents`                | Document verification                                   |
| Admin Audit           | `/admin/audit`                    | Audit log                                               |
| Admin Settings        | `/admin/settings`                 | Matching, notifications, integrations                   |
| Resource Center       | `/resources`                      | 20 articles across 5 categories                         |
| Article Detail        | `/resources/:slug`                | Long-form article view                                  |
| Success Stories       | `/success-stories`                | 6 detailed case studies                                 |
| Support               | `/support`                        | Live chat, help center, tickets                         |
| Legal                 | `/legal/{terms,privacy,cookies,accessibility,disclaimer}` | Full US-context text |

## Project Structure

```
src/
├── components/layout/       # Header, Footer, PublicLayout, DashboardLayout, AdminLayout
├── contexts/                # Auth, Theme, Notification, Bookmark, Application
├── data/                    # grants.ts (30), articles.ts (20), stories.ts (6)
├── lib/                     # utilities
├── pages/                   # route components
│   ├── admin/
│   ├── dashboard/
│   ├── legal/
│   └── resources/
├── App.tsx                  # router
├── main.tsx                 # entry
└── index.css                # tailwind + design tokens
```

## Wiring a Real Backend

The application currently uses `localStorage` for non-authenticated UI preferences. For production, replace the following:

| Context                                | Replace with                                   |
| -------------------------------------- | ---------------------------------------------- |
| `AuthContext`                          | Supabase Auth / Auth0 / Clerk                  |
| `ApplicationContext`                   | REST/GraphQL API + Postgres                    |
| `BookmarkContext`                      | `user_bookmarks` table (RLS)                   |
| `NotificationContext`                  | WebSocket + `notifications` table + web-push   |
| `data/grants.ts`, `articles.ts`, etc.  | CMS or database seed                           |
| Document Vault                         | Supabase Storage bucket named `documents`      |

The design system, routing, and components are backend-agnostic.

## Production setup

1. Create a Supabase project and enable Email authentication.
2. Run [`supabase/schema.sql`](C:/Users/HP/Desktop/fundbox-grants.worktrees/full-functionality-auth-upload-ai/supabase/schema.sql) in the Supabase SQL Editor. It creates the private bucket, document metadata table, and RLS policies.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env.example` to your deployment environment.
4. In Supabase Auth settings, configure your production Site URL and redirect URLs, and choose whether email confirmation is required.
5. Set an admin user's `app_metadata.role` to `admin` from a trusted server or Supabase dashboard; never let the browser assign admin roles.
6. The support inbox is available at `/admin/support`; the Support page lets authenticated customers open tickets and chat with your team. The SQL migration enables Realtime for both tables.

The AI Matches screen uses a deterministic, explainable ranking algorithm over the organization profile, grant eligibility, category, tags, and location. Replace `src/lib/matching.ts` with a server-side model call when generative recommendations are needed; never expose a provider API key in the browser.

## Legal & Operational Context (US)

Fundbox Grants Ltd is designed as a **grant discovery and application management platform**, not a financial institution. Depending on the operating model chosen (marketplace, consulting, or grant administration), the company may need to comply with state business registration, US privacy laws (CCPA/CPRA, VCDPA, etc.), applicant verification procedures, and AML/KYC processes if funds are handled directly. See `src/pages/legal/` for the customer-facing document set.

---

© Fundbox Grants Ltd.
