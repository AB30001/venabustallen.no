/**
 * Publish 2 NordExplore partner riding articles with outbound links + 1200px images.
 * Usage: node --env-file=.env.local scripts/publish-nordexplore-articles.mjs
 */
import { createClient } from "@sanity/client";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const postsImgDir = path.join(root, "public", "img", "posts");

const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "thxhf26m";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN =
  process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;

if (!TOKEN) {
  console.error("Missing SANITY_API_WRITE_TOKEN");
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
  "VenabustallenPublish/1.0 (https://venabustallen.no; educational articles)";
const TARGET_WIDTH = 1200;
const HOME = "https://www.nordexplore.com/";
const ALTA =
  "https://www.nordexplore.com/experiences/horseback-riding-204916P3";
const CHILDREN =
  "https://www.nordexplore.com/experiences/childrens-riding-on-fokhol-grd-5561420P2";
const SLEIGH =
  "https://www.nordexplore.com/experiences/experience-carriage-and-sleigh-rides-on-fokhol-grd-5561420P1";

function key() {
  return Math.random().toString(36).slice(2, 10);
}

function plainBlock(text, style = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }]
  };
}

/** Build a paragraph with inline external links: parts = string | {text, href} */
function richBlock(parts, style = "normal") {
  const markDefs = [];
  const children = [];
  for (const part of parts) {
    if (typeof part === "string") {
      children.push({ _type: "span", _key: key(), text: part, marks: [] });
      continue;
    }
    const markKey = key();
    markDefs.push({
      _type: "link",
      _key: markKey,
      href: part.href,
      blank: true
    });
    children.push({
      _type: "span",
      _key: key(),
      text: part.text,
      marks: [markKey]
    });
  }
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs,
    children
  };
}

async function resolveWikiFile(filename) {
  const enc = encodeURIComponent(filename);
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${enc}?width=1600`;
  const res = await fetch(url, {
    method: "HEAD",
    redirect: "follow",
    headers: { "User-Agent": UA }
  });
  if (!res.ok) throw new Error(`Wiki file missing: ${filename}`);
  return res.url || url;
}

async function downloadAndResize(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/*" },
    redirect: "follow"
  });
  if (!res.ok) throw new Error(`Download failed ${res.status}`);
  const input = Buffer.from(await res.arrayBuffer());
  return sharp(input)
    .rotate()
    .resize({ width: TARGET_WIDTH })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}

const ARTICLES = [
  {
    id: "post-nordexplore-fokhol",
    title: "Ridning for barn og hestekjøring på Fokhol Gård",
    slug: "ridning-barn-hestekjoring-fokhol-gard",
    excerpt:
      "Opplev barneridning og vogn- eller kanefart på Fokhol Gård. Praktiske hesteopplevelser for familier – book via NordExplore.",
    category: "category-norske",
    featured: true,
    wikiFile: "Shetland_pony_-_Postbridge.jpg",
    imageAlt: "Liten ponni egnet for barneridning i rolig tempo",
    body: [
      plainBlock(
        "Vil du gi barna en trygg første møte med hest – eller ta hele familien med på vogn- eller kanetur? Fokhol Gård tilbyr rolige hesteopplevelser som passer godt for familier. Her får du både barneridning og klassisk hestekjøring i samme miljø."
      ),
      plainBlock("Barneridning på Fokhol Gård", "h2"),
      richBlock([
        "På Fokhol Gård kan de minste prøve hesteryggen i trygge omgivelser. Opplevelsen er tilrettelagt for barn, med fokus på rolig tempo og gode førsteinntrykk. Se detaljer og ledige tider for ",
        {
          text: "barneridning på Fokhol Gård hos NordExplore",
          href: CHILDREN
        },
        "."
      ]),
      plainBlock("Vogn- og kanefart", "h2"),
      richBlock([
        "For dem som vil nyte landskapet uten å ri selv, er vogn- og kanefart et klassisk valg. Opplevelsen passer både sommer og vinter, avhengig av sesong og føre. Les mer og book ",
        {
          text: "vogn- og kanefart på Fokhol Gård",
          href: SLEIGH
        },
        " via NordExplore."
      ]),
      plainBlock("Hvorfor booke via NordExplore?", "h2"),
      richBlock([
        "NordExplore samler norske naturopplevelser på ett sted, med tydelig informasjon om hva som inngår og hvordan du bestiller. Utforsk flere heste- og uteaktiviteter på ",
        { text: "nordexplore.com", href: HOME },
        " – eller gå direkte til Fokhol-opplevelsene over når du er klar til å booke."
      ]),
      plainBlock("Tips før du drar", "h2"),
      plainBlock(
        "Sjekk aldersgrenser og sesong for barneridning, ta med klær etter været, og spør arrangøren om det er krav til lukket sko. For kanefart er varme lag og votter lurt om vinteren. Book gjerne i god tid i høysesong."
      )
    ]
  },
  {
    id: "post-nordexplore-alta",
    title: "Hesteridning i Alta – opplev Nord-Norge fra hesteryggen",
    slug: "hesteridning-alta-nordexplore",
    excerpt:
      "Ri i Alta og opplev nordnorsk natur fra hesteryggen. En hesteopplevelse i Finnmark – book horseback riding via NordExplore.",
    category: "category-norske",
    featured: true,
    wikiFile: "Icelandic_horse.jpg",
    imageAlt: "Hest og rytter i åpent nordisk landskap",
    body: [
      plainBlock(
        "Alta byr på vidstrakt natur, nordlys-sesong og et helt annet landskap enn Sør-Norge. Fra hesteryggen kommer du tett på terreng og stillhet – en fin måte å oppleve Finnmark på, enten du er vant rytter eller vil prøve en guidet tur."
      ),
      plainBlock("Horseback riding i Alta", "h2"),
      richBlock([
        "NordExplore tilbyr ",
        { text: "hesteridning i Alta", href: ALTA },
        " som en ferdig bookbar opplevelse. Sjekk nivå, varighet og hva som er inkludert før du bestiller, så matcher turen forventningene dine."
      ]),
      plainBlock("Hva du kan forvente", "h2"),
      plainBlock(
        "Guidede rideturer i nord handler ofte om landskap og tempo mer enn konkurranseteknikk. Kled deg etter vær og vind, bruk lukkede sko, og spør om hjelm og sikkerhetsrutiner. Alta kan være kaldt selv i skulderesesong – lag på lag er smart."
      ),
      plainBlock("Flere opplevelser hos NordExplore", "h2"),
      richBlock([
        "Vil du sammenligne flere aktiviteter i Norge – ridning, natur og lokale opplevelser – start på ",
        { text: "NordExplore sin forside", href: HOME },
        ". Derfra finner du både Alta-turen og andre hesterelaterte aktiviteter rundt om i landet."
      ])
    ]
  }
];

async function main() {
  const authorId = "author-venabustallen";
  const author = await client.fetch(`*[_id==$id][0]{_id}`, { id: authorId });
  if (!author) throw new Error(`Author ${authorId} missing`);

  await mkdir(postsImgDir, { recursive: true });

  for (const article of ARTICLES) {
    console.log(`\n=== ${article.title}`);
    const imageUrl = await resolveWikiFile(article.wikiFile);
    const jpeg = await downloadAndResize(imageUrl);
    const meta = await sharp(jpeg).metadata();
    console.log(`  image ${meta.width}x${meta.height}`);

    const localPath = path.join(postsImgDir, `${article.slug}.jpg`);
    await writeFile(localPath, jpeg);

    const asset = await client.assets.upload("image", jpeg, {
      filename: `${article.slug}-1200.jpg`,
      contentType: "image/jpeg"
    });

    const excerpt =
      article.excerpt.length > 200
        ? article.excerpt.slice(0, 197) + "…"
        : article.excerpt;

    await client.createOrReplace({
      _id: article.id,
      _type: "post",
      title: article.title,
      slug: { _type: "slug", current: article.slug },
      excerpt,
      publishedAt: new Date().toISOString(),
      featured: !!article.featured,
      author: { _type: "reference", _ref: authorId },
      mainImage: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: article.imageAlt
      },
      categories: [
        { _type: "reference", _ref: article.category, _key: key() }
      ],
      body: article.body
    });
    console.log(`  ✓ /post/${article.slug}`);
  }

  console.log("\nDone.");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
