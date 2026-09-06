/**
 * Download design + Sanity post/author images into public/img
 * so the frontend never hotlinks external CDNs at runtime.
 *
 * Usage: node --env-file=.env.local scripts/localize-images.mjs
 */
import { createClient } from "@sanity/client";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicImg = path.join(root, "public", "img");

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

const client = createClient({
  projectId: PROJECT,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  token: TOKEN,
  useCdn: false
});

const DESIGN = {
  "hero-ride.jpg":
    "https://images.unsplash.com/photo-1716369414491-40a88a62d565?auto=format&fit=crop&w=2000&q=80",
  "band-trail.jpg":
    "https://images.unsplash.com/photo-1661345441183-d3d10b1f4e97?auto=format&fit=crop&w=2000&q=80",
  "fjord-horse-snow.jpg":
    "https://images.unsplash.com/photo-1675197188004-a2ab36c3933d?auto=format&fit=crop&w=1400&q=80",
  "fjord-horse-rest.jpg":
    "https://images.unsplash.com/photo-1685041539169-14088cc0d667?auto=format&fit=crop&w=1400&q=80",
  "norway-fjord.jpg":
    "https://images.unsplash.com/photo-1753541399382-6f5f6963ab26?auto=format&fit=crop&w=1600&q=80"
};

async function download(url, dest) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "VenabustallenLocalize/1.0 (https://venabustallen.no; asset mirror)"
    },
    redirect: "follow"
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, buf);
  return buf.length;
}

function sanityFileUrl(ref) {
  // image-{id}-{WxH}-{format}
  const match = ref?.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);
  if (!match) return null;
  const [, id, dims, format] = match;
  return `https://cdn.sanity.io/images/${PROJECT}/${DATASET}/${id}-${dims}.${format}?w=1600&auto=format`;
}

async function main() {
  console.log("Localizing images → public/img …");

  const designDir = path.join(publicImg, "design");
  for (const [file, url] of Object.entries(DESIGN)) {
    const dest = path.join(designDir, file);
    const n = await download(url, dest);
    console.log(`  design/${file} (${n} bytes)`);
  }

  const posts = await client.fetch(
    `*[_type=="post" && defined(slug.current) && defined(mainImage.asset)]{
      "slug": slug.current,
      "ref": mainImage.asset._ref
    }`
  );
  const postsDir = path.join(publicImg, "posts");
  for (const post of posts) {
    const url = sanityFileUrl(post.ref);
    if (!url) {
      console.warn(`  skip post ${post.slug}: bad ref`);
      continue;
    }
    const dest = path.join(postsDir, `${post.slug}.jpg`);
    try {
      const n = await download(url, dest);
      console.log(`  posts/${post.slug}.jpg (${n} bytes)`);
    } catch (err) {
      console.warn(`  fail post ${post.slug}: ${err.message}`);
    }
  }

  const authors = await client.fetch(
    `*[_type=="author" && defined(slug.current) && defined(image.asset)]{
      "slug": slug.current,
      "ref": image.asset._ref
    }`
  );
  const authorsDir = path.join(publicImg, "authors");
  for (const author of authors) {
    const url = sanityFileUrl(author.ref);
    if (!url) continue;
    const dest = path.join(authorsDir, `${author.slug}.jpg`);
    try {
      const n = await download(url, dest);
      console.log(`  authors/${author.slug}.jpg (${n} bytes)`);
    } catch (err) {
      console.warn(`  fail author ${author.slug}: ${err.message}`);
    }
  }

  const about = await client.fetch(
    `*[_type=="about" || _type=="page" && slug.current=="about"][0]{
      "ref": image.asset._ref
    }`
  );
  if (about?.ref) {
    const url = sanityFileUrl(about.ref);
    if (url) {
      const dest = path.join(publicImg, "about.jpg");
      const n = await download(url, dest);
      console.log(`  about.jpg (${n} bytes)`);
    }
  }

  console.log(`Done. Posts mirrored: ${posts.length}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
