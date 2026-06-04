const fs = require('fs');
const sql = fs.readFileSync('supabase/seed.sql', 'utf8');
const garLine = sql.split('\n').find(l => l.includes("'Garlic'"));
const mintLine = sql.split('\n').find(l => l.includes("'Mint'"));
const garUrl = garLine.match(/https?:\/\/[^']+/);
const mintUrl = mintLine.match(/https?:\/\/[^']+/);
console.log('Garlic:', garUrl ? garUrl[0] : 'none');
console.log('Mint:', mintUrl ? mintUrl[0] : 'none');
