import type { ReactNode } from "react";
import { FormShell } from "@/components/admin/FormShell";
import { GalleryField } from "@/components/admin/GalleryField";
import { ImageField } from "@/components/admin/ImageField";
import { ImageListField } from "@/components/admin/ImageListField";
import { PickList } from "@/components/admin/PickList";
import { VideoField } from "@/components/admin/VideoField";
import { Bilingual, Card, Checkbox, Field, Input, PageTitle, lv } from "@/components/admin/ui";
import { SHOWCASE_DEFAULTS } from "@/content/showcase";
import { HOMEPAGE_KEYS, type HomepageKey, type HomepageSections } from "@/lib/content-types";
import { db } from "@/lib/db";
import { saveHomepage } from "./actions";

export const metadata = { title: "Ana sayfa" };

const LABELS: Record<HomepageKey, { title: string; description: string }> = {
  hero: { title: "Hero", description: "Tam ekran açılış alanı: görsel/video, büyük başlık ve buton." },
  intro: { title: "Manifesto", description: "Scroll ile kelime kelime beliren marka mesajı." },
  marquee: { title: "Kayan yazı", description: "Güç · Üretim · Kimlik… şeridi." },
  featured: { title: "Seçili parçalar", description: "1 büyük + 2 yatay görsel. Kampanya görselleri yüklüyse onlar, değilse yatay görseli olan seçili ürünler gösterilir." },
  statement: { title: "Tam ekran görsel", description: "Scroll ile 0.8 → 1 büyüyen kampanya karesi." },
  showcase: { title: "Ürün vitrini", description: "En fazla 5 kare. Bilgisayardan görsel yükleyin; isterseniz her kareye bir ürün bağlayın." },
  lookbook: { title: "Lookbook", description: "3×3 kampanya galerisi ve “Koleksiyonları keşfet” butonu. Başlık sadece ekran okuyucular içindir." },
  story: { title: "Marka hikâyesi", description: "Solda metin, altında 3 adımlık süreç çizgisi." },
  collections: { title: "Koleksiyonlar", description: "Yatay kaydırılan koleksiyon şeridi. Boş bırakılırsa tümü gösterilir." },
  banner: { title: "Kapanış banner'ı", description: "Sayfa sonundaki görsel, başlık ve buton." },
};

export default async function AdminHomepage() {
  const [rows, products, collections] = await Promise.all([
    db.homepageSection.findMany({ orderBy: { sortOrder: "asc" } }),
    db.product.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" }, include: { images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }], take: 1 } } }),
    db.collection.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  const meta = Object.fromEntries(rows.map((r) => [r.key, r])) as Record<HomepageKey, (typeof rows)[number] | undefined>;
  const s = Object.fromEntries(rows.map((r) => [r.key, r.data])) as unknown as HomepageSections;
  const productOptions = products.map((p) => ({ value: p.slug, label: p.nameEn, sub: p.code ?? undefined, image: p.images[0]?.url }));
  const collectionOptions = collections.map((c) => ({ value: c.slug, label: c.nameEn, sub: c.nameEn, image: c.coverUrl }));

  const fields: Record<HomepageKey, ReactNode> = {
    hero: (
      <>
        <ImageField label="Hero görseli (masaüstü) *" name="hero.image" value={s.hero?.image} hint="En az 2400px genişlik önerilir." />
        <ImageListField label="Ek hero slaytları (opsiyonel)" name="hero.images" value={s.hero?.images} hint="Eklerseniz hero, ana görselle birlikte yumuşak geçişli bir slayt gösterisine dönüşür. Video seçiliyse slaytlar kullanılmaz." />
        <ImageField label="Mobil hero görseli (opsiyonel)" name="hero.mobileImage" value={s.hero?.mobileImage} hint="Dikey bir kare; boşsa masaüstü görseli odak noktasından kırpılır." />
        <VideoField name="hero.videoUrl" value={s.hero?.videoUrl} />
        <Bilingual label="Başlık" name="hero.title" en={s.hero?.titleEn} tr={s.hero?.titleTr} fr={s.hero?.titleFr} es={lv(s.hero, "title", "es")} ru={lv(s.hero, "title", "ru")} textarea rows={2} hint="Satır kırmak için Enter kullanın; aksi halde otomatik iki satıra bölünür." />
        <Bilingual label="Alt başlık" name="hero.subtitle" en={s.hero?.subtitleEn} tr={s.hero?.subtitleTr} fr={s.hero?.subtitleFr} es={lv(s.hero, "subtitle", "es")} ru={lv(s.hero, "subtitle", "ru")} />
        <Bilingual label="Buton metni" name="hero.ctaLabel" en={s.hero?.ctaLabelEn} tr={s.hero?.ctaLabelTr} fr={s.hero?.ctaLabelFr} es={lv(s.hero, "ctaLabel", "es")} ru={lv(s.hero, "ctaLabel", "ru")} />
        <Field label="Buton bağlantısı" hint="Dil öneki eklemeyin, örn. /products">
          <Input name="hero.ctaHref" defaultValue={s.hero?.ctaHref ?? "/products"} />
        </Field>
      </>
    ),
    intro: (
      <>
        <Bilingual label="Küçük etiket" name="intro.label" en={s.intro?.labelEn} tr={s.intro?.labelTr} fr={s.intro?.labelFr} es={lv(s.intro, "label", "es")} ru={lv(s.intro, "label", "ru")} hint="Boşsa “Manifesto” yazar." />
        <Bilingual label="Başlık" name="intro.title" en={s.intro?.titleEn} tr={s.intro?.titleTr} fr={s.intro?.titleFr} es={lv(s.intro, "title", "es")} ru={lv(s.intro, "title", "ru")} hint="Opsiyonel." />
        <Bilingual label="Metin" name="intro.text" en={s.intro?.textEn} tr={s.intro?.textTr} fr={s.intro?.textFr} es={lv(s.intro, "text", "es")} ru={lv(s.intro, "text", "ru")} textarea rows={10} hint="Her satır ayrı satır olarak gösterilir." />
      </>
    ),
    marquee: <Bilingual label="Kelimeler (her satıra bir)" name="marquee.items" en={s.marquee?.itemsEn.join("\n")} tr={s.marquee?.itemsTr.join("\n")} fr={s.marquee?.itemsFr?.join("\n")} es={lv(s.marquee, "items", "es")} ru={lv(s.marquee, "items", "ru")} textarea rows={5} />,
    featured: (
      <>
        <Bilingual label="Başlık" name="featured.title" en={s.featured?.titleEn} tr={s.featured?.titleTr} fr={s.featured?.titleFr} es={lv(s.featured, "title", "es")} ru={lv(s.featured, "title", "ru")} />
        {[0, 1, 2].map((i) => (
          <ImageField
            key={i}
            label={i === 0 ? "Kampanya görseli 1 (büyük)" : `Kampanya görseli ${i + 1}`}
            name={`featured.gallery.${i}`}
            value={s.featured?.gallery?.[i]}
            hint={i === 0 ? "Yatay (16:9) görseller. Görsel eklenirse ürün kartları yerine bunlar gösterilir; hepsi boşsa aşağıdaki ürünler kullanılır." : undefined}
          />
        ))}
        <PickList name="featured.productSlugs" options={productOptions} initial={s.featured?.productSlugs ?? []} ordered max={3} />
      </>
    ),
    statement: (
      <>
        <ImageField label="Görsel *" name="statement.image" value={s.statement?.image} hint="Tam ekran gösterilir — 2400px+ önerilir." />
        <ImageListField label="Ek görseller (opsiyonel)" name="statement.images" value={s.statement?.images} hint="Ana görselin ardından otomatik olarak yumuşak geçişle değişir." />
        <Bilingual label="Alt yazı" name="statement.caption" en={s.statement?.captionEn} tr={s.statement?.captionTr} fr={s.statement?.captionFr} es={lv(s.statement, "caption", "es")} ru={lv(s.statement, "caption", "ru")} />
        <Bilingual label="Küçük etiket" name="statement.eyebrow" en={s.statement?.eyebrowEn} tr={s.statement?.eyebrowTr} fr={s.statement?.eyebrowFr} es={lv(s.statement, "eyebrow", "es")} ru={lv(s.statement, "eyebrow", "ru")} hint="Örn. AR-GE" />
        <Bilingual label="Başlık" name="statement.title" en={s.statement?.titleEn} tr={s.statement?.titleTr} fr={s.statement?.titleFr} es={lv(s.statement, "title", "es")} ru={lv(s.statement, "title", "ru")} textarea rows={2} hint="Satır kırmak için Enter." />
        <Bilingual
          label="Metin"
          name="statement.text"
          en={s.statement?.textEn}
          tr={s.statement?.textTr}
          fr={s.statement?.textFr} es={lv(s.statement, "text", "es")} ru={lv(s.statement, "text", "ru")}
          textarea
          rows={8}
          hint="Her satır kaydırırken sırayla gösterilir; 40 karakterden kısa bir satır bir öncekinin kırmızı vurgusu olur. Boş bırakılırsa eski görünüm (başlık iki yana açılır) kullanılır."
        />
      </>
    ),
    showcase: (
      <>
        {[0, 1, 2, 3, 4].map((i) => {
          const tx = s.showcase?.texts?.[i] ?? {};
          // Empty fields show the slot's default text, so what the site shows is what you edit
          const def = (l: "tr" | "en" | "fr" | "es" | "ru", f: string) => (f === "collection" || i < (s.showcase?.productSlugs.length ?? 0) ? "" : (SHOWCASE_DEFAULTS[l][i] as Record<string, string>)[f]);
          const b = (f: "name" | "description" | "collection" | "color" | "material") => ({
            en: tx[`${f}En`] || def("en", f),
            tr: tx[`${f}Tr`] || def("tr", f),
            fr: tx[`${f}Fr`] || def("fr", f),
            es: (tx as Record<string, string>)[`${f}Es`] || def("es", f),
            ru: (tx as Record<string, string>)[`${f}Ru`] || def("ru", f),
          });
          return (
            <details key={i} className="rounded-lg border border-line p-4" open={i === 0 || !!s.showcase?.images?.[i]}>
              <summary className="cursor-pointer text-xs font-semibold">Kare {i + 1}</summary>
              <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
                <ImageField
                  label="Görsel"
                  name={`showcase.images.${i}`}
                  value={s.showcase?.images?.[i]}
                  hint={i === 0 ? "Bilgisayardan yükleyin. Aşağıda aynı sırada bir ürün seçiliyse, boş bıraktığınız yazılar o üründen gelir." : undefined}
                />
                <div className="space-y-3">
                  <Bilingual label="Başlık" name={`showcase.texts.${i}.name`} {...b("name")} />
                  <Bilingual label="Kısa açıklama" name={`showcase.texts.${i}.description`} {...b("description")} textarea rows={2} />
                  <Bilingual label="Koleksiyon" name={`showcase.texts.${i}.collection`} {...b("collection")} />
                  <Bilingual label="Renk" name={`showcase.texts.${i}.color`} {...b("color")} />
                  <Bilingual label="Malzeme" name={`showcase.texts.${i}.material`} {...b("material")} />
                </div>
              </div>
            </details>
          );
        })}
        <p className="admin-label">Karelere bağlanacak ürünler (opsiyonel, sırayla)</p>
        <PickList name="showcase.productSlugs" options={productOptions} initial={s.showcase?.productSlugs ?? []} ordered max={5} />
      </>
    ),
    lookbook: (
      <>
        <Bilingual label="Başlık" name="lookbook.title" en={s.lookbook?.titleEn} tr={s.lookbook?.titleTr} fr={s.lookbook?.titleFr} es={lv(s.lookbook, "title", "es")} ru={lv(s.lookbook, "title", "ru")} />
        <GalleryField
          primary={false}
          name="lookbook.images"
          initial={(s.lookbook?.images ?? []).map((i) => ({ ...i, isPrimary: Boolean(i.isPrimary) }))}
        />
      </>
    ),
    story: (
      <>
        <Bilingual label="Metin" name="story.text" en={s.story?.textEn} tr={s.story?.textTr} fr={s.story?.textFr} es={lv(s.story, "text", "es")} ru={lv(s.story, "text", "ru")} textarea rows={4} />
        <ImageField
          label="Arka plan görseli"
          name="story.texture"
          value={s.story?.texture}
          hint="Bölümün arkasında soluk ve yazı tarafı koyulaştırılmış şekilde gösterilir. Yatay, en az 2000px önerilir."
        />
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-3 rounded-lg border border-line p-4">
            <p className="text-xs font-semibold text-ash">Adım {i + 1}</p>
            <Bilingual label="Başlık" name={`story.steps.${i}.title`} en={s.story?.steps[i]?.titleEn} tr={s.story?.steps[i]?.titleTr} fr={s.story?.steps[i]?.titleFr} es={lv(s.story?.steps[i], "title", "es")} ru={lv(s.story?.steps[i], "title", "ru")} />
            <Bilingual label="Metin" name={`story.steps.${i}.text`} en={s.story?.steps[i]?.textEn} tr={s.story?.steps[i]?.textTr} fr={s.story?.steps[i]?.textFr} es={lv(s.story?.steps[i], "text", "es")} ru={lv(s.story?.steps[i], "text", "ru")} textarea rows={2} />          </div>
        ))}
      </>
    ),
    collections: (
      <>
        <Bilingual label="Başlık" name="collections.title" en={s.collections?.titleEn} tr={s.collections?.titleTr} fr={s.collections?.titleFr} es={lv(s.collections, "title", "es")} ru={lv(s.collections, "title", "ru")} />
        <PickList name="collections.collectionSlugs" options={collectionOptions} initial={s.collections?.collectionSlugs ?? []} ordered />
        <details className="rounded-lg border border-line p-4" open={Object.values(s.collections?.covers ?? {}).some(Boolean)}>
          <summary className="cursor-pointer text-xs font-semibold">Ana sayfaya özel kapak görselleri (opsiyonel)</summary>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {collections.map((c) => (
              <ImageField
                key={c.slug}
                label={c.nameEn}
                name={`collections.covers.${c.slug}`}
                value={s.collections?.covers?.[c.slug]}
                hint="Boşsa koleksiyonun kendi kapağı kullanılır."
              />
            ))}
          </div>
        </details>
      </>
    ),
    banner: (
      <>
        <ImageField label="Arka plan *" name="banner.image" value={s.banner?.image} />
        <ImageListField label="Ek arka planlar (opsiyonel)" name="banner.images" value={s.banner?.images} hint="Ana görselin ardından otomatik olarak yumuşak geçişle değişir." />
        <Bilingual label="Başlık" name="banner.title" en={s.banner?.titleEn} tr={s.banner?.titleTr} fr={s.banner?.titleFr} es={lv(s.banner, "title", "es")} ru={lv(s.banner, "title", "ru")} />
        <Bilingual label="Metin" name="banner.text" en={s.banner?.textEn} tr={s.banner?.textTr} fr={s.banner?.textFr} es={lv(s.banner, "text", "es")} ru={lv(s.banner, "text", "ru")} textarea rows={3} />
        <Bilingual label="Buton metni" name="banner.ctaLabel" en={s.banner?.ctaLabelEn} tr={s.banner?.ctaLabelTr} fr={s.banner?.ctaLabelFr} es={lv(s.banner, "ctaLabel", "es")} ru={lv(s.banner, "ctaLabel", "ru")} />
        <Field label="Buton bağlantısı">
          <Input name="banner.ctaHref" defaultValue={s.banner?.ctaHref ?? "/contact"} />
        </Field>
      </>
    ),
  };

  const ordered = [...HOMEPAGE_KEYS].sort((a, b) => (meta[a]?.sortOrder ?? 99) - (meta[b]?.sortOrder ?? 99));

  return (
    <>
      <PageTitle title="Ana sayfa yönetimi" description="Bölümleri açıp kapatın, sıralayın ve içeriklerini düzenleyin. Değişiklikler kaydedildiği anda sitede yayına girer." />
      <FormShell action={saveHomepage}>
        {ordered.map((key) => (
          <Card key={key} title={LABELS[key].title} description={LABELS[key].description}>
            <div className="flex flex-wrap items-center gap-6 rounded-md bg-ink/50 p-3">
              <Checkbox name={`${key}.enabled`} label="Bu bölüm görünsün" defaultChecked={meta[key]?.enabled ?? true} />
              <label className="flex items-center gap-2 text-sm">
                Sıra
                <input name={`${key}.sortOrder`} type="number" defaultValue={meta[key]?.sortOrder ?? 0} className="admin-input w-20" />
              </label>
            </div>
            {fields[key]}
          </Card>
        ))}
      </FormShell>
    </>
  );
}
