# Venabustallen

Next.js 14 + Sanity CMS-blogg for **[venabustallen.no](https://venabustallen.no)** — rideturer og rideferier på Venabygdsfjellet.

Innebygd Sanity Studio: `/studio`

## Brand palette

| Token | Hex | Role |
| :--- | :--- | :--- |
| Primary | `#1E3A32` | Deep forest / pine plateau |
| Accent | `#C4782A` | Saddle leather / warm copper |
| Dark | `#0F1915` | Near-black green |
| Light | `#F2F5F3` | Cool mist paper |

Primary-on-light contrast ≈ **11.2:1**.

## Getting started

```bash
pnpm install
pnpm dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Studio: [http://localhost:3000/studio](http://localhost:3000/studio)

Standalone Studio (sibling folder `venabustallen.no`):

```bash
npm install
npm run dev   # http://localhost:3333
```

## Environment variables

Copy `.env.local.example` to `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=thxhf26m
SANITY_STUDIO_PROJECT_ID=thxhf26m
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_REVALIDATE_SECRET=          # openssl rand -hex 32
NEXT_PUBLIC_SITE_URL=https://venabustallen.no
NEXT_PUBLIC_WEB3FORMS_KEY=
# NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
```

Sanity organization ID (manage UI only): `o1u50wPL1`

## SEO

Shared helpers in `lib/seo.js`:

- `SITE_NAME`, tagline, keywords, `absoluteUrl`
- WebSite, Organization, BlogPosting, BreadcrumbList, CollectionPage, WebPage, Person
- `app/sitemap.ts` and `app/robots.ts` use absolute URLs
- OG image: `app/opengraph-image.tsx`
- Language: `nb-NO`

## On-demand revalidation

Webhook route: `app/api/revalidate/route.js`

In [sanity.io/manage](https://sanity.io/manage) for project `thxhf26m`:

- **URL:** `https://venabustallen.no/api/revalidate`
- **Trigger:** create, update, delete on `post` and `category`
- **Secret:** same value as `SANITY_REVALIDATE_SECRET`

Response body includes the revalidated `paths` for debugging.

## Content seeding

```bash
pnpm seed-posts
pnpm update-settings
```

(Scripts land with the content brief — Phase 4.)

## Deploy (Netlify)

Config: `netlify.toml` (`pnpm build` + `@netlify/plugin-nextjs`).

1. Connect [https://github.com/AB30001/venabustallen.no](https://github.com/AB30001/venabustallen.no)
2. Set env vars in Netlify **before** first deploy (see `.env.local.example`)
3. Base directory: frontend root (`venabustallen.no-frontend` if the repo root differs)
4. Hosted Studio: https://venabustallen.sanity.studio/
