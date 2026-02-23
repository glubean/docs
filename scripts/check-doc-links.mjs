import fs from 'node:fs';
import path from 'node:path';

const CONTENT_DIR = path.resolve('content');

function walk(dir, predicate, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, predicate, out);
    } else if (predicate(full)) {
      out.push(full);
    }
  }
  return out;
}

function routeFromFile(filePath) {
  const rel = path.relative(CONTENT_DIR, filePath).replace(/\\/g, '/');
  const noExt = rel.replace(/\.mdx$/, '');
  const route = `/${noExt}`.replace(/\/index$/, '');
  return route === '' ? '/' : route;
}

function normalizeRoute(route) {
  if (!route) return route;
  const noHashOrQuery = route.split('#')[0].split('?')[0];
  if (!noHashOrQuery) return noHashOrQuery;
  return noHashOrQuery.length > 1 && noHashOrQuery.endsWith('/')
    ? noHashOrQuery.slice(0, -1)
    : noHashOrQuery;
}

function collectRoutes(mdxFiles) {
  const routes = new Set(['/']);
  for (const file of mdxFiles) {
    routes.add(routeFromFile(file));
  }
  return routes;
}

function extractMarkdownLinks(content) {
  const links = [];
  const regex = /\[[^\]]+\]\(([^)]+)\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    links.push(match[1].trim());
  }
  return links;
}

function isExternalLink(href) {
  return (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#')
  );
}

function resolveRelative(baseRoute, href) {
  return new URL(href, `https://docs.local${baseRoute}/`).pathname;
}

const mdxFiles = walk(CONTENT_DIR, (f) => f.endsWith('.mdx'));
const routes = collectRoutes(mdxFiles);
const findings = [];

for (const file of mdxFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const baseRoute = routeFromFile(file);
  const links = extractMarkdownLinks(source);

  for (const href of links) {
    if (!href || isExternalLink(href)) continue;

    if (href.startsWith('./') || href.startsWith('../')) {
      findings.push({
        type: 'relative-link',
        file,
        baseRoute,
        href,
        message: 'Use absolute internal paths (e.g. /guides/debugging).',
      });
      continue;
    }

    const target = href.startsWith('/')
      ? normalizeRoute(href)
      : normalizeRoute(resolveRelative(baseRoute, href));

    if (!target || !routes.has(target)) {
      findings.push({
        type: 'missing-route',
        file,
        baseRoute,
        href,
        target,
        message: 'Internal link does not map to an existing docs route.',
      });
    }
  }
}

if (findings.length > 0) {
  console.error(`Found ${findings.length} docs link issue(s):`);
  for (const issue of findings) {
    const relFile = path.relative(process.cwd(), issue.file);
    if (issue.type === 'missing-route') {
      console.error(`- [missing-route] ${relFile} (base: ${issue.baseRoute}) ${issue.href} -> ${issue.target}`);
    } else {
      console.error(`- [relative-link] ${relFile} (base: ${issue.baseRoute}) ${issue.href}`);
    }
    console.error(`  ${issue.message}`);
  }
  process.exit(1);
}

console.log(`OK: validated ${mdxFiles.length} MDX files and ${routes.size} routes. No broken internal links.`);
