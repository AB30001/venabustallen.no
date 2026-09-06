/**
 * Update author to a real name + rider/human+horse profile photo.
 * Usage: node --env-file=.env.local scripts/update-author.mjs
 */
import { createClient } from "@sanity/client";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const PROJECT =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "thxhf26m";
const DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN =
  process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;

const client = createClient({
  projectId: PROJECT,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  token: TOKEN,
  useCdn: false
});

const AUTHOR = {
  _id: "author-venabustallen",
  name: "Ingrid Haugen",
  slug: "ingrid-haugen",
  alt: "Ingrid Haugen til hest på fjelltur",
  bio: "Ingrid Haugen er ridelærer og fjellguide ved Venabustallen på Venabygdsfjellet. Hun skriver om hesteraser, trygg fjellridning og hverdagen i stallen — med dølahestene som faste følgesvenner."
};

/** Tomáš Malík — group riding on mountain trail (person + horse) */
const UNSPLASH_ID = "CzQb6zwTNOY";

async function resolveUnsplash(id) {
  const res = await fetch(
    `https://unsplash.com/photos/${id}/download?force=true`,
    {
      redirect: "manual",
      headers: { "User-Agent": "VenabustallenAuthor/1.0" }
    }
  );
  const loc = res.headers.get("location");
  if (!loc) throw new Error("No Unsplash redirect");
  return loc;
}

async function main() {
  if (!TOKEN) {
    console.error("Missing write token");
    process.exit(1);
  }

  const remote = await resolveUnsplash(UNSPLASH_ID);
  console.log("Downloading…", remote.split("?")[0]);
  const imgRes = await fetch(remote, {
    headers: { "User-Agent": "VenabustallenAuthor/1.0" }
  });
  if (!imgRes.ok) throw new Error(`Download failed ${imgRes.status}`);
  const buf = Buffer.from(await imgRes.arrayBuffer());

  const asset = await client.assets.upload("image", buf, {
    filename: "author-ingrid-haugen.jpg",
    contentType: "image/jpeg"
  });
  console.log("Uploaded asset", asset._id);

  await client.createOrReplace({
    _id: AUTHOR._id,
    _type: "author",
    name: AUTHOR.name,
    slug: { _type: "slug", current: AUTHOR.slug },
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
      alt: AUTHOR.alt
    },
    bio: [
      {
        _type: "block",
        _key: "bio1",
        style: "normal",
        markDefs: [],
        children: [
          { _type: "span", _key: "s1", marks: [], text: AUTHOR.bio }
        ]
      }
    ]
  });

  const authorsDir = path.join(root, "public", "img", "authors");
  await mkdir(authorsDir, { recursive: true });
  const dest = path.join(authorsDir, `${AUTHOR.slug}.jpg`);
  await writeFile(dest, buf);
  // Remove old generic author file if present
  try {
    await unlink(path.join(authorsDir, "venabustallen.jpg"));
  } catch {
    /* ignore */
  }

  console.log(`Updated author → ${AUTHOR.name} (/author/${AUTHOR.slug})`);
  console.log(`Local profile → /img/authors/${AUTHOR.slug}.jpg`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
