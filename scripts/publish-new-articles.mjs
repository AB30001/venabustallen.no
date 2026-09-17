/**
 * Publish new SEO breed-directory articles with 1200px Wikimedia images.
 * Usage: node --env-file=.env.local scripts/publish-new-articles.mjs
 */
import { createClient } from "@sanity/client";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const postsImgDir = path.join(root, "public", "img", "posts");

const PROJECT =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "thxhf26m";
const DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
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

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function resolveWikiFile(filename) {
  const enc = encodeURIComponent(filename);
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${enc}?width=1600`;
  const res = await fetch(url, {
    method: "HEAD",
    redirect: "follow",
    headers: { "User-Agent": UA }
  });
  if (!res.ok) throw new Error(`Wiki file missing: ${filename} (${res.status})`);
  return res.url || url;
}

async function downloadAndResize(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/*" },
    redirect: "follow"
  });
  if (!res.ok) throw new Error(`Download failed ${res.status}`);
  const input = Buffer.from(await res.arrayBuffer());
  const meta = await sharp(input).metadata();
  console.log(`    source ${meta.width}x${meta.height} ${meta.format}`);

  const out = await sharp(input)
    .rotate()
    .resize({
      width: TARGET_WIDTH,
      withoutEnlargement: false,
      fit: "inside"
    })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  const outMeta = await sharp(out).metadata();
  console.log(`    resized ${outMeta.width}x${outMeta.height}`);
  if (outMeta.width !== TARGET_WIDTH && meta.width >= TARGET_WIDTH) {
    // fit:inside may shrink height-first for very tall images; force width
    const forced = await sharp(input)
      .rotate()
      .resize({ width: TARGET_WIDTH })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
    const fm = await sharp(forced).metadata();
    console.log(`    forced width ${fm.width}x${fm.height}`);
    return forced;
  }
  // If source was narrower, enlarge to 1200
  if (outMeta.width < TARGET_WIDTH) {
    const up = await sharp(input)
      .rotate()
      .resize({ width: TARGET_WIDTH })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
    const um = await sharp(up).metadata();
    console.log(`    upscaled ${um.width}x${um.height}`);
    return up;
  }
  return out;
}

async function uploadJpeg(buf, filename) {
  return client.assets.upload("image", buf, {
    filename,
    contentType: "image/jpeg"
  });
}

const ARTICLES = [
  {
    id: "post-guide-norske-hesteraser",
    title: "Norske hesteraser – komplett oversikt",
    slug: "norske-hesteraser",
    excerpt:
      "Oversikt over norske hesteraser: dølahest, fjordhest, nordlandshest/lyngshest og døletraver. Historie, særpreg og hva som skiller dem.",
    category: "category-norske",
    featured: true,
    wikiFile: "Cheval_fjord_00003.jpg",
    imageAlt: "Fjordhest i naturlig landskap – symbol på norske hesteraser",
    body: [
      [
        "normal",
        "Norge har et lite, men unikt sett med hesteraser formet av fjell, skog og kystklima. Når folk søker etter norske hesteraser, leter de ofte etter en tydelig oversikt: hvilke raser finnes, hva kjennetegner dem, og hvilken som passer til ridning, arbeid eller bevaring. Denne guiden samler de viktigste norske og nært beslektede nordiske rasene, med fokus på det som faktisk skiller dem i praksis."
      ],
      ["h2", "Hvilke hesteraser regnes som norske?"],
      [
        "normal",
        "De klassiske norske rasene er dølahest, fjordhest, nordlandshest/lyngshest og døletraver. Islandshesten er islandsk av opprinnelse, men står sterkt i norsk ridemiljø og sammenlignes ofte med de norske fjell- og ponni-typene. Alle disse rasene er mer hardføre og «jordnære» enn typiske internasjonale sportsvarmblod."
      ],
      ["h2", "Dølahest"],
      [
        "normal",
        "Dølahesten er den robuste fjell- og arbeidshesten fra Østlandet. Den er kraftig bygd, rolig i temperament og godt egnet til trekk, køring og turridning i krevende terreng. For deg som vil lese mer om historie, utseende og bruk, se vår egen artikkel om dølahest."
      ],
      ["h2", "Fjordhest"],
      [
        "normal",
        "Fjordhesten er Norges mest kjente rase internasjonalt, med den blonde manen og den mørke midtstripen. Den er allsidig, sterk for størrelsen og populær som familie- og turhest. Fjordhesten er ofte førstevalget når nybegynnere tenker «norsk hest»."
      ],
      ["h2", "Nordlandshest / lyngshest"],
      [
        "normal",
        "Nordlandshest/lyngshest er en elegant, mindre norsk rase med røtter i nord. Den kombinerer smidighet med hardførhet og egner seg godt til ridning i variert terreng. Mange verdsetter rasen for letthet i bevegelse sammenlignet med tyngre kaldblod."
      ],
      ["h2", "Døletraver"],
      [
        "normal",
        "Døletraveren er den norske kaldblodstraveren – avlet for travsport, men med samme kaldblodige bakgrunn som dølahesten. Den er raskere og mer atletisk i sele, og skiller seg fra bruksdølahesten i både type og treningskultur."
      ],
      ["h2", "Hvordan velge norsk rase?"],
      [
        "normal",
        "Velg etter bruk: dølahest for styrke og ro, fjordhest for allsidighet og gjenkjennelig type, nordlandshest for lettere ridning, døletraver for travsport. Sjekk alltid helse, temperament og om hesten er vant til den aktiviteten du planlegger. Norske raser har ofte begrenset populasjon – støtt seriøs avl og bevaringsarbeid."
      ],
      ["h2", "Les mer på Venabustallen"],
      [
        "normal",
        "Vi har egne dybdeartikler om dølahest, fjordhest, nordlandshest/lyngshest og islandshest. Bruk kategorien Norske raser for å bla videre, eller start i arkivet hvis du vil sammenligne flere hestetyper."
      ]
    ]
  },
  {
    id: "post-guide-kaldblodshest",
    title: "Kaldblodshest – hva er det, og hvilke raser finnes i Norge?",
    slug: "kaldblodshest",
    excerpt:
      "Hva er en kaldblodshest? Lær forskjellen på kaldblod, varmblod og ponni, og hvilke norske kaldblodshester som er mest aktuelle.",
    category: "category-norske",
    featured: true,
    wikiFile: "Dole_eating_grass.jpg",
    imageAlt: "Norsk kaldblodshest (dølahest) som beiter i grønt landskap",
    body: [
      [
        "normal",
        "Ordet kaldblodshest skaper ofte forvirring. Det handler ikke om kroppstemperatur, men om type: tyngre, mer robuste hester med roligere temperament enn typiske sportsvarmblod. I Norge er kaldblodstradisjonen sterk – fra fjellarbeid til travbane."
      ],
      ["h2", "Kaldblod, varmblod og ponni"],
      [
        "normal",
        "Kaldblod: kraftig bygning, ofte bredere kropp, sterke bein og et roligere sinn. Varmblod: lettere, mer reaktive sportstyper (dressur, sprang, feltritt). Ponni: definert etter mankehøyde, men kan være både «kald» og «varm» i temperamentspreg. En fjordhest eller nordlandshest kan oppfattes som mellomting – hardfør, men ikke like tung som en stor trekkhest."
      ],
      ["h2", "Norske kaldblodshester"],
      [
        "normal",
        "Dølahest og døletraver er de tydeligste norske kaldblodstypene. Dølahesten er bruks- og fjellhesten; døletraveren er spesialisert for trav. Begge har røtter i norsk arbeidskultur og klima."
      ],
      ["h2", "Hvorfor velge kaldblod?"],
      [
        "normal",
        "Mange velger kaldblod for ro, bæreevne og robusthet ute. De takler ofte vær, variert underlag og lengre økter i terreng bedre enn mer sensitive typer. Ulempen kan være mindre «sportslig» letthet i enkelte disipliner, og noen individer trenger bevisst mosjon for å unngå overvekt."
      ],
      ["h2", "Stell i praksis"],
      [
        "normal",
        "Fôring bør være grovfôrbasert med energi tilpasset arbeidet. Hovstell er kritisk for hester som går mye i stein og fjell. Gi nok fribevegelse – en kaldblodshest trives med oppgaver, ikke bare stalltid."
      ],
      ["h2", "Neste steg"],
      [
        "normal",
        "Vil du gå i dybden på enkelt rasene, les artiklene om dølahest og døletraver, eller se den samlede oversikten over norske hesteraser."
      ]
    ]
  },
  {
    id: "post-guide-hesteraser-nybegynnere",
    title: "Hesteraser for nybegynnere – rolige og allsidige valg",
    slug: "hesteraser-for-nybegynnere",
    excerpt:
      "Hvilke hesteraser passer for nybegynnere? Tips om temperament, størrelse og norske raser som ofte anbefales til ferske ryttere.",
    category: "category-norske",
    featured: false,
    wikiFile: "Cheval_fjord_00003.jpg",
    imageAlt: "Rolig fjordhest egnet som allsidig hest for nybegynnere",
    body: [
      [
        "normal",
        "Det finnes ingen universell «best hesterase for nybegynnere», men noen trekk går igjen: forutsigbart temperament, passe størrelse, og en hest som tåler nye situasjoner uten å bli overivrig. For mange i Norge peker det mot hardføre nordiske typer heller enn svært reaktive sportsvarmblod."
      ],
      ["h2", "Hva nybegynnere bør prioritere"],
      [
        "normal",
        "Temperament først, deretter helse og erfaring. En hest som er vant til mange ryttere, trail/terreng og tydelige rutiner er tryggere enn en ung, talentfull sporthest uten grunnlag. Størrelse betyr også noe: veldig store trekkhester kan være utfordrende å håndtere på bakken for en uerfaren person."
      ],
      ["h2", "Norske raser som ofte passer"],
      [
        "normal",
        "Fjordhest trekkes ofte frem som allsidig og robust. Dølahest kan være svært rolig, men er tyngre. Nordlandshest/lyngshest kan passe dem som ønsker en lettere ridetype. Islandshest er populær, men krever forståelse for gangarter og riktig trening – ikke automatisk «enkel» for alle nybegynnere."
      ],
      ["h2", "Unngå vanlige feil"],
      [
        "normal",
        "Ikke kjøp etter farge eller trend alene. Unngå å strekke deg til en hest som krever mer ridning enn du har kapasitet til. Ta med erfaren hjelp på prøveridning, og vær ærlig om nivå."
      ],
      ["h2", "Les mer"],
      [
        "normal",
        "Se våre artikler om fjordhest, dølahest og nordlandshest, eller start med oversikten over norske hesteraser for å sammenligne typene side om side."
      ]
    ]
  },
  {
    id: "post-guide-islandshest-tolt",
    title: "Islandshest og tølt – den femgangede nordiske hesten",
    slug: "islandshest-tolt",
    excerpt:
      "Islandshest er kjent for tølt og pass. Lær hva som gjør rasen unik, hvordan tølt fungerer, og hva du bør vite før du rider islandshest.",
    category: "category-norske",
    featured: true,
    wikiFile: "Icelandic_horse.jpg",
    imageAlt: "Islandshest i nordisk landskap – rasen kjent for tølt",
    body: [
      [
        "normal",
        "Islandshesten er liten av vekst, stor av personlighet – og verdenskjent for ekstra gangarter. Mange som søker etter islandshest eller tølt vil forstå forskjellen på vanlig trav og den karakteristiske, sittbare tölten. Denne artikkelen forklarer rasen praktisk, uten mystikk."
      ],
      ["h2", "Opprinnelse og type"],
      [
        "normal",
        "Rasen har utviklet seg isolert på Island i århundrer: hardfør, nøysom og allsidig. Selv om den ikke er en «norsk» rase historisk, er den svært vanlig i Norge og hører naturlig hjemme i en nordisk hesteoversikt."
      ],
      ["h2", "Hva er tølt?"],
      [
        "normal",
        "Tølt er en firaktig gangart der hesten har minst ett bein i bakken hele tiden – jevnere enn trav for mange ryttere. God tølt krever balanse, takt og riktig rideteknikk. Ikke alle individer har like sterk tølt; avl og trening betyr mye."
      ],
      ["h2", "Pass og andre gangarter"],
      [
        "normal",
        "Noen islandshester har også pass (skeið), en rask lateral gangart brukt i konkurranse. I tillegg kommer skritt, trav og galopp. En femgangshest behersker skritt, tölt, trav, galopp og pass."
      ],
      ["h2", "Temperament og ridning"],
      [
        "normal",
        "Islandshesten kan være fremover og arbeidsvillig. Den egner seg godt til turridning og spesialisert islandsridning, men nybegynnere bør få opplæring hos ridelærere som kjenner rasen – særlig for å sitte tølt riktig og unngå forvirring mellom gangarter."
      ],
      ["h2", "Videre lesning"],
      [
        "normal",
        "Vi har også en bredere artikkel om islandshest som rase. Sammenlign gjerne med fjordhest og nordlandshest hvis du vurderer nordiske ridetyper."
      ]
    ]
  }
];

async function main() {
  const authorId = "author-venabustallen";
  const author = await client.fetch(`*[_id==$id][0]{_id,name}`, { id: authorId });
  if (!author) throw new Error(`Author ${authorId} missing`);
  console.log(`Author: ${author.name}`);

  for (const article of ARTICLES) {
    console.log(`\n=== ${article.title}`);
    let imageUrl;
    try {
      imageUrl = await resolveWikiFile(article.wikiFile);
      console.log(`  wiki: ${article.wikiFile}`);
    } catch (e) {
      console.warn(`  wiki file failed: ${e.message}`);
      throw e;
    }

    const jpeg = await downloadAndResize(imageUrl);
    await mkdir(postsImgDir, { recursive: true });
    const localPath = path.join(postsImgDir, `${article.slug}.jpg`);
    await writeFile(localPath, jpeg);
    console.log(`  local: ${localPath}`);

    const asset = await uploadJpeg(jpeg, `${article.slug}-1200.jpg`);
    console.log(`  asset: ${asset._id}`);

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
      body: bodyFromPairs(article.body)
    });
    console.log(`  ✓ published /post/${article.slug}`);
    await sleep(500);
  }

  const count = await client.fetch(`count(*[_type=="post"])`);
  console.log(`\nDone. Total posts: ${count}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
