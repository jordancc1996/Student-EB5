import { mkdir } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

const destDir = path.resolve('src/assets/photos');
await mkdir(destDir, { recursive: true });

const photos = [
  { file: 'uw-campus.jpg', id: 'PXoUUAtHTbw', image: 'photo-1741528803192-5cb5412faa19' },
  { file: 'campus-archway.jpg', id: 'MUiv880yORo', image: 'photo-1760111085279-6c4b6d831acc' },
  { file: 'cuhk-campus.jpg', id: 'sA5l7DimlqY', image: 'photo-1760551572356-06b0cfa5408f' },
  { file: 'suzzallo-interior.jpg', id: 'MX1jDkQJBQY', image: 'photo-1741707596666-89acab97e446' },
  { file: 'nyc-financial.jpg', id: '63W4HqhDNYc', image: 'photo-1587898002645-e87ac29a9468' },
  { file: 'lisbon-sunset.jpg', id: 'zEFfW3kXQR8', image: 'photo-1748279944004-f1d733dc711b' },
  { file: 'rural-grader.jpg', id: 'htc-q2ZcSYY', image: 'photo-1761135192805-c0f3fc4afdf4' },
  { file: 'oregon-highway.jpg', id: 'hDA5kGf0S6U', image: 'photo-1706466777992-a05c6c402ae9' },
  { file: 'dc-capitol.jpg', id: 'GiOcVe2PVpg', image: 'photo-1762713876768-241e337d08a0' },
  { file: 'shanghai-night.jpg', id: '2PgV2SS1JiE', image: 'photo-1742228891145-c6f73498495f' },
  { file: 'shanghai-bund.jpg', id: '0p37Ch2LYQc', image: 'photo-1752662742861-fb76c71576d7' },
  { file: 'seoul-skyline.jpg', id: 'CfqYTLLWATA', image: 'photo-1662075184840-9db5a890db13' },
  { file: 'mumbai-marine.jpg', id: 'nsunJX3Q9lg', image: 'photo-1666843527155-14ec5f016802' },
  { file: 'mumbai-night.jpg', id: '9SDgek2e7Bs', image: 'photo-1725561282012-5c4d302d7f69' },
  { file: 'chicago-river.jpg', id: 'tKkQBaxiWVE' },
  { file: 'dc-pillars.jpg', id: 'SwEKEwzOcWE' },
  { file: 'hanoi-old.jpg', id: 'Lg3JjZ1XJA0' },
  { file: 'hanoi-night.jpg', id: 'rbWr2av3Bp8' },
];

async function download(url, dest) {
  const res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'StudentEB5PhotoArchive/1.0' } });
  if (!res.ok || !res.body) throw new Error(`${res.status} ${url}`);
  const type = res.headers.get('content-type') || '';
  if (type.includes('text/html')) throw new Error(`HTML response for ${url}`);
  await pipeline(res.body, createWriteStream(dest));
}

for (const photo of photos) {
  const dest = path.join(destDir, photo.file);
  const urls = [
    photo.image ? `https://images.unsplash.com/${photo.image}?w=1600&q=80&fm=jpg` : null,
    `https://unsplash.com/photos/${photo.id}/download?force=true&w=1600`,
  ].filter(Boolean);

  let ok = false;
  for (const url of urls) {
    try {
      await download(url, dest);
      console.log(`OK ${photo.file}`);
      ok = true;
      break;
    } catch (err) {
      console.warn(`FAIL ${photo.file} via ${url}: ${err.message}`);
    }
  }
  if (!ok) console.error(`MISSING ${photo.file}`);
}
