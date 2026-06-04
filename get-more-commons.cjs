const fs = require('fs');
const existing = JSON.parse(fs.readFileSync('commons-results.json', 'utf8'));

async function getCommonsImage(query, skipTerms = []) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=' + encodeURIComponent(query) + '&gsrnamespace=6&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&gsrlimit=15';
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  const data = await res.json();
  if (!data.query || !data.query.pages) return null;
  const pages = data.query.pages;
  const sorted = Object.keys(pages).sort((a,b) => a-b);
  for (const id of sorted) {
    const page = pages[id];
    const title = page.title || '';
    const imageUrl = page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url;
    if (!imageUrl) continue;
    if (title.includes('.svg') || title.includes('.SVG')) continue;
    if (title.toLowerCase().includes('illustration')) continue;
    if (title.toLowerCase().includes('drawing')) continue;
    // Skip specific undesired terms
    let skip = false;
    for (const term of skipTerms) {
      if (title.toLowerCase().includes(term) || (imageUrl && imageUrl.toLowerCase().includes(term))) {
        skip = true;
        break;
      }
    }
    if (skip) continue;
    if (imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg') || imageUrl.endsWith('.png')) {
      return imageUrl;
    }
  }
  return null;
}

async function main() {
  // Retry garlic with different query, skip moldy
  console.log('Garlic:', await getCommonsImage('garlic harvest bulb fresh', ['moldy', 'mould', 'rotten']));
  
  // Retry remaining rate-limited items
  const remaining = [
    ['Dragon Fruit', 'pitaya fruit', []],
    ['Coconut', 'coconut fruit whole', ['palm tree', 'landscape']],
    ['Blackberries', 'blackberry fruit ripe', []],
    ['Blueberries', 'blueberry fruit fresh', []],
    ['Raspberries', 'raspberry fruit fresh', []],
    ['Sweet Corn', 'sweet corn cob', ['field', 'farmland']],
  ];

  for (const [product, query, skip] of remaining) {
    if (existing[product]) continue;
    await new Promise(r => setTimeout(r, 2000));
    try {
      const url = await getCommonsImage(query, skip);
      if (url) {
        existing[product] = url;
        console.log('OK: ' + product + ' -> ' + url.substring(0, 70));
      } else {
        console.log('FAIL: ' + product);
      }
    } catch(e) {
      console.log('ERR: ' + product + ' - ' + e.message.substring(0, 30));
      break;
    }
  }

  fs.writeFileSync('commons-results.json', JSON.stringify(existing, null, 2));
  const ok = Object.values(existing).filter(Boolean).length;
  console.log('\nTotal: ' + ok + '/' + Object.keys(existing).length);
}
main();
