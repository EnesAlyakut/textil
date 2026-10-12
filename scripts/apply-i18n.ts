/**
 * Writes the Spanish and Russian copy (prisma/i18n/*.json) into the database:
 *  - products, collections, blog posts and categories → their `i18n` column
 *  - homepage sections → `…Es` / `…Ru` fields next to the existing languages
 * Idempotent; re-run after restoring a backup. Run: npm run db:i18n
 */
import { PrismaClient, type Prisma } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

if (!process.env.DATABASE_URL) process.env.DATABASE_URL = "postgresql://yeg:yeg_local_dev@localhost:5433/yeg?schema=public";

const db = new PrismaClient();
const dir = path.resolve(import.meta.dirname, "../prisma/i18n");
const read = (f: string) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
const LANGS = ["es", "ru"] as const;
const SUFFIX = { es: "Es", ru: "Ru" } as const;

type Rec = Record<string, unknown>;
type Entities = Record<string, Record<string, Rec>>;

async function main() {
  const ent = { es: read("entities.es.json") as Entities, ru: read("entities.ru.json") as Entities };
  const forRow = (model: string, id: string, extra: (t: Rec) => Rec = () => ({})) =>
    Object.fromEntries(LANGS.map((l) => [l, ent[l][model]?.[id] ? { ...ent[l][model][id], ...extra(ent[l][model][id]) } : undefined]).filter(([, v]) => v));

  let n = 0;
  for (const p of await db.product.findMany({ select: { id: true } })) {
    const i18n = forRow("product", p.id, (t) => ({ seoTitle: `${t.name} — ${t.color}`, seoDescription: t.short }));
    if (!Object.keys(i18n).length) continue;
    await db.product.update({ where: { id: p.id }, data: { i18n: i18n as Prisma.InputJsonValue } });
    n++;
  }
  for (const c of await db.collection.findMany({ select: { id: true } })) {
    const i18n = forRow("collection", c.id, (t) => ({ seoTitle: t.name, seoDescription: t.tagline }));
    if (Object.keys(i18n).length) await db.collection.update({ where: { id: c.id }, data: { i18n: i18n as Prisma.InputJsonValue } });
  }
  for (const b of await db.blog.findMany({ select: { id: true } })) {
    const i18n = forRow("blog", b.id, (t) => ({ seoTitle: t.title, seoDescription: t.excerpt }));
    if (Object.keys(i18n).length) await db.blog.update({ where: { id: b.id }, data: { i18n: i18n as Prisma.InputJsonValue } });
  }
  for (const c of await db.category.findMany({ select: { id: true } })) {
    const i18n = forRow("category", c.id);
    if (Object.keys(i18n).length) await db.category.update({ where: { id: c.id }, data: { i18n: i18n as Prisma.InputJsonValue } });
  }
  for (const c of await db.blogCategory.findMany({ select: { id: true } })) {
    const i18n = forRow("blogCategory", c.id);
    if (Object.keys(i18n).length) await db.blogCategory.update({ where: { id: c.id }, data: { i18n: i18n as Prisma.InputJsonValue } });
  }
  // Product photo alt texts follow the translated name and colour
  for (const img of await db.productImage.findMany({ select: { id: true, productId: true } })) {
    const i18n = Object.fromEntries(
      LANGS.map((l) => {
        const t = ent[l].product?.[img.productId];
        return [l, t ? { alt: `${t.name} — ${t.color} — YEG Textile` } : undefined];
      }).filter(([, v]) => v),
    );
    if (Object.keys(i18n).length) await db.productImage.update({ where: { id: img.id }, data: { i18n: i18n as Prisma.InputJsonValue } });
  }

  // Homepage sections
  const home = read("home.json") as Record<(typeof LANGS)[number], Record<string, Rec>>;
  for (const row of await db.homepageSection.findMany()) {
    const d = row.data as Rec;
    for (const l of LANGS) {
      const t = home[l][row.key];
      if (!t) continue;
      const S = SUFFIX[l];
      if (row.key === "showcase") {
        const texts = ((d.texts as Rec[] | undefined) ?? []).map((x, i) => {
          const tr = (t as unknown as Rec[])[i];
          return tr ? { ...x, ...Object.fromEntries(Object.entries(tr).map(([k, v]) => [`${k}${S}`, v])) } : x;
        });
        d.texts = texts;
        continue;
      }
      for (const [k, v] of Object.entries(t)) {
        if (k === "steps" && Array.isArray(d.steps)) {
          d.steps = (d.steps as Rec[]).map((s, i) => ({ ...s, ...Object.fromEntries(Object.entries((v as Rec[])[i] ?? {}).map(([kk, vv]) => [`${kk}${S}`, vv])) }));
        } else if (k === "alts" && Array.isArray(d.images)) {
          d.images = (d.images as Rec[]).map((img, i) => ((v as string[])[i] ? { ...img, [`alt${S}`]: (v as string[])[i] } : img));
        } else {
          d[`${k}${S}`] = v;
        }
      }
    }
    await db.homepageSection.update({ where: { key: row.key }, data: { data: d as Prisma.InputJsonValue } });
  }
  console.log(`Spanish/Russian copy written (${n} products, homepage sections, collections, blog, categories).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
