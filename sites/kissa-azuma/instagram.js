'use strict';
// Set only to confirmed, public cafe post permalinks from @eos_kurogoma.
const cafePosts = Object.freeze([
  "https://www.instagram.com/p/DJmMSoeSXHE/",
  "https://www.instagram.com/p/DJeRcSVSLu_/",
]);
const root = document.querySelector('#posts');
const validPost = /^https:\/\/www\.instagram\.com\/(?:p|reel)\/[a-zA-Z0-9_-]+\/$/;
let loadScript;
function setup() {
  if (window.instgrm?.Embeds) return Promise.resolve();
  return loadScript ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.instagram.com/embed.js';
    script.addEventListener('load', resolve, {once:true});
    script.addEventListener('error', () => {
      loadScript = undefined;
      script.remove();
      reject(new Error('embed unavailable'));
    }, {once:true});
    document.body.append(script);
  });
}
for (const url of new Set(cafePosts)) {
  if (!validPost.test(url)) continue;
  const card = document.createElement('article');
  card.className = 'post';
  const fallback = document.createElement('a');
  fallback.href = url;
  fallback.className = 'source';
  fallback.rel = 'noopener noreferrer';
  fallback.textContent = '元の投稿をInstagramで開く';
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'embed-btn';
  button.textContent = 'Instagram投稿を表示';
  button.addEventListener('click', async () => {
    button.disabled = true;
    const quote = document.createElement('blockquote');
    quote.className = 'instagram-media';
    quote.dataset.instgrmPermalink = url;
    quote.dataset.instgrmVersion = '14';
    const a = fallback.cloneNode(true);
    quote.append(a); card.prepend(quote);
    try {
      await setup();
      if (!window.instgrm?.Embeds) throw new Error('embed unavailable');
      window.instgrm.Embeds.process();
      button.remove();
    } catch {
      quote.remove(); button.disabled = false; button.textContent = '表示をもう一度試す';
    }
  });
  card.append(button,fallback); root.append(card);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        if (!button.disabled && button.isConnected) button.click();
      }
    }, {rootMargin: '180px'});
    observer.observe(card);
  }
}
