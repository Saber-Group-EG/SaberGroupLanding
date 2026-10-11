// One-time batch production of the phone-first story renditions.
//
// The homepage stories used to play the ORIGINAL uploads from
// upload.ats.sabergroup-eg.com (28–61 MB each), which is why they stalled on
// a phone connection. The app now asks for `<basename>-story.mp4` next to
// each original (see storyRenditionUrl in src/components/home/useProjectStories.js)
// and falls back to the original until those files exist. This script
// produces them with ffmpeg; uploading the output folder to the same CDN
// folder is a manual step — nothing here touches the network except reads.
//
// Usage (Node >= 18, no dependencies, Windows-friendly):
//   node scripts/transcode-stories.mjs                     # everything
//   node scripts/transcode-stories.mjs --limit 2           # trial run
//   node scripts/transcode-stories.mjs --download-only     # fetch sources only (kept in story-renditions/sources/)
//   node scripts/transcode-stories.mjs --remux             # lossless faststart remux (kept in story-renditions/faststart/)
//   node scripts/transcode-stories.mjs --files a.mp4,https://…/b.mp4
//
// ffmpeg must be on PATH: `winget install Gyan.FFmpeg` then re-open the shell.

import { spawn, spawnSync } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { mkdir, open, rm, stat } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import os from 'node:os';
import path from 'node:path';

const PROJECTS_API = 'https://marketing-planner-tau.vercel.app/api/v1/projects/public?PageCount=all';
const VIDEO_EXT_RE = /\.(mp4|mov|webm|m4v)$/i;
const OUTPUT_HEIGHT = 720;

const args = process.argv.slice(2);

const readFlag = (name) => {
  const at = args.indexOf(name);
  return at === -1 ? null : args[at + 1] || '';
};

const limit = Number.parseInt(readFlag('--limit') ?? '', 10);
const downloadOnly = args.includes('--download-only');
const remux = args.includes('--remux');
const filesArg = readFlag('--files');

if (args.includes('--help') || args.includes('-h')) {
  console.log([
    'Usage: node scripts/transcode-stories.mjs [options]',
    '',
    '  --limit <n>              process at most n videos (trial runs)',
    '  --download-only          download the sources, skip the transcode',
    '  --remux                  lossless faststart remux (-c copy, no re-encode) instead of the 720p transcode',
    '  --files <a.mp4,url,b>    transcode this list (paths or URLs) instead of the API',
    '  --help                   show this message',
  ].join('\n'));
  process.exit(0);
}

if (remux && downloadOnly) {
  console.error('--remux repacks existing videos and cannot be combined with --download-only.');
  process.exit(1);
}

// ffmpeg prints its whole banner on stderr; only the tail matters when it
// fails, so keep a rolling window instead of the full log.
const tailLines = (text, cap = 12) => text.split(/\r?\n/).filter(Boolean).slice(-cap).join('\n');

const spawnFfmpeg = (ffmpegArgs) =>
  new Promise((resolve) => {
    const child = spawn(
      'ffmpeg',
      ffmpegArgs,
      // A detached console window per file is what windowsHide avoids; shell
      // stays off so no argument quoting can be reinterpreted.
      { windowsHide: true, shell: false, stdio: ['ignore', 'ignore', 'pipe'] },
    );

    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr = (stderr + chunk.toString()).slice(-8192);
    });
    child.on('error', (err) => resolve({ ok: false, detail: err.message }));
    child.on('close', (code) => {
      if (code === 0) resolve({ ok: true, detail: '' });
      else resolve({ ok: false, detail: tailLines(stderr) });
    });
  });

const runFfmpeg = (inputPath, outputPath) =>
  spawnFfmpeg([
    '-y',
    '-i', inputPath,
    // 720p phone-first: scale=-2 keeps the aspect ratio and forces even
    // dimensions (required by libx264); orientation comes from the scale.
    '-vf', `scale=-2:${OUTPUT_HEIGHT}`,
    '-c:v', 'libx264', '-crf', '27', '-preset', 'veryfast',
    '-profile:v', 'main', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '128k', '-ac', '2', '-ar', '44100',
    '-movflags', '+faststart',
    outputPath,
  ]);

// Lossless repack: same packets, same quality, same size — ffmpeg only
// rewrites the container so moov precedes mdat and playback can start
// while the rest of the file still downloads.
const runRemux = (inputPath, outputPath) =>
  spawnFfmpeg(['-y', '-i', inputPath, '-c', 'copy', '-movflags', '+faststart', outputPath]);

// With +faststart the moov atom must sit at the front of the file; reading
// the first 64 KB (not the whole 30+ MB) is enough to prove the rewrite.
const hasFaststartMoov = async (filePath) => {
  const handle = await open(filePath, 'r');
  try {
    const buffer = Buffer.alloc(65536);
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
    return buffer.subarray(0, bytesRead).includes('moov');
  } finally {
    await handle.close();
  }
};

const ensureFfmpeg = () => {
  const probe = spawnSync('ffmpeg', ['-version'], { windowsHide: true, shell: false, stdio: 'ignore' });
  if (probe.error || probe.status !== 0) {
    console.error([
      'ffmpeg was not found on PATH, so no renditions can be produced.',
      '',
      'Install it first, then re-run this script:',
      '  winget install Gyan.FFmpeg',
      '  (close and re-open your terminal so PATH picks it up)',
      '  node scripts/transcode-stories.mjs',
    ].join('\n'));
    process.exit(1);
  }
};

const walkUrls = (node, out) => {
  if (Array.isArray(node)) {
    node.forEach((item) => walkUrls(item, out));
    return;
  }
  if (!node || typeof node !== 'object') return;
  for (const [key, value] of Object.entries(node)) {
    if (key === 'url' && typeof value === 'string') out.push(value);
    else if (value && typeof value === 'object') walkUrls(value, out);
  }
};

// material[] mixes shapes ({ type:'video', url }, { type:'bulk', items:[…] },
// before/after pairs), so walk every `url` key and let the extension filter
// drop the photos — one rule instead of one branch per shape.
const collectApiSources = async () => {
  const res = await fetch(PROJECTS_API, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const projects = Array.isArray(data?.projects) ? data.projects : [];
  const urls = [];
  for (const project of projects) walkUrls(project.material, urls);
  return [...new Set(urls)].filter((url) => VIDEO_EXT_RE.test(url) && !/-story\.mp4$/i.test(url));
};

const toLocalSource = (entry) => {
  const name = path.basename(new URL(entry.url).pathname);
  // Two originals can share a basename across folders; the CDN lookup key is
  // the basename alone, so the second one would silently overwrite the first.
  if (outputs.has(name)) {
    console.warn(`[skip] ${entry.url}\n       output name already taken by ${outputs.get(name)}`);
    return null;
  }
  outputs.set(name, entry.url);
  return { ...entry, name };
};

const download = async (url, destPath) => {
  const res = await fetch(url, { signal: AbortSignal.timeout(600000) });
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(destPath));
};

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);

const fileSize = async (filePath) => {
  try {
    return (await stat(filePath)).size;
  } catch {
    return 0;
  }
};

const root = process.cwd();
const OUTPUT_DIR = path.join(root, 'story-renditions');
const TEMP_DIR = path.join(os.tmpdir(), `saber-story-renditions-${process.pid}`);
const outputs = new Map();

const main = async () => {
  // Downloading needs no encoder; only the transcode half requires ffmpeg.
  if (!downloadOnly) ensureFfmpeg();

  let sources;
  if (filesArg) {
    sources = filesArg
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => (/^https?:\/\//i.test(item) ? { url: item } : { localPath: path.resolve(item) }));
  } else {
    console.log(`Fetching project list from ${PROJECTS_API} …`);
    const urls = await collectApiSources();
    console.log(`Found ${urls.length} unique project video(s).`);
    sources = urls.map((url) => ({ url }));
  }

  const planned = [];
  for (const source of sources) {
    const entry = source.url ? toLocalSource(source) : { ...source, name: path.basename(source.localPath) };
    if (!entry) continue;
    // Remux keeps the exact original filename so uploading it back is a
    // same-name replacement in the CDN folder.
    const outputPath = remux
      ? path.join(OUTPUT_DIR, 'faststart', entry.name)
      : path.join(OUTPUT_DIR, `${path.parse(entry.name).name}-story.mp4`);
    const item = { ...entry, outputPath };
    // Re-runs must be cheap: an already produced rendition is skipped, which
    // is also what makes an interrupted batch resumable.
    if (!downloadOnly && (await fileSize(outputPath)) > 0) {
      console.log(`[skip] ${entry.name} — ${remux ? 'faststart output' : 'rendition'} already exists`);
      continue;
    }
    planned.push(item);
    if (Number.isInteger(limit) && limit > 0 && planned.length >= limit) break;
  }

  if (planned.length === 0) {
    console.log('Nothing to do.');
    return;
  }

  // Sources are disposable scratch space during a real run, but a
  // --download-only run exists precisely so the originals can be previewed
  // locally — those land in the kept output folder instead.
  const sourceDir = downloadOnly ? path.join(OUTPUT_DIR, 'sources') : TEMP_DIR;
  await mkdir(sourceDir, { recursive: true });
  if (remux) await mkdir(path.join(OUTPUT_DIR, 'faststart'), { recursive: true });

  const rows = [];
  let failed = 0;

  for (const [index, item] of planned.entries()) {
    const position = `[${index + 1}/${planned.length}]`;
    try {
      let inputPath = item.localPath || null;
      if (!inputPath) {
        console.log(`${position} ${item.name} — downloading …`);
        inputPath = path.join(sourceDir, item.name);
        await download(item.url, inputPath);
      }
      const originalBytes = await fileSize(inputPath);
      console.log(`${position} ${item.name} — ${mb(originalBytes)} MB (source)`);

      if (downloadOnly) {
        rows.push({ name: item.name, original: originalBytes, rendition: 0 });
        continue;
      }

      if (remux) {
        console.log(`${position} ${item.name} — remuxing losslessly (-c copy) …`);
        const result = await runRemux(inputPath, item.outputPath);
        if (!result.ok) throw new Error(`ffmpeg failed:\n${result.detail}`);
        if (!(await hasFaststartMoov(item.outputPath))) {
          throw new Error('moov not found in first 64 KB — not faststart');
        }
        const faststartBytes = await fileSize(item.outputPath);
        console.log(`${position} ${item.name} — done: ${mb(faststartBytes)} MB (moov moved to front)\n`);
        rows.push({ name: item.name, original: originalBytes, faststart: faststartBytes });
        continue;
      }

      console.log(`${position} ${item.name} — transcoding to ${OUTPUT_HEIGHT}p …`);
      const result = await runFfmpeg(inputPath, item.outputPath);
      if (!result.ok) throw new Error(`ffmpeg failed:\n${result.detail}`);

      const renditionBytes = await fileSize(item.outputPath);
      const saved = originalBytes > 0 ? Math.round((1 - renditionBytes / originalBytes) * 100) : 0;
      console.log(`${position} ${item.name} — done: ${mb(renditionBytes)} MB (${saved}% smaller)\n`);
      rows.push({ name: item.name, original: originalBytes, rendition: renditionBytes });
    } catch (err) {
      failed += 1;
      if (remux) {
        // A partial or non-faststart output would be skipped as "done" on the
        // next run, so drop it and let a re-run retry this file.
        await rm(item.outputPath, { force: true }).catch(() => {});
      }
      console.error(`${position} ${item.name} — FAILED: ${err.message}\n`);
    }
  }

  const mode = downloadOnly ? 'download' : remux ? 'remux' : 'transcode';
  printSummary(rows, mode);

  if (downloadOnly) {
    // --files with local paths downloads nothing, so the note would lie.
    if (planned.some((item) => item.url)) {
      console.log(
        `\nDownloaded sources kept in ${sourceDir} — re-run without --download-only to transcode them.`,
      );
    }
  } else if (remux) {
    console.log([
      '',
      'Upload step (manual, no script touches the CDN):',
      '  Upload every file in `story-renditions/faststart/` to the SAME CDN folder as',
      '  its original, REPLACING the original with the exact same filename. The repack',
      '  is lossless (`-c copy`, no re-encode): same streams, same quality, same size —',
      '  only the moov atom moved to the front, so a story streams instantly even',
      '  before its `-story.mp4` rendition exists.',
    ].join('\n'));
  } else {
    console.log([
      '',
      'Upload step (manual, no script touches the CDN):',
      '  Upload every `*-story.mp4` into the SAME CDN folder as its original',
      '  (`Markting/projects/` on upload.ats.sabergroup-eg.com), keeping the exact',
      '  filename. The site picks them up automatically within a minute — no code',
      '  change needed, and until a file lands that story simply keeps playing its',
      '  original.',
    ].join('\n'));
  }

  process.exitCode = failed > 0 ? 1 : 0;
};

const printSummary = (rows, mode) => {
  if (rows.length === 0) return;
  const nameW = Math.max(6, ...rows.map((r) => r.name.length));
  const source = 'SOURCE'.padEnd(nameW) + '  ';
  const head = mode === 'download'
    ? source + 'SIZE (MB)'.padStart(10)
    : mode === 'remux'
      ? source + 'ORIGINAL (MB)'.padStart(13) + '  ' + 'FASTSTART (MB)'.padStart(14)
      : source + 'ORIGINAL (MB)'.padStart(13) + '  ' + 'STORY (MB)'.padStart(11) + '  ' + 'SAVED'.padStart(6);

  console.log(`\n${'─'.repeat(head.length)}`);
  console.log(head);
  console.log('─'.repeat(head.length));
  for (const row of rows) {
    if (mode === 'download') {
      console.log(row.name.padEnd(nameW) + '  ' + mb(row.original).padStart(10));
      continue;
    }
    if (mode === 'remux') {
      console.log(row.name.padEnd(nameW) + '  ' + mb(row.original).padStart(13) + '  ' + mb(row.faststart).padStart(14));
      continue;
    }
    const saved = row.original > 0 ? `${Math.round((1 - row.rendition / row.original) * 100)}%` : 'n/a';
    console.log(
      row.name.padEnd(nameW)
        + '  ' + mb(row.original).padStart(13)
        + '  ' + mb(row.rendition).padStart(11)
        + '  ' + saved.padStart(6),
    );
  }
  console.log('─'.repeat(head.length));
  const originalTotal = rows.reduce((sum, r) => sum + r.original, 0);
  if (mode === 'download') {
    console.log('TOTAL'.padEnd(nameW) + '  ' + mb(originalTotal).padStart(10));
    return;
  }
  if (mode === 'remux') {
    const faststartTotal = rows.reduce((sum, r) => sum + r.faststart, 0);
    console.log('TOTAL'.padEnd(nameW) + '  ' + mb(originalTotal).padStart(13) + '  ' + mb(faststartTotal).padStart(14));
    console.log(`(${rows.length} file(s)); outputs kept in ${path.join(OUTPUT_DIR, 'faststart')}`);
    console.log('Sizes are expected to match — the win is moov at the front (instant streaming), not a smaller file.');
    return;
  }
  const renditionTotal = rows.reduce((sum, r) => sum + r.rendition, 0);
  const saved = originalTotal > 0 ? `${Math.round((1 - renditionTotal / originalTotal) * 100)}%` : 'n/a';
  console.log(
    'TOTAL'.padEnd(nameW)
      + '  ' + mb(originalTotal).padStart(13)
      + '  ' + mb(renditionTotal).padStart(11)
      + '  ' + saved.padStart(6),
  );
  console.log(`(${rows.length} file(s); outputs kept in ${OUTPUT_DIR})`);
};

try {
  await main();
} finally {
  // Sources are re-downloadable; only the renditions are worth keeping.
  await rm(TEMP_DIR, { recursive: true, force: true }).catch(() => {});
}
