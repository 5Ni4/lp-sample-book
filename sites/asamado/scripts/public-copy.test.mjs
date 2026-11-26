import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const read = (name) => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');
test('customer-facing bakery pages and articles omit production jargon', () => {
  for (const file of ['index.html','blog/index.html','blog/posts.json','blog/journal.js']) {
    const source = read(file)
      .replace(/<!--[^]*?-->/g, '')
      .replace(/^\s*(?:\/\/|\/\*|\*).*$/gm, '');
    assert.doesNotMatch(source, /デモ|作例|設定|架空|サンプル|イメージ画像|生成画像/u, file);
  }
});
test('shop map is schematic, and no location directions are published', () => {
  const html = read('index.html');
  assert.match(html, /name="robots" content="noindex"/);
  assert.match(html, /src="photos\/shop-map.svg"/);
  assert.doesNotMatch(html, /google\.com\/maps|application\/ld\+json/);
  for (const name of ['東中野','西荻窪','代々木上原','清澄白河']) assert.ok(read('photos/shop-map.svg').includes(name));
});
