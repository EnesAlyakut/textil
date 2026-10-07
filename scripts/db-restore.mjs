/**
 * Veritabanını database/yeg-latest.dump dosyasından geri yükler.
 * Tüm ürünler, içerikler, ayarlar ve görseller (MediaAsset.data) veritabanına aktarılır.
 *
 * Çalıştırma: npm run db:restore
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const dumpFile = path.join(ROOT, "database", "yeg-latest.dump");

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
