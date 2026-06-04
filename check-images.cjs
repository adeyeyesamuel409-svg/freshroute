const fs = require('fs');
const sql = fs.readFileSync('supabase/seed.sql', 'utf8');
const lines = sql.split('\n');

const items = ['Pineapple','Strawberries','Papaya','Limes','Mint','Guava','Mangoes','Green Beans','Durian','Garlic','Dragon Fruit','Coconut','Blackberries','Blueberries','Raspberries','Sweet Corn'];

items.forEach(item => {
  const line = lines.find(l => l.includes("'" + item + "'"));
  if (line) {
    const isWiki = line.includes('wikimedia');
    const isLorem = line.includes('loremflickr');
    const url = line.match(/'https?:\/\/[^']+'/);
    const source = isWiki ? 'WIKIMEDIA' : isLorem ? 'LOREMFLICKR' : 'OTHER';
    console.log(item + ': ' + source + ' -> ' + (url ? url[0].substring(0,70) : 'no URL'));
  } else {
    console.log(item + ': NOT FOUND');
  }
});
