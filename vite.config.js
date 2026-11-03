import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Precache the complete production build, including fonts and hand illustrations.
function offlineBuild() {
  let outputDirectory;
  return {
    name: 'typing-tutor-offline',
    apply: 'build',
    configResolved(config) {
      outputDirectory = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      async function collect(directory, prefix = '') {
        const files = [];
        for (const entry of await readdir(directory, { withFileTypes: true })) {
          const relative = `${prefix}${entry.name}`;
          if (entry.isDirectory()) files.push(...await collect(path.join(directory, entry.name), `${relative}/`));
          else if (entry.name !== 'sw.js') files.push(relative);
        }
        return files;
      }
      const files = (await collect(outputDirectory)).sort();
      const hash = createHash('sha256');
      for (const file of files) {
        hash.update(file);
        hash.update(await readFile(path.join(outputDirectory, file)));
      }
      const template = await readFile(new URL('./scripts/offline-worker.js', import.meta.url), 'utf8');
      hash.update(template);
      const version = hash.digest('hex').slice(0, 16);
      await writeFile(path.join(outputDirectory, 'sw.js'), template
        .replace('__CACHE_VERSION__', version)
        .replace('__PRECACHE_FILES__', JSON.stringify(['./', ...files.map(file => `./${file}`)])));
    },
  };
}

export default defineConfig({
  plugins: [react(), offlineBuild()],
  base: './', // Essential for Electron production builds
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      ignored: ['**/release/**', '**/.playwright-mcp/**', '**/dist/**'],
    },
  },
});
