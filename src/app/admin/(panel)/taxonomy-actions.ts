"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { int, revalidateSite, str } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

type Kind = "category" | "blogCategory";
const PATH: Record<Kind, string> = { category: "/admin/categories", blogCategory: "/admin/blog-categories" };

export async function saveTaxonomy(kind: Kind, id: string | null, fd: FormData) {
  await requireAdmin();
  const nameEn = str(fd, "nameEn");
  const nameTr = str(fd, "nameTr");
  if (!nameEn) return;
  const i18n = { es: str(fd, "nameEs") ? { name: str(fd, "nameEs") } : {}, ru: str(fd, "nameRu") ? { name: str(fd, "nameRu") } : {} };
  const data = { nameEn, nameTr: nameTr || nameEn, nameFr: str(fd, "nameFr") || null, slug: slugify(str(fd, "slug") || nameEn), sortOrder: int(fd, "sortOrder"), i18n };
  try {
    if (kind === "category") {
      if (id) await db.category.update({ where: { id }, data });
      else await db.category.create({ data });
    } else if (id) await db.blogCategory.update({ where: { id }, data });
    else await db.blogCategory.create({ data });
  } catch (e) {
    if (!(e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")) throw e;
  }
  revalidatePath(PATH[kind]);
  revalidateSite();
}

export async function deleteTaxonomy(kind: Kind, id: string) {
  await requireAdmin();
  if (kind === "category") await db.category.delete({ where: { id } });
  else await db.blogCategory.delete({ where: { id } });
  revalidatePath(PATH[kind]);
  revalidateSite();
}
