# SEO progress

- Current phase: Phase 7 gate reached for P0 map — ready for Phase 8 drafts + Phase 1 tech fixes
- Current objective: Implement legacy 301s + studio noindex; draft `/rideturer` and `/rideferie`
- Last completed: Phases 0–4 baseline; Phase 5–6 commercial SERPs; Phase 7 P0 content map; Mangools list created
- Next action: Owner decisions (venabu.no vs this domain; email spelling; kanefart offering); then implement redirects + service pages
- Blockers: related-keywords API flaky; GSC query export not yet in repo; brand SERP owned by venabu.no
- Mangools quota remaining: reduced by ~1 overview + ~4 SERP details + 2 imports this session; list `6aac3a65f94fc7cac5720388`
- Last updated: 2026-09-17

## Assumptions (confirm if wrong)

- Market = Norway / nb-NO
- Primary conversion = riding-tour / holiday contact inquiries
- Permissions = edit frontend code + draft CMS content; publish only on explicit ask

## Phase checklist

### Phase 0 — Scope and safety

- [x] Read repository instructions and inspect uncommitted changes.
- [x] Confirm canonical production domain.
- [x] Confirm target country, language, and audience. *(assumed NO / nb-NO from site)*
- [x] Define primary conversion/business goal. *(assumed contact inquiries)*
- [x] Identify framework, hosting, CMS, database, and deployment flow.
- [x] Identify analytics, Search Console, and rank-tracking access.
- [x] Determine whether the domain is new, aged, migrated, or repurposed. *(aged WP → Next rebuild, same niche)*
- [x] Check historical domain topic when aged/repurposed. *(riding tours — consistent)*
- [ ] Record current traffic/ranking/indexation baseline when access exists. *(GoatCounter early; GSC verified but no export yet)*
- [x] Define what may be edited, drafted, published, or changed externally.
- [x] Create `docs/seo/` working artifacts.

**Gate:** site topic, market, domain, conversion goal, and permissions are known. ✅

### Phase 1 — Crawl and indexation

- [x] Inventory public routes and indexable page types.
- [x] Identify accidental indexable search/filter/parameter pages. *(archive `?page=`; SearchAction/`/search` gap)*
- [x] Verify production pages return correct HTTP status codes. *(home/robots/sitemap 200)*
- [ ] Find broken internal links and redirect chains.
- [x] Verify HTTPS and preferred host redirect consistently. *(www→apex 301)*
- [x] Review `robots.txt` rules and sitemap declaration.
- [x] Verify XML sitemap exists, is valid, canonical, and excludes drafts/404s/redirects. *(34 URLs incl. 26 posts)*
- [x] Check sitemap coverage for paginated/dynamic content. *(posts/categories/authors present; pagination not listed — OK)*
- [ ] Verify `noindex`, `nofollow`, and robots headers are intentional. *(`/studio` 200 — confirm noindex)*
- [ ] Verify staging, preview, admin, account, and private routes are not indexable.
- [ ] Check canonical tags on representative templates.
- [ ] Check duplicate URLs caused by slash, case, query, locale, or host variants.
- [ ] Verify pagination/faceted navigation behavior.
- [ ] Confirm JavaScript-rendered content is present in generated/server HTML.
- [ ] Review Search Console Pages/Crawl Stats when available.

**Gate:** pending studio/noindex + canonical HTML spot-checks.

### Phase 2 — Site architecture

- [x] Diagram homepage → category/hub → detail/article hierarchy.
- [ ] Identify orphan pages.
- [ ] Keep priority pages within reasonable click depth.
- [ ] Create clear topical hubs and supporting clusters. *(breed categories exist; commercial hubs thin)*
- [ ] Ensure navigation reflects user needs and business priorities. *(nav emphasizes blog cats over rideferie)*
- [x] Add breadcrumbs where useful.
- [ ] Verify breadcrumb links and schema match.
- [ ] Consolidate duplicate/thin archives, tags, or categories.
- [x] Define URL conventions before creating new content. *(`/post/[slug]`, `/category/[slug]`)*
- [ ] Create redirect maps before removing or renaming URLs.

### Phase 3 — Technical on-page foundations

- [ ] Verify one descriptive `<title>` per indexable page.
- [ ] Verify one visible H1 aligned with the page intent.
- [ ] Check title/H1 duplication across templates.
- [ ] Write unique meta descriptions for priority pages.
- [ ] Verify Open Graph and social-card metadata.
- [ ] Verify canonical and hreflang output in rendered HTML. *(no hreflang — single locale N/A)*
- [x] Validate hreflang language/region codes and reciprocal links. *(N/A — single locale)*
- [x] Verify default-language/x-default strategy when multilingual. *(N/A)*
- [ ] Add only accurate structured data supported by visible content.
- [ ] Validate Organization/WebSite/Article/Breadcrumb/Product/FAQ schema as applicable.
- [ ] Remove misleading, duplicated, or invalid schema. *(SearchAction → archive?q= without search route)*
- [ ] Include author, published, and modified dates where appropriate.
- [ ] Add useful image alt text; avoid keyword stuffing.
- [ ] Check mobile usability and keyboard accessibility.
- [ ] Check Core Web Vitals and major performance bottlenecks.
- [ ] Optimize image dimensions, formats, loading, and layout stability.
- [ ] Reduce blocking scripts/fonts and unnecessary client rendering.
- [x] Verify custom 404 and error behavior. *(app/not-found.tsx exists)*

### Phase 4 — Mangools baseline

- [x] Discover current Mangools MCP schemas.
- [x] Resolve and record Mangools location ID. *(Norway = 2578; Innlandet = 9302906)*
- [x] Record target language. *(nb-NO / google.no)*
- [x] Check current Mangools quota.
- [x] Run SiteProfiler overview for the site.
- [ ] Capture authority/backlink/top-content baseline. *(overview done; backlink/top-content pending)*
- [x] Identify true organic competitors, not only business competitors. *(0 from SiteProfiler)*
- [ ] Create one Mangools keyword list for the site.
- [x] Decide a daily quota budget for discovery vs SERP validation. *(~40 related + ≤15 SERP details)*

### Phase 5 — Keyword discovery

- [x] Write 3–8 seed topics grounded in actual site purpose.
- [ ] Search related keywords for each seed.
- [ ] Import known queries from Search Console when available.
- [ ] Review existing-ranking URL suggestions.
- [ ] Pull keywords from realistic weaker competitors.
- [ ] Run keyword-gap analysis against selected competitors.
- [ ] Include product/service, comparison, problem, question, and local intent where relevant.
- [ ] Filter obvious irrelevant terms and brands.
- [ ] Record volume, KD, CPC if useful, intent, and source.
- [ ] Treat missing KD/volume as unknown, not zero.
- [ ] Group spelling variants and synonyms.
- [ ] Cluster keywords by shared intent/SERP.
- [ ] Flag seasonal and freshness-dependent terms.
- [ ] Flag YMYL topics requiring expert review. *(mostly lifestyle/tourism — light YMYL)*

### Phase 6 — SERP and competitor validation

- [ ] SERP-check priority candidates in the correct location.
- [ ] Identify dominant intent and content type.
- [ ] Compare top-result domain/page strength.
- [ ] Note weak forums, UGC, small sites, stale pages, and intent mismatch.
- [ ] Record SERP features and important questions.
- [ ] Estimate content freshness and update burden.
- [ ] Review top competitor content for omissions and weak explanations.
- [ ] Find an information-gain angle for every approved target.
- [ ] Reject keywords that do not fit the site or cannot satisfy intent.
- [ ] Mark each candidate: target, merge, refresh, defer, or reject.
- [ ] Save approved keywords to the site’s Mangools list.

### Phase 7 — Keyword-to-URL map

- [ ] Assign one primary intent to one canonical URL.
- [ ] Map secondary variants to the same page where appropriate.
- [ ] Check current pages before proposing new URLs.
- [ ] Choose create vs update vs consolidate for each cluster.
- [ ] Assign page type, funnel stage, priority, and conversion goal.
- [ ] Assign parent hub and required internal links.
- [ ] Record title concept, slug, and content angle.
- [ ] Check cannibalization across the complete map.
- [ ] Prioritize quick wins, commercial pages, and supporting authority content.
- [ ] Build a realistic publication/update schedule.

### Phase 8–12

- [ ] Content production (drafts only until approved)
- [ ] Internal linking improvements
- [ ] Authority / backlink plan
- [ ] SERPWatcher tracking after priority pages live
- [ ] Iteration from GSC / rankings

## Change log

### 2026-09-17 — Technical SEO batch (breed-directory positioning)
- Evidence/reason: Owner clarified no own tours; email typo vene→vena; goal = useful breed directory (not link-selling)
- Files/templates/URLs: contact email/copy; netlify legacy 301s; studio noindex; remove SearchAction; related posts on post template; docs update
- Validation: deploy + curl legacy redirects + check /contact mailto + /studio robots
- Expected metric: recover legacy link equity; cleaner indexation; better internal links
- Review date: 2026-09-24

## Results

### 2026-09-17
- Search visibility: unknown (GSC new)
- Organic clicks/impressions: unknown
- Ranking movement: n/a
- Conversions: GoatCounter early / zero baseline expected
- Indexation/errors: sitemap live; studio returns 200 (disallow in robots only)
- Decision: prioritize commercial landing pages over more breed posts

## Handoff

Completed:
- Site inspection + brief
- Live crawl basics + SiteProfiler baseline + top linked legacy URLs
- Keyword import + SERP validation for rideferie, ridetur, dølahest, venabustallen
- Content map with P0 commercial pages + redirect plan
- Mangools list `venabustallen.no SEO` created

Evidence:
- Mangools SiteProfiler: DA 15, PA 22, CF 11, TF 18, 34 referring IPs
- Sitemap lists 26 posts + 5 categories + static pages
- Brand SERP owned by venabu.no, not this domain
- Legacy paths `/rideferier/` etc. still attracting backlinks

Changed:
- Added `docs/seo/site-brief.md`, `seo-audit.md`, `keyword-research.md`, `content-map.md`, `seo-progress.md`

Validated:
- https://venabustallen.no robots/sitemap/home
- www → apex redirect

External changes:
- Mangools keyword list created (empty pending keyword IDs)

Blocked:
- Owner: venabu.no vs venabustallen.no strategy; email spelling; kanefart offering
- KWFinder related-keywords API flaky this session

Next:
1. Add Netlify 301s for legacy URLs (temporary targets OK until pages exist)
2. Draft `/rideturer` + `/rideferie` + homepage/nav updates
3. noindex `/studio`; fix SearchAction/search mismatch; enable related posts
