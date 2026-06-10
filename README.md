# Mirza Md Shakil — Portfolio

A personal portfolio website with a public case-study showcase and a password-protected admin panel for managing content. Design is inspired by clean, editorial portfolio sites with light/dark theme support.

## Tech stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, [shadcn/ui](https://ui.shadcn.com/)
- **Database & auth:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)
- **Deployment:** [Vercel](https://vercel.com/)
- **Theming:** next-themes (light / dark / system)

## Features

- Homepage with hero, rotating fun facts, and project grid
- Project case study pages with sections and quick facts
- About page with experience, education, and writing
- Fun projects page
- Admin panel for projects, about content, and resume upload
- SEO metadata, loading skeletons, and error pages

## Local setup

### Prerequisites

- Node.js 18+
- npm
- A Supabase project

### 1. Clone and install

```bash
git clone https://github.com/ImMirzaShakil/Portfolio.git
cd Portfolio
npm install
```

### 2. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only, never expose to the browser) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for Open Graph links (e.g. `http://localhost:3000` locally) |

### 3. Supabase setup

Follow your **Developer Guide PDF** for full Supabase project setup. In summary:

1. Create a Supabase project and copy the URL and API keys into `.env.local`.
2. Create the database tables (see project schema in your developer guide).
3. Run `supabase/rls-policies.sql` in the Supabase SQL editor for public read policies.
4. Create **public** storage buckets:
   - `project-images` — project and profile images
   - `resume` — PDF resume file (`resume.pdf`)
5. Create an admin user in Supabase Auth (email + password).
6. Seed sample data (optional):

```bash
npm run seed
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site and [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin panel.

## Deploy to Vercel

1. Push your code to GitHub.
2. Import the repository in [Vercel](https://vercel.com/new).
3. Add all environment variables from `.env.example` in the Vercel project settings.
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain (e.g. `https://yourdomain.com`).
5. Deploy. Vercel detects Next.js automatically (`vercel.json` is included).

For detailed deployment steps, refer to your **Developer Guide PDF**.

## Project structure

```
app/
  (public)/          Public pages (home, about, fun, projects)
  admin/             Admin panel (login, projects, about, resume)
  api/               API routes (upload, resume, revalidate)
components/          UI and page components
lib/                 Supabase clients, types, utilities
scripts/seed.mjs     Database seed script
supabase/            SQL policies
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed database with sample content |

## License

Private project — all rights reserved.
