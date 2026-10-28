import fs from 'fs';
import path from 'path';

const fontsDir = path.resolve('public', 'fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

async function run() {
  const url = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Kantumruy+Pro:wght@400;600;700&display=swap';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  let css = await res.text();
  console.log('Fetched CSS length:', css.length);

  // Match all @font-face blocks with url(...)
  const urlRegex = /url\((https:\/\/fonts\.gstatic\.com\/[^\)]+)\)/g;
  let match;
  const urls = [];
  while ((match = urlRegex.exec(css)) !== null) {
    urls.push(match[1]);
  }

  console.log(`Found ${urls.length} font files to download`);

  let count = 0;
  for (const fontUrl of urls) {
    const filename = `font-${count++}-${path.basename(fontUrl)}`;
    const destPath = path.join(fontsDir, filename);
    
    console.log(`Downloading ${filename}...`);
    const fontRes = await fetch(fontUrl);
    const buffer = Buffer.from(await fontRes.arrayBuffer());
    fs.writeFileSync(destPath, buffer);

    // Replace the remote url with local relative path
    css = css.replace(fontUrl, `/fonts/${filename}`);
  }

  fs.writeFileSync(path.resolve('src', 'fonts.css'), css, 'utf-8');
  console.log('Saved src/fonts.css and local fonts in public/fonts/ successfully!');
}

run().catch(err => {
  console.error('Download error:', err);
  process.exit(1);
});

