#!/usr/bin/env node
/**
 * Crawls the built SPA (dist/) with a headless browser and writes each
 * route's rendered HTML to its own dist-static/<route>/index.html, so the
 * site can be hosted on a plain static/IIS server with no URL-rewrite
 * config: every request maps to a real file via IIS's default-document
 * behavior.
 *
 * Routes are discovered from src/content/manifest.json (every artwork /
 * writing tree node is its own route) plus the static top-level routes
 * defined in src/App.jsx.
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIST_DIR = path.join(ROOT, 'dist');
const OUT_DIR = path.join(ROOT, 'dist-static');
const PORT = 4321;
const BASE_URL = `http://localhost:${PORT}`;

const STATIC_ROUTES = [
  '/',
  '/artworks',
  '/writings',
  '/about',
  '/about/bio',
  '/about/cv',
  '/about/contact',
];

function collectRoutes(nodes, base, prefix, out) {
  for (const node of nodes) {
    const segments = [...prefix, node.id];
    out.push(`${base}/${segments.join('/')}`);
    if (node.children?.length) collectRoutes(node.children, base, segments, out);
  }
}

function discoverRoutes() {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'src/content/manifest.json'), 'utf8')
  );
  const routes = [...STATIC_ROUTES];
  collectRoutes(manifest.artworks.projects, '/artworks', [], routes);
  collectRoutes(manifest.writings.items, '/writings', [], routes);
  return routes;
}

function waitForServer(url, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  return new Promise((resolve, reject) => {
    const attempt = () => {
      fetch(url)
        .then(() => resolve())
        .catch((err) => {
          if (Date.now() > deadline) return reject(err);
          setTimeout(attempt, 250);
        });
    };
    attempt();
  });
}

function outputPathFor(route) {
  const dir = route === '/' ? OUT_DIR : path.join(OUT_DIR, route);
  return path.join(dir, 'index.html');
}

async function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('dist/ not found — run `npm run build` first.');
    process.exit(1);
  }

  const routes = discoverRoutes();
  console.log(`Discovered ${routes.length} routes.`);

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.cpSync(DIST_DIR, OUT_DIR, { recursive: true });

  const server = spawn(
    'npx',
    ['vite', 'preview', '--port', String(PORT), '--strictPort'],
    { cwd: ROOT, stdio: 'pipe' }
  );
  server.on('error', (err) => {
    console.error('Failed to start preview server:', err);
    process.exit(1);
  });

  try {
    await waitForServer(BASE_URL);

    const browser = await chromium.launch();
    const page = await browser.newPage();
    const failed = [];

    for (const route of [...routes, '/__404__']) {
      try {
        await page.goto(`${BASE_URL}${route}`, { waitUntil: 'load', timeout: 45000 });
        const html = await page.content();
        const outFile = route === '/__404__' ? path.join(OUT_DIR, '404.html') : outputPathFor(route);
        fs.mkdirSync(path.dirname(outFile), { recursive: true });
        fs.writeFileSync(outFile, html);
        console.log(`wrote ${path.relative(ROOT, outFile)}`);
      } catch (err) {
        console.warn(`FAILED ${route}: ${err.message}`);
        failed.push(route);
      }
    }

    await browser.close();

    if (failed.length) {
      console.warn(`\n${failed.length} route(s) failed to crawl:\n${failed.map((r) => `  - ${r}`).join('\n')}`);
      process.exitCode = 1;
    }
  } finally {
    server.kill();
  }

  console.log(`\nStatic site generated at ${path.relative(ROOT, OUT_DIR)}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
