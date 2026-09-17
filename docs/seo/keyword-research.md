# Keyword research

- Location: Norway
- Location ID: 2578
- Language: nb-NO (google.no)
- Research date: 2026-09-17
- Mangools list ID: `6aac3a65f94fc7cac5720388` (`venabustallen.no SEO`) — created empty; populate after keyword IDs available from import/full responses
- Quota at start: SERPs 100/100, related-keywords 100/100, Basic Combo
- Seeds: rideferie, ridetur, rideturer, fjellridning, rideferie Norge, dølahest, Venabygdsfjellet, rideleir, hestetur, rideweekend, Venabu, Venabustallen, fjordhest, islandshest, nordlandshest
- Method notes: `kwfinder_search_related_keywords` failed this session (provider/body errors). Volumes via `kwfinder_import_keywords`. SERPs via `kwfinder_get_keyword_details`.

## Approved clusters

### Brand — Venabustallen
- Intent: navigational / brand
- Canonical target URL: `/` (reinforce) + ensure `/about`, `/contact`
- Page type: homepage / brand
- Primary keyword: venabustallen
- Secondary variants: Venabustallen fjellridning
- Volume: 170
- KD: unknown
- SERP evidence: #1 venabu.no/fjellridning/; directories, VisitNorway, Tripadvisor; **venabustallen.no not in top 8**
- Weak competitors: local directory pages
- Information-gain angle: Become the official destination with tours, horses, practical booking CTA
- Internal links: nav brand, footer, all service pages
- Decision: **target** (critical)
- Priority: P0

### Rideferie (multi-day riding holiday)
- Intent: commercial investigation (labeled informational by tool; SERP is service pages)
- Canonical target URL: `/rideferie` (new) — also restore equity from legacy `/rideferier/`
- Page type: service / product
- Primary keyword: rideferie
- Secondary variants: rideferie Norge (60), rideferie fjell (vol unknown)
- Volume: 60 (KD 18)
- SERP evidence: myhregard service page; **venabu.no/rideferier/** #2 titled Venabustallen; hjerkinn; ridetur.no; VisitNorway; PAA present
- Weak competitors: smaller farms DA12–24 on page
- Information-gain angle: Concrete Venabygdsfjellet packages, dølahest suitability for levels, seasonality, how to inquire
- Internal links: home CTA, contact, dølahest post, about
- Decision: **target**
- Priority: P0

### Ridetur / day rides
- Intent: commercial + local (MAP_PACK)
- Canonical target URL: `/rideturer` (new) — map legacy `/rideturer-instruksjon-leierunder/`
- Page type: service
- Primary keyword: ridetur (110)
- Secondary variants: rideturer (20), fjellridning (40), hestetur (10), rideweekend (10), ridetur Rondane (10)
- Volume: 110 primary
- KD: unknown
- SERP evidence: ridetur.no #1 (DA12); Tripadvisor; Geilo; small stables; VisitNorway; **map pack**
- Weak competitors: many DA <25 operator pages
- Information-gain angle: Daily tours on Venabygdsfjellet, levels, what to bring, link to rideferie upsell
- Internal links: home, rideferie, contact
- Decision: **target**
- Priority: P0

### Destination — Venabygdsfjellet
- Intent: informational / tourism
- Canonical target URL: `/about` refresh or `/venabygdsfjellet` guide (defer new URL until about tested)
- Page type: guide / about
- Primary keyword: Venabygdsfjellet
- Secondary variants: Venabu (2400), Rondane context
- Volume: 4700
- KD: unknown
- SERP evidence: not fully SERP-checked this pass (quota reserved for commercial)
- Weak competitors: unknown
- Information-gain angle: Riding-centric destination guide tying place → Venabustallen
- Internal links: home, rideturer, rideferie
- Decision: **defer** new page; **refresh** about with destination copy first
- Priority: P2

### Dølahest (breed + experience bridge)
- Intent: informational encyclopedia
- Canonical target URL: `/post/dolahest-norges-fjellhest` (existing)
- Page type: article refresh
- Primary keyword: dølahest
- Secondary variants: dolahest (10), dølahester (10), fjellhest (10)
- Volume: 2000 (KD 18)
- SERP evidence: Wikipedia, Nhest, Landslaget, NIBIO, knowledge graph — authority SERP
- Weak competitors: thin breed pages lower down
- Information-gain angle: Not outrank Wikipedia; add **riding experience at Venabu**, temperament on mountain tours, CTA to rideturer
- Internal links: rideturer, rideferie, norske-raser category
- Decision: **refresh**
- Priority: P1

### Other Norwegian breeds (authority cluster)
- Intent: informational
- Canonical target URL: existing posts (fjordhest 770 KD22, islandshest 2100 KD12, nordlandshest 860)
- Page type: article
- Primary keyword: per-post breed name
- Secondary variants: category hubs `/category/norske-raser` etc.
- Volume: high informational
- SERP evidence: similar encyclopedic SERPs expected
- Information-gain angle: Local husbandry / comparison to dølahest used at Venabustallen; avoid thin spun pages
- Decision: **refresh selectively** (norske raser first); deprioritize exotic breed posts for SEO push
- Priority: P2

### Rideleir
- Intent: commercial (camps)
- Canonical target URL: TBD — only if business offers camps
- Primary keyword: rideleir
- Volume: 220
- Decision: **defer** pending owner confirmation of offering
- Priority: P3

## Rejected/deferred terms

| Term | Vol | Reason |
|---|---|---|
| ridetur Oslo | 60 | Wrong geography |
| horse trekking Norway / riding holiday Norway | null | No EN pages; defer |
| rideferie barn/voksen | null | Low evidence; merge into rideferie FAQ later |
| Exotic warmblood breed posts as SEO priority | various | Off-core for conversion; keep for depth only |

## Competitor findings

Organic SERP peers (commercial):
- venabu.no (brand sibling — currently owns Venabustallen queries)
- myhregard.com, hjerkinn.no, ridetur.no, hovgard.no, trysilhestesenter.no, alnaridesenter.no
- Directories: visitnorway.no, lillehammer.com, tripadvisor.com, aktivioslo.no

Legacy URL equity on this domain (SiteProfiler top content):
- `/rideferier/`
- `/rideturer-instruksjon-leierunder/`
- `/kanefart-og-kjoreturer/`
- `/kontakt/`

These must **301** to new equivalents — do not leave as soft 404s.

## Next research pass

1. Retry related-keywords API when stable; expand long-tails
2. SERP-check Venabygdsfjellet, fjellridning, rideferie Norge
3. Import GSC queries after indexing matures
4. Keyword-gap vs myhregard.com / ridetur.no if useful
5. Add approved keywords into Mangools list `6aac3a65f94fc7cac5720388`
6. Clarify venabu.no vs venabustallen.no canonical strategy with owner
