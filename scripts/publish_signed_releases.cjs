'use strict';
// Publishes only releases whose ZIP matches an Ed25519-signed manifest.
// No private signing key, athlete data or payment records belong in this repository.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const PUBLISHER_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAHO7X6g2UoLjOfu6Xe1vFgY1PfnnyMNQUpNPTzuD1oKw=
-----END PUBLIC KEY-----`;
const repo = process.env.GH_REPO || process.env.GITHUB_REPOSITORY || 'ceyilmazz98-sketch/kulup-yonetimi-guncellemeleri';
if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)) throw Error('Invalid repository identity');
const directory = path.join(process.cwd(), 'publish');
if (!fs.existsSync(directory)) { console.log('No publish folder yet; nothing to release.'); process.exit(0); }

const folders = fs.readdirSync(directory, { withFileTypes: true }).filter(x => x.isDirectory() && /^v\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(x.name)).map(x => x.name).sort();
for (const tag of folders) {
  const folder = path.join(directory, tag);
  const manifestPath = path.join(folder, 'latest.json');
  const filename = 'KulupYonetimi_' + tag.slice(1).replace(/\./g, '_') + '_Kurulum.zip';
  const zipPath = path.join(folder, filename);
  if (!fs.existsSync(manifestPath) || !fs.existsSync(zipPath)) {
    console.log(tag + ': incomplete candidate (waiting for both files)');
    continue;
  }
  const m = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!m || m.product !== 'kulup-yonetimi' || m.version !== tag.slice(1)) throw Error(tag + ': product/version mismatch');
  if (typeof m.notes !== 'string' || m.notes.length > 2000) throw Error(tag + ': invalid release notes');
  if (!/^[0-9a-f]{64}$/.test(m.sha256) || !Number.isSafeInteger(m.bytes) || m.bytes < 1024 || m.bytes > 250*1024*1024) throw Error(tag + ': invalid ZIP metadata');
  const expectedUrl = 'https://github.com/' + repo + '/releases/download/' + tag + '/' + filename;
  if (m.url !== expectedUrl) throw Error(tag + ': incorrect download URL');
  if (typeof m.signature !== 'string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(m.signature)) throw Error(tag + ': invalid signature encoding');
  const signed = { product:m.product, version:m.version, url:m.url, sha256:m.sha256, bytes:m.bytes, notes:m.notes };
  const signature = Buffer.from(m.signature, 'base64');
  if (signature.length !== 64 || !crypto.verify(null, Buffer.from(JSON.stringify(signed)), PUBLISHER_PUBLIC_KEY, signature)) throw Error(tag + ': Ed25519 signature invalid');
  const stat = fs.statSync(zipPath);
  if (stat.size !== m.bytes) throw Error(tag + ': ZIP length mismatch');
  const actualHash = crypto.createHash('sha256').update(fs.readFileSync(zipPath)).digest('hex');
  if (actualHash !== m.sha256) throw Error(tag + ': ZIP SHA-256 mismatch');
  console.log(tag + ': signature and ZIP checksum verified');
  if (process.env.DRY_RUN === '1') continue;
  if (!process.env.GH_TOKEN) throw Error('GH_TOKEN missing; cannot publish');
  const exists = spawnSync('gh', ['release', 'view', tag, '--repo', repo], {encoding:'utf8', stdio:'pipe'});
  if (exists.status === 0) { console.log(tag + ': already published; skipped'); continue; }
  const args = ['release','create',tag,manifestPath,zipPath,'--repo',repo,'--title','Kulüp Yönetimi '+tag,'--notes',m.notes,'--latest'];
  const published = spawnSync('gh', args, {encoding:'utf8', stdio:'inherit'});
  if (published.status !== 0) throw Error(tag + ': GitHub Release creation failed');
  console.log(tag + ': release published successfully');
}
if (!folders.length) console.log('No version candidates yet.');
