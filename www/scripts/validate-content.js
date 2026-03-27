import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const root = path.resolve(import.meta.dirname, '..');
const contentDir = path.join(root, 'content');
const publicDir = path.join(root, 'public');
const errors = [];

const mdFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
for (const file of mdFiles) {
  const content = fs.readFileSync(path.join(contentDir, file), 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    errors.push(`${file}: missing frontmatter`);
    continue;
  }
  const frontmatter = match[1];
  if (!/^date:\s*.+/m.test(frontmatter)) {
    errors.push(`${file}: missing required 'date' field`);
  }
}

const configPath = path.join(publicDir, 'config.yaml');
const config = fs.existsSync(configPath)
  ? yaml.load(fs.readFileSync(configPath, 'utf8'))
  : {};
const configDates = config.dates || {};
const txtFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.txt'));
for (const file of txtFiles) {
  if (!configDates[file]) {
    errors.push(`${file}: missing date in config.yaml`);
  }
}

if (errors.length) {
  console.error('Content validation failed:\n');
  for (const err of errors) console.error(`  - ${err}`);
  console.error('');
  process.exit(1);
} else {
  console.log(`Validated ${mdFiles.length} posts and ${txtFiles.length} txt files.`);
}
