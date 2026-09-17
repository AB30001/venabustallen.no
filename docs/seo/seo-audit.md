# SEO audit

## Executive summary

venabustallen.no is a fresh Next.js + Sanity rebuild on an aged riding-tourism domain. Technical foundations (sitemap, robots, metadata helpers, JSON-LD, GoatCounter, GSC file verify) are largely in place. The largest gap is **commercial intent coverage**: the live content library is ~26 breed encyclopedia posts, while Google demand for the business is rideferie/ridetur + brand, currently captured by **venabu.no** (and directories), not this domain. Brand query `venabustallen` (vol ~170) does not show venabustallen.no in the top organic results.

## Baseline

| Metric | Value | Source | Date |
|---|---|---|---|
| Domain Authority | 15 | SiteProfiler | 2026-09-17 |
| Page Authority | 22 | SiteProfiler | 2026-09-17 |
| Citation Flow / Trust Flow | 11 / 18 | SiteProfiler | 2026-09-17 |
| Referring IPs | 34 | SiteProfiler | 2026-09-17 |
| Organic competitors (SP) | 0 | SiteProfiler | 2026-09-17 |
| Sitemap URLs | 34 (5 static + 5 cats + 1 author + 26 posts) | Live sitemap | 2026-09-17 |
| Canonical host | https://venabustallen.no (www→apex 301) | Live HTTP | 2026-09-17 |
| Analytics | GoatCounter live | Deploy | 2026-09-17 |
| GSC | HTML verify file live | Deploy | 2026-09-17 |

Historical signal: Facebook OG still references WordPress `wp-content` riding-tour creatives — prior site was same niche.

## Critical blockers

### Legacy URLs with backlinks soft-404 via homepage
- Severity: Critical
- Evidence: SiteProfiler top linked pages include `/rideferier/`, `/rideturer-instruksjon-leierunder/`, `/kanefart-og-kjoreturer/`, `/kontakt/`. Live: trailing-slash requests **308 → slashless path**, then **404**. Equity is currently wasted.
- Affected templates/URLs: legacy WordPress paths
- Impact: Dilutes/loses link equity; soft-404 for historically important service URLs
- Recommended fix: Netlify `_redirects` or `netlify.toml` **301**s to new `/rideferie`, `/rideturer`, `/contact` (confirm sleigh-ride offering for kanefart)
- Validation: `curl -sI` legacy URLs → 301 → correct destination; re-check in GSC
- Status: Open

### Studio may be crawlable despite robots disallow
- Severity: Critical
- Evidence: `https://venabustallen.no/studio` returns HTTP 200; robots.txt Disallow `/studio/` only (no confirmed `noindex` header/meta in quick check)
- Affected templates/URLs: `/studio/*`
- Impact: CMS UI may be indexed or waste crawl budget
- Recommended fix: add `robots: { index: false }` / `X-Robots-Tag: noindex` on Sanity layout; optionally password/Netlify deny
- Validation: fetch studio HTML for `noindex`; GSC URL inspection
- Status: Open

### Brand SERP not owned by this domain
- Severity: Critical (business)
- Evidence: SERP `venabustallen` NO — #1 venabu.no/fjellridning/, directories/social; venabustallen.no absent top 8
- Affected templates/URLs: `/`, `/about`, missing service pages
- Impact: Brand traffic and trust go to sibling/legacy properties
- Recommended fix: strong homepage + dedicated ridetur/rideferie pages; ensure NAP consistency; request listings to prefer new canonical when ready
- Validation: re-check brand SERP after publish
- Status: Open — content map

## High-priority findings

### Missing commercial landing pages
- Severity: High
- Evidence: Sitemap has no `/rideturer`, `/rideferie`, or equivalent; SERP `rideferie` dominated by service pages (myhregard, venabu.no/rideferier, hjerkinn…)
- Impact: Cannot match commercial SERP format
- Recommended fix: Create service hubs mapped in content-map
- Status: Planned

### SearchAction / search UX mismatch
- Severity: High
- Evidence: Website JSON-LD SearchAction targets `/archive?q={search_term_string}`; unused sidebar form posts to `/search` (no route)
- Impact: Invalid rich-result expectation; broken UX if sidebar re-enabled
- Recommended fix: Implement archive search OR remove SearchAction until real search exists; fix form action
- Status: Open

### Related posts unused
- Severity: High (architecture)
- Evidence: GROQ fetches `related`; `components/sidebar.js` not imported on post template
- Impact: Weaker internal links between breed posts and future hubs
- Recommended fix: Render related posts on `/post/[slug]`
- Status: Open

### Nav prioritizes breed categories over conversion
- Severity: High
- Evidence: Navbar = Hjem, Kategorier, Om oss, Kontakt — no Rideturer/Rideferie
- Impact: Users and crawlers miss commercial intent
- Recommended fix: Add service links once pages exist
- Status: Planned

### Contact email spelling
- Severity: High (trust) — **fixed 2026-09-17**
- Evidence: Site showed `info@venebustallen.no` (typo); correct is `info@venabustallen.no`
- Status: Fixed in contact UI, Sanity settings, seed/scripts

## Medium-priority findings

### Homepage soft CTAs underplay booking intent
- Evidence: Home pushes archive/about more than contact/services
- Recommended fix: After service pages exist, primary CTA → rideturer/rideferie/contact

### Author/category thin hubs
- Evidence: Single author; categories are breed groups without commercial framing
- Recommended fix: Keep as supporting hubs; add intro copy tying breeds to Venabu riding

### Archive pagination indexability
- Evidence: `/archive` is `force-dynamic` with `?page=`
- Recommended fix: Confirm canonical on page 2+ points to self or page 1 deliberately; avoid thin duplicate titles

### English keywords in SITE_KEYWORDS
- Evidence: `horseback riding Norway` in default keywords meta
- Recommended fix: Prefer nb-NO commercial terms for NO market; EN only if EN pages exist

## Low-priority findings

### next-seo dependency unused on App Router path
- Cleanup later; Metadata API is source of truth

### Privacy / GoatCounter already disclosed
- OK after cookie-banner removal

## Implemented changes

- 2026-09-17: Created `docs/seo/` program artifacts (this audit, brief, progress, keyword research, content map)

## Deferred work and blockers

- Mangools `related-keywords` API unstable this session (`No available SERP provider` / `Body error`) — used `import_keywords` + SERP details instead
- GSC performance export not yet available for seed expansion
- Relationship/strategy between **venabu.no** and **venabustallen.no** needs owner decision (canonical brand home vs supporting blog)
