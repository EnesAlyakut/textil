import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const dumpFile = path.join(ROOT, "database", "yeg-latest.dump");
const CHUNK_SIZE = 70 * 1024 * 1024; // 70MB

export function splitDump() {
  if (!fs.existsSync(dumpFile)) return;
  const stat = fs.statSync(dumpFile);
  if (stat.size <= 95 * 1024 * 1024) return; // fits in 1 file

  console.log(`Splitting ${stat.size} bytes dump into 70MB chunks...`);
  const buffer = fs.readFileSync(dumpFile);
  let partIndex = 1;
  let offset = 0;

  // Clean old parts
  const existingParts = fs.readdirSync(path.dirname(dumpFile)).filter((f) => f.includes("yeg-latest.dump.part"));
  for (const ep of existingParts) {
    fs.unlinkSync(path.join(path.dirname(dumpFile), ep));
  }

  while (offset < buffer.length) {
    const chunk = buffer.subarray(offset, offset + CHUNK_SIZE);
    const partName = `yeg-latest.dump.part${String(partIndex).padStart(2, "0")}`;
    fs.writeFileSync(path.join(path.dirname(dumpFile), partName), chunk);
    console.log(`Wrote ${partName} (${(chunk.length / 1024 / 1024).toFixed(1)} MB)`);
    offset += CHUNK_SIZE;
    partIndex++;
  }
}

splitDump();
