const url =
  'http://localhost:4321/dev/blog-collection-test/f1-students/f1-to-eb5-green-card';
const h = await fetch(url).then((r) => r.text());
console.log('article-intro p:', h.includes('class="article-intro"'));
console.log('literal <intro>:', h.includes('<intro>'));
console.log('picture:', h.includes('<picture>'));
console.log('title:', h.match(/<title>([^<]+)/)?.[1]);
console.log('entry slug in page:', h.match(/data\.slug:<\/strong> ([^<]+)/)?.[1]);
const idx = h.indexOf('class="article-content"');
console.log('body sample:', h.slice(idx, idx + 500));
