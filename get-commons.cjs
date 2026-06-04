async function getCommonsImage(query) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=' + encodeURIComponent(query) + '&gsrnamespace=6&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&gsrlimit=5';
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  const data = await res.json();
  if (!data.query || !data.query.pages) return null;
  const pages = data.query.pages;
  // Find a real photo (not an illustration, not a vector graphic)
  for (const id of Object.keys(pages).sort((a,b) => a-b)) {
    const page = pages[id];
    const title = page.title || '';
    const imageUrl = page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url;
    // Skip SVG, botanical illustrations, and very old images
    if (title.includes('.svg') || title.includes('.SVG')) continue;
    if (title.toLowerCase().includes('illustration')) continue;
    if (title.toLowerCase().includes('drawing')) continue;
    if (imageUrl && (imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg') || imageUrl.endsWith('.png'))) {
      return imageUrl;
    }
  }
  return null;
}

async function main() {
  const items = {
    'Pineapple': 'Pineapple',
    'Strawberries': 'Strawberry fruit',
    'Papaya': 'Papaya fruit',
    'Limes': 'Lime fruit',
    'Mint': 'Mentha plant',
    'Guava': 'Guava fruit',
    'Mangoes': 'Mango fruit',
    'Green Beans': 'Green bean vegetable',
    'Durian': 'Durian fruit',
    'Garlic': 'Garlic bulb',
    'Dragon Fruit': 'Pitaya',
    'Coconut': 'Coconut fruit',
    'Blackberries': 'Blackberry fruit',
    'Blueberries': 'Blueberry fruit',
    'Raspberries': 'Raspberry fruit',
    'Sweet Corn': 'Corn cob',
  };

  const results = {};
  for (const [product, searchQuery] of Object.entries(items)) {
    try {
      const url = await getCommonsImage(searchQuery);
      if (url) {
        results[product] = url;
        console.log('OK: ' + product + ' -> ' + url.substring(0, 70));
      } else {
        results[product] = null;
        console.log('FAIL: ' + product + ' - no image found');
      }
    } catch(e) {
      results[product] = null;
      console.log('ERR: ' + product + ' - ' + e.message.substring(0, 30));
    }
    await new Promise(r => setTimeout(r, 1500));
  }

  const fs = require('fs');
  fs.writeFileSync('commons-results.json', JSON.stringify(results, null, 2));
  const ok = Object.values(results).filter(Boolean).length;
  console.log('\nTotal: ' + ok + '/' + Object.keys(results).length);
}
main();
