/**
 * Stores every media file in the database (MediaAsset.data):
 *  - brand-media/**      → url /media/...   (source "brand")
 *  - brand-source/**     → url /media/brand-source/... and /brand-source/... (source "brand")
 *  - storage/uploads/**  → url /uploads/... (disk uploads, source "upload")
 * Idempotent: re-running updates existing rows. Run: npm run media:import
 */
import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";
import manifest from "../src/data/media-manifest.json";

if (!process.env.DATABASE_URL) process.env.DATABASE_URL = "postgresql://yeg:yeg_local_dev@localhost:5433/yeg?schema=public";

const db = new PrismaClient();
const ROOT = path.resolve(import.meta.dirname, "..");
const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

async function* walk(dir: string): AsyncGenerator<string> {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function importDir(dir: string, prefix: string, source: "brand" | "upload", createAliases?: (rel: string) => string[]) {
  let n = 0;
  for await (const file of walk(dir)) {
    const ext = path.extname(file).toLowerCase();
    const mimeType = TYPES[ext];
    if (!mimeType) continue;
    const rel = path.relative(dir, file).split(path.sep).join("/");
    const primaryUrl = `${prefix}/${rel}`;
    const data = await fs.readFile(file);

    let width = 0;
    let height = 0;
    let blurDataUrl: string | null = null;
    const known = (manifest as Record<string, { src: string; width: number; height: number; blur: string }>)[rel.replace(/\.jpg$/, "")];
    if (known && known.src === primaryUrl) {
      ({ width, height } = known);
      blurDataUrl = known.blur;
    } else if (mimeType.startsWith("image/") && mimeType !== "image/svg+xml") {
      try {
        const meta = await sharp(data).metadata();
        width = meta.width ?? 0;
        height = meta.height ?? 0;
        const tiny = await sharp(data).resize(16, 16, { fit: "inside" }).jpeg({ quality: 60 }).toBuffer();
        blurDataUrl = `data:image/jpeg;base64,${tiny.toString("base64")}`;
      } catch (err) {
        console.warn(`Could not process metadata for ${rel}:`, (err as Error).message);
      }
    }

    const row = { filename: path.basename(file), mimeType, source, width, height, size: data.length, blurDataUrl, data };
    await db.mediaAsset.upsert({ where: { url: primaryUrl }, update: row, create: { url: primaryUrl, ...row } });
    n++;

async function main() {
  console.log("Importing media to PostgreSQL database...");
  const brand = await importDir(path.join(ROOT, "brand-media"), "/media", "brand");
  const brandSource = await importDir(
    path.join(ROOT, "brand-source"),
    "/media/brand-source",
    "brand"
  );
  const uploads = await importDir(path.join(ROOT, process.env.UPLOAD_DIR || "storage/uploads"), "/uploads", "upload");
  const total = await db.mediaAsset.aggregate({ _count: true, _sum: { size: true } });
  console.log(
    `Imported ${brand} brand-media files, ${brandSource} brand-source files, ${uploads} uploads. Database now holds ${total._count} records (${((total._sum.size ?? 0) / 1024 / 1024).toFixed(1)} MB).`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
