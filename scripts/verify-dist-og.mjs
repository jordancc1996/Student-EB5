import fs from 'fs';

const file =
  'dist/research/regional-center-shutdown-eb5-investor-protections/index.html';
const html = fs.readFileSync(file, 'utf8');
const og = html.match(/property="og:image" content="([^"]+)"/)?.[1];
console.log('og:image:', og);
console.log('has /@fs/ anywhere:', html.includes('/@fs/'));
console.log(
  'has /src/assets/ in src/href:',
  /(?:src|href)=["'][^"']*\/src\/assets\//.test(html)
);
