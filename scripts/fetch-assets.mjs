#!/usr/bin/env node
/**
 * Downloads media/fonts required by the app into src/assets.
 * Those files are gitignored, so clones need this before `vite` can resolve imports.
 *
 * Usage:
 *   node scripts/fetch-assets.mjs
 *   node scripts/fetch-assets.mjs --force
 */

import { createWriteStream } from 'node:fs'
import { copyFile, mkdir, access } from 'node:fs/promises'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const assetsRoot = path.join(root, 'src', 'assets')
const force = process.argv.includes('--force')
const CDN = 'https://johnroussos.dev/assets'

/** Local relative path under src/assets → hashed production filename */
const REMOTE_FILES = [
  ['imgs/thumbnail.jpg', 'thumbnail-c488ab5f.jpg'],
  ['imgs/myself.jpg', 'myself-5f349d05.jpg'],
  ['imgs/banners/mosaica.jpg', 'mosaica-377a4c97.jpg'],
  ['imgs/banners/flowers.jpg', 'flowers-8485b803.jpg'],
  ['imgs/banners/learning.jpg', 'learning-2b980340.jpg'],
  ['imgs/banners/nlorenz.png', 'nlorenz-85b12e83.png'],
  ['imgs/projects/mosaica/mosaica (1).jpg', 'mosaica (1)-d5a41769.jpg'],
  ['imgs/projects/mosaica/mosaica (2).jpg', 'mosaica (2)-4d4b9162.jpg'],
  ['imgs/projects/mosaica/mosaica (3).jpg', 'mosaica (3)-bd4ec524.jpg'],
  ['imgs/projects/mosaica/mosaica (4).jpg', 'mosaica (4)-250bf825.jpg'],
  ['imgs/projects/mosaica/mosaica (5).jpg', 'mosaica (5)-956ba7cc.jpg'],
  ['imgs/projects/flowers/flowers (1).png', 'flowers (1)-d332c163.png'],
  ['imgs/projects/flowers/flowers (2).png', 'flowers (2)-9b673986.png'],
  ['imgs/projects/flowers/flowers (3).png', 'flowers (3)-5991c7ac.png'],
  ['imgs/projects/flowers/flowers (4).png', 'flowers (4)-a783183d.png'],
  ['imgs/projects/flowers/flowers (5).png', 'flowers (5)-0c7e289d.png'],
  ['imgs/projects/flowers/flowers (6).png', 'flowers (6)-7eef4d92.png'],
  ['imgs/projects/learning/learning (1).jpg', 'learning (1)-8fb7ef49.jpg'],
  ['imgs/projects/learning/learning (2).jpg', 'learning (2)-1e0bb356.jpg'],
  ['imgs/projects/learning/learning (3).mp4', 'learning (3)-aa67e55a.mp4'],
  ['imgs/projects/learning/learning (4).jpg', 'learning (4)-a92e0491.jpg'],
  ['imgs/projects/learning/learning (5).mp4', 'learning (5)-16c42097.mp4'],
  ['imgs/projects/lorenz/lorenz (Custom).png', 'lorenz (Custom)-239422e2.png'],
  ['imgs/projects/lorenz/lorenz (2).png', 'lorenz (2)-3d0a3d38.png'],
  ['imgs/projects/lorenz/lorenz (3).png', 'lorenz (3)-7900bd7d.png'],
  ['imgs/projects/lorenz/lorenz (4).png', 'lorenz (4)-bc185703.png'],
  ['imgs/projects/lorenz/lorenz (5).png', 'lorenz (5)-27d4ff3a.png'],
  ['imgs/projects/lorenz/lorenz (6).png', 'lorenz (6)-47f8f59b.png'],
  ['fonts/neue-montreal/NeueMontreal-Regular.otf', 'NeueMontreal-Regular-94bbc905.otf'],
]

const SENTINEL = path.join(assetsRoot, 'imgs', 'thumbnail.jpg')

async function exists(filePath) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

async function download(url, dest) {
  await mkdir(path.dirname(dest), { recursive: true })
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to download ${url} (${res.status})`)
  }
  await pipeline(res.body, createWriteStream(dest))
}

async function ensureLocalCopies() {
  const myself = path.join(assetsRoot, 'imgs', 'myself.jpg')
  // Unused about-background imports still need these paths to exist if loaded.
  const placeholders = [
    path.join(assetsRoot, 'imgs', 'profile.jpeg'),
    path.join(assetsRoot, 'imgs', 'profile-small-01.jpeg'),
  ]
  for (const dest of placeholders) {
    if (force || !(await exists(dest))) {
      await copyFile(myself, dest)
    }
  }

  const fontDest = path.join(assetsRoot, 'fonts', 'Italiana', 'Italiana_Regular.json')
  const fontSrc = path.join(__dirname, 'fixtures', 'Italiana_Regular.json')
  if (force || !(await exists(fontDest))) {
    await mkdir(path.dirname(fontDest), { recursive: true })
    await copyFile(fontSrc, fontDest)
  }
}

async function main() {
  if (!force && (await exists(SENTINEL))) {
    console.log('Assets already present (src/assets). Skipping download.')
    console.log('Re-run with --force to refresh.')
    return
  }

  console.log(force ? 'Refreshing assets from johnroussos.dev…' : 'Fetching missing assets from johnroussos.dev…')

  for (const [localRel, remoteName] of REMOTE_FILES) {
    const dest = path.join(assetsRoot, localRel)
    if (!force && (await exists(dest))) continue
    const remoteUrl = `${CDN}/${remoteName.split('/').map(encodeURIComponent).join('/')}`
    process.stdout.write(`  ${localRel}… `)
    await download(remoteUrl, dest)
    console.log('ok')
  }

  await ensureLocalCopies()
  console.log('Assets ready under src/assets.')
}

main().catch((err) => {
  console.error('\nCould not fetch assets.')
  console.error(err.message || err)
  console.error('\nMake sure you can reach https://johnroussos.dev, or copy your local src/assets folder into this project.')
  process.exit(1)
})
