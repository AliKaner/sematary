// data/ altındaki kaynak JSON'ları graves tablosuna uygun JSONL'e dönüştürür.
// Kullanım:
//   node scripts/build-seed-jsonl.mjs
//   npx convex import --table graves --replace data/graves.jsonl
// Kaynaklar:
//   Şehitler: Mehmetçik Vakfı (mehmetcik.org.tr/sehitlerimiz)
//   Kadınlar: Anıt Sayaç (anitsayac.com)
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sehitler = JSON.parse(
  readFileSync(join(root, "data", "sehitler.json"), "utf8"),
);
const kadinlar = JSON.parse(
  readFileSync(join(root, "data", "anitsayac_kadinlar.json"), "utf8"),
);

// "Eyüp GÜNER" / "GAZİANTEP" gibi büyük harfli alanları Türkçe kurallarına
// göre baş harfleri büyük olacak şekilde düzeltir (İ/ı ayrımı için tr-TR).
const trTitle = (s) =>
  (s ?? "")
    .toLocaleLowerCase("tr-TR")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toLocaleUpperCase("tr-TR") + w.slice(1))
    .join(" ");

const dots = (t) => (t ?? "").replaceAll("/", ".");
const unknown = (v) => !v || v === "Tespit Edilemeyen";

const rows = [];

for (const s of sehitler) {
  const story = [
    s.tarih ? `${dots(s.tarih)} tarihinde şehit oldu.` : "Şehit oldu.",
    unknown(s.il) ? null : `Memleketi: ${trTitle(s.il)}.`,
    "Kaynak: Mehmetçik Vakfı.",
  ]
    .filter(Boolean)
    .join(" ");
  rows.push({
    section: "sehitler",
    name: [s.rutbe, trTitle(s.isim)].filter(Boolean).join(" "),
    ...(typeof s.yil === "number" ? { deathYear: s.yil } : {}),
    epitaph: "Vatan sana minnettardır.",
    story,
    candles: 0,
    roses: 0,
  });
}

for (const k of kadinlar) {
  const story = [
    k.tarih
      ? `${dots(k.tarih)} tarihinde şiddet sonucu yaşamı elinden alındı.`
      : "Şiddet sonucu yaşamı elinden alındı.",
    unknown(k.il) ? null : `Yer: ${k.il}.`,
    "Kaynak: Anıt Sayaç (anitsayac.com).",
  ]
    .filter(Boolean)
    .join(" ");
  rows.push({
    section: "kadinlar",
    name: k.isim,
    ...(typeof k.yil === "number" ? { deathYear: k.yil } : {}),
    epitaph: "Unutmayacağız.",
    story,
    candles: 0,
    roses: 0,
  });
}

const out = join(root, "data", "graves.jsonl");
writeFileSync(out, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
console.log(
  `data/graves.jsonl yazıldı — sehitler: ${sehitler.length}, kadinlar: ${kadinlar.length}, toplam: ${rows.length}`,
);
