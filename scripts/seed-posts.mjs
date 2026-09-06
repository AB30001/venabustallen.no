/**
 * Seed 26 Norwegian horse-breed articles into Sanity (thxhf26m).
 * Images: Unsplash download redirects + Wikimedia Commons (no paid API).
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-posts.mjs
 */
import { createClient } from "@sanity/client";
import { createHash } from "node:crypto";
import { BREEDS } from "./data/horse-breeds.mjs";

const PROJECT =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  "thxhf26m";
const DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  "production";
const TOKEN =
  process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;

if (!TOKEN) {
  console.error("Missing SANITY_API_WRITE_TOKEN / SANITY_AUTH_TOKEN in env");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  token: TOKEN,
  useCdn: false
});

const UA =
  "VenabustallenSeed/1.0 (https://venabustallen.no; educational blog seeding)";

const CATEGORIES = [
  {
    _id: "category-norske",
    title: "Norske raser",
    slug: "norske-raser",
    color: "green",
    description: "Norske og nordiske hesteraser."
  },
  {
    _id: "category-varmblod",
    title: "Varmblodsraser",
    slug: "varmblodsraser",
    color: "blue",
    description: "Sport- og varmblodsraser fra Europa og Amerika."
  },
  {
    _id: "category-ponni",
    title: "Ponni",
    slug: "ponni",
    color: "purple",
    description: "Ponni- og fjellponniraser."
  },
  {
    _id: "category-arbeid",
    title: "Arbeidshester",
    slug: "arbeidshester",
    color: "orange",
    description: "Trekk- og arbeidshester."
  },
  {
    _id: "category-iberisk",
    title: "Iberiske raser",
    slug: "iberiske-raser",
    color: "orange",
    description: "Spanske og portugisiske raser."
  }
];

const CAT_MAP = {
  norske: "category-norske",
  varmblod: "category-varmblod",
  ponni: "category-ponni",
  arbeid: "category-arbeid",
  iberisk: "category-iberisk"
};

/** Curated Wikimedia filenames that resolve (verified HTTP 200). */
const WIKI_FILES = {
  "dolahest-norges-fjellhest": "Dole_eating_grass.jpg",
  "fjordhest-nordisk-klassiker": "Cheval_fjord_00003.jpg",
  "nordlandshest-lyngshest": "Lyngshest.jpg",
  "islandshest-femgangaren": "Icelandic_horse.jpg",
  "araber-orkenhesten": "Arabian_horse.jpg",
  "engelsk-fullblod-fartens-aristokrat": "Thoroughbred.jpg",
  "kwpn-nederlandsk-varmblod": "KWPN.jpg",
  "quarter-horse-amerikansk-allrounder": "American_Quarter_Horse.jpg",
  "appaloosa-prikkete-hest": "Appaloosa.jpg",
  "american-paint-horse": "Paint_horse.jpg",
  "frieser-svart-perl": "Friesian_Horse_1.jpg",
  "haflinger-gyllen-allsidig": "Haflinger_Fohlen_01.jpg",
  "shetlandsponni-liten-stor-vilje": "Shetland_pony_-_Postbridge.jpg",
  "connemara-irsk-fjellponni": "Connemara_pony.jpg",
  "shire-engelsk-trekkhest": "Shire_horse.jpg",
  "clydesdale-skotsk-trekkhest": "Clydesdale.jpg",
  "belgisk-trekkhest": "Belgian_horse.jpg",
  "andalusier-pre-spansk": "Andalusian_horse_moscow.jpg",
  "lusitano-portugisisk-iberisk": "Lusitano.jpg",
  "lipizzaner-spansk-rideskole":
    "Lipica_Stud_Farm,_Slovenia,_June_2012_(5).jpg"
};

/** Extra Unsplash short IDs (verified download redirects). */
const UNSPLASH_POOL = [
  "gexPHIY8D04",
  "xDQ9dZE6dog",
  "CzQb6zwTNOY",
  "qxqMovnE1lM",
  "e498nowG-fM",
  "Dkale3err3k",
  "T-0EW-SEbsE",
  "7Z03R1wOdmI",
  "_4sWbzH5fp8",
  "z_X0PxmBuIQ",
  "aZjw7xI3QAA",
  "LqKhnDzSF-8"
];

const usedImageUrls = new Set();
let unsplashIdx = 0;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function key() {
  return Math.random().toString(36).slice(2, 10);
}

function block(text, style = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: key(),
        text,
        marks: []
      }
    ]
  };
}

function bodyFromPairs(pairs) {
  return pairs.map(([style, text]) => block(text, style || "normal"));
}

async function fetchBuffer(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/*,*/*" },
    redirect: "follow"
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const ctype = res.headers.get("content-type") || "image/jpeg";
  if (!ctype.startsWith("image/")) {
    throw new Error(`Not an image (${ctype}) for ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error(`Image too small (${buf.length})`);
  return { buf, ctype };
}

async function resolveUnsplash(photoId) {
  const res = await fetch(
    `https://unsplash.com/photos/${photoId}/download?force=true`,
    {
      method: "HEAD",
      redirect: "manual",
      headers: { "User-Agent": UA }
    }
  );
  const loc = res.headers.get("location");
  if (!loc || !loc.includes("images.unsplash.com")) {
    throw new Error(`No Unsplash location for ${photoId}`);
  }
  // Prefer a reasonably sized derivative
  const base = loc.split("?")[0];
  return `${base}?auto=format&fit=crop&w=1600&q=80`;
}

async function resolveWikiFile(filename) {
  const enc = encodeURIComponent(filename);
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${enc}?width=1600`;
  // Probe
  const res = await fetch(url, {
    method: "HEAD",
    redirect: "follow",
    headers: { "User-Agent": UA }
  });
  if (!res.ok) throw new Error(`Wiki file missing: ${filename}`);
  return res.url || url;
}

async function resolveWikiSearch(hint) {
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.searchParams.set("action", "query");
  api.searchParams.set("generator", "search");
  api.searchParams.set("gsrsearch", hint);
  api.searchParams.set("gsrnamespace", "6");
  api.searchParams.set("gsrlimit", "8");
  api.searchParams.set("prop", "imageinfo");
  api.searchParams.set("iiprop", "url|mime|size");
  api.searchParams.set("iiurlwidth", "1600");
  api.searchParams.set("format", "json");

  await sleep(1200);
  const res = await fetch(api, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Commons API ${res.status}`);
  const data = await res.json();
  const pages = data?.query?.pages || {};
  const candidates = Object.values(pages)
    .filter(
      p =>
        p.imageinfo?.[0]?.mime?.startsWith("image/jpeg") ||
        p.imageinfo?.[0]?.mime?.startsWith("image/png")
    )
    .sort(
      (a, b) => (b.imageinfo[0].size || 0) - (a.imageinfo[0].size || 0)
    );

  for (const page of candidates) {
    const info = page.imageinfo[0];
    const url = info.thumburl || info.url;
    if (url && !usedImageUrls.has(url)) return url;
  }
  throw new Error(`No Commons image for hint: ${hint}`);
}

async function pickImageUrl(breed) {
  const tryUrl = async url => {
    if (usedImageUrls.has(url)) throw new Error("duplicate url");
    // quick HEAD
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: { "User-Agent": UA }
    });
    if (!res.ok) throw new Error(`bad ${res.status}`);
    usedImageUrls.add(url);
    return url;
  };

  // 1) Explicit Unsplash id on breed
  if (breed.unsplashId) {
    try {
      return await tryUrl(await resolveUnsplash(breed.unsplashId));
    } catch (e) {
      console.warn(`  unsplashId failed (${breed.unsplashId}): ${e.message}`);
    }
  }

  // 2) Curated Wikimedia file
  const wiki = WIKI_FILES[breed.slug];
  if (wiki) {
    try {
      return await tryUrl(await resolveWikiFile(wiki));
    } catch (e) {
      console.warn(`  wiki file failed (${wiki}): ${e.message}`);
    }
  }

  // 3) Commons search by imageHint
  if (breed.imageHint) {
    try {
      return await tryUrl(await resolveWikiSearch(breed.imageHint));
    } catch (e) {
      console.warn(`  wiki search failed (${breed.imageHint}): ${e.message}`);
    }
  }

  // 4) Unsplash pool fallback
  while (unsplashIdx < UNSPLASH_POOL.length * 2) {
    const id = UNSPLASH_POOL[unsplashIdx % UNSPLASH_POOL.length];
    unsplashIdx++;
    try {
      return await tryUrl(await resolveUnsplash(id));
    } catch {
      /* next */
    }
  }

  throw new Error(`Could not resolve image for ${breed.slug}`);
}

async function uploadImage(url, filename) {
  console.log(`  ↓ ${filename}`);
  const { buf, ctype } = await fetchBuffer(url);
  const asset = await client.assets.upload("image", buf, {
    filename,
    contentType: ctype.includes("png") ? "image/png" : "image/jpeg"
  });
  return asset;
}

async function deleteDemoPosts() {
  const demos = await client.fetch(
    `*[_type=="post" && (_id in path("drafts.**") == false) && (slug.current match "example-*" || _id match "post-demo-*")]._id`
  );
  for (const id of demos || []) {
    await client.delete(id);
    console.log(`  deleted demo ${id}`);
  }
}

async function seed() {
  console.log(`Seeding → project ${PROJECT} / ${DATASET}`);
  console.log(`Breeds: ${BREEDS.length}\n`);

  // Categories
  console.log("Categories…");
  for (const c of CATEGORIES) {
    await client.createOrReplace({
      _id: c._id,
      _type: "category",
      title: c.title,
      slug: { _type: "slug", current: c.slug },
      color: c.color,
      description: c.description
    });
  }

  // Author
  console.log("Author…");
  let authorImg;
  try {
    // Rider + horses on mountain trail (person in frame)
    const url = await resolveUnsplash("CzQb6zwTNOY");
    authorImg = await uploadImage(url, "author-ingrid-haugen.jpg");
  } catch {
    const url = await resolveWikiFile("Cheval_fjord_00003.jpg");
    authorImg = await uploadImage(url, "author-ingrid-haugen.jpg");
  }
  await client.createOrReplace({
    _id: "author-venabustallen",
    _type: "author",
    name: "Ingrid Haugen",
    slug: { _type: "slug", current: "ingrid-haugen" },
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: authorImg._id },
      alt: "Ingrid Haugen til hest på fjelltur"
    },
    bio: [
      block(
        "Ingrid Haugen er ridelærer og fjellguide ved Venabustallen på Venabygdsfjellet. Hun skriver om hesteraser, trygg fjellridning og hverdagen i stallen — med dølahestene som faste følgesvenner."
      )
    ]
  });

  // Settings
  console.log("Settings…");
  await client.createOrReplace({
    _id: "settings",
    _type: "settings",
    title: "Venabustallen",
    url: "https://venabustallen.no",
    copyright: "Venabustallen",
    description:
      "Rideturer, rideferier og stallhistorier fra Venabygdsfjellet. Dølahester, fjellridning og opplevelser ved Rondane.",
    email: "info@venebustallen.no",
    w3ckey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || undefined
  });

  // About
  console.log("About…");
  const aboutImg = await uploadImage(
    await resolveWikiFile("Dole_eating_grass.jpg"),
    "about-venabustallen.jpg"
  );
  await client.createOrReplace({
    _id: "about-page",
    _type: "about",
    title: "Om Venabustallen",
    subtitle:
      "Rideturer og rideferier på Venabygdsfjellet — stødige dølahester for alle nivå.",
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: aboutImg._id },
      alt: "Dølahest på beite"
    },
    body: [
      block(
        "Venabustallen ligger på Venabygdsfjellet ved Venabu Fjellhotell, i et landskap som egner seg godt for fjellridning. Her møter ryttere på alle nivå stødige hester, erfarne guider og turer tilpasset både nybegynnere og mer øvede."
      ),
      block(
        "Denne nettsiden samler artikler om hesteraser, stallpraksis og ridning i nordisk terreng — skrevet for å gi deg et solid utgangspunkt før du booker tur eller fordypper deg i hestefaget."
      )
    ]
  });

  console.log("Cleaning demo posts…");
  await deleteDemoPosts();

  console.log("\nPosts…");
  let i = 0;
  for (const breed of BREEDS) {
    i++;
    console.log(`\n[${i}/${BREEDS.length}] ${breed.title}`);
    const imageUrl = await pickImageUrl(breed);
    const asset = await uploadImage(
      imageUrl,
      `${breed.slug}.jpg`
    );

    const published = new Date();
    published.setDate(published.getDate() - (BREEDS.length - i));

    const excerpt =
      breed.excerpt.length > 200
        ? breed.excerpt.slice(0, 197) + "…"
        : breed.excerpt;

    await client.createOrReplace({
      _id: breed.id,
      _type: "post",
      title: breed.title,
      slug: { _type: "slug", current: breed.slug },
      excerpt,
      publishedAt: published.toISOString(),
      featured: !!breed.featured,
      author: { _type: "reference", _ref: "author-venabustallen" },
      mainImage: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: breed.imageAlt || breed.title
      },
      categories: [
        {
          _type: "reference",
          _ref: CAT_MAP[breed.category] || "category-varmblod"
        }
      ],
      body: bodyFromPairs(breed.body)
    });
    console.log(`  ✓ saved (${createHash("md5").update(imageUrl).digest("hex").slice(0, 8)})`);
    await sleep(400);
  }

  const count = await client.fetch(`count(*[_type=="post"])`);
  console.log(`\nDone. Post count in dataset: ${count}`);
}

seed().catch(err => {
  console.error("\nSeed failed:", err);
  process.exit(1);
});
