/**
 * Ensure contact settings (email + Web3Forms key) are set in Sanity.
 */
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "thxhf26m",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN,
  useCdn: false
});

const email = "info@venebustallen.no";
const w3ckey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

const doc = await client
  .patch("settings")
  .set({ email, ...(w3ckey ? { w3ckey } : {}) })
  .commit();

console.log({
  email: doc.email,
  w3ckey: doc.w3ckey ? `${doc.w3ckey.slice(0, 8)}…` : null
});
