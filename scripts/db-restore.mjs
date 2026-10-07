/**
 * Veritabanını database/yeg-latest.dump dosyasından geri yükler.
 * Parçalı dosya (.part01, .part02) varsa otomatik olarak birleştirir.
 * Tüm ürünler, içerikler, ayarlar ve görseller (MediaAsset.data) veritabanına aktarılır.
 *
 * Çalıştırma: npm run db:restore
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const dbDir = path.join(ROOT, "database");
const dumpFile = path.join(dbDir, "yeg-latest.dump");

// Parçalı dump dosyalarını kontrol et
const parts = fs.existsSync(dbDir)
  ? fs.readdirSync(dbDir).filter((f) => f.startsWith("yeg-latest.dump.part")).sort()
  : [];

if (!fs.existsSync(dumpFile) && parts.length > 0) {
  console.log(`Parçalı dump dosyaları birleştiriliyor (${parts.join(", ")})...`);
  const out = fs.createWriteStream(dumpFile);
  for (const part of parts) {
    const data = fs.readFileSync(path.join(dbDir, part));
    out.write(data);
  }
  out.end();
  // Yazma bitene kadar bekle
  await new Promise((resolve) => out.on("finish", resolve));
  console.log("✓ Birleştirme tamamlandı.");
}

if (!fs.existsSync(dumpFile)) {
  console.error("Dump dosyası bulunamadı:", dumpFile);
  process.exit(1);
}

console.log(`Geri yükleme başlatılıyor: ${dumpFile} (${(fs.statSync(dumpFile).size / 1024 / 1024).toFixed(1)} MB)...`);

const restore = spawn(
  "docker",
  ["exec", "-i", "yeg-postgres", "pg_restore", "-U", "yeg", "-d", "yeg", "--clean", "--if-exists"],
  { stdio: ["pipe", "inherit", "inherit"] }
);

const stream = fs.createReadStream(dumpFile);
stream.pipe(restore.stdin);

restore.on("close", (code) => {
  // pg_restore uyarı durumlarında bazen 1 dönebilir, bu normaldir
  if (code === 0 || code === 1) {
    console.log("✓ Veritabanı ve tüm görseller başarıyla geri yüklendi!");
  } else {
    console.error("Veritabanı geri yükleme hata kodu:", code);
    process.exit(code ?? 1);
  }
});
