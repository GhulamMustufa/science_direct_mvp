import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const OJS_BASE_URL = process.env.OJS_BASE_URL;
  const OJS_API_KEY = process.env.OJS_API_KEY;
  
  // 1. Get contexts
  let res = await fetch(`${OJS_BASE_URL}/index.php/index/api/v1/contexts`, {
    headers: { Authorization: `Bearer ${OJS_API_KEY}` }
  });
  let data = await res.json();
  const path = data.items[0].urlPath;
  console.log('Journal Path:', path);

  // 2. Get published submissions
  res = await fetch(`${OJS_BASE_URL}/index.php/${path}/api/v1/submissions?status=3`, {
    headers: { Authorization: `Bearer ${OJS_API_KEY}` }
  });
  data = await res.json();
  
  if (data.items && data.items.length > 0) {
    const pub = data.items[0].publications[0];
    console.log('Article ID:', data.items[0].id);
    console.log('Galleys:', JSON.stringify(pub.galleys, null, 2));
  } else {
    console.log('No published articles found');
  }
}
main();
