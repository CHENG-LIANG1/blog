import fs from "fs/promises"
import path from "path"
import sharp from "sharp"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const contentDir = path.resolve(__dirname, "../content")
const maxWidth = 1600
const quality = 80
const sizeThreshold = 500 * 1024 // 500 KB

async function* findImages(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* findImages(fullPath)
    } else if (entry.isFile() && /\.(jpg|jpeg|png)$/i.test(entry.name)) {
      yield fullPath
    }
  }
}

async function optimize() {
  const targets = []
  for await (const filePath of findImages(contentDir)) {
    const stat = await fs.stat(filePath)
    if (stat.size > sizeThreshold) {
      targets.push({ path: filePath, size: stat.size })
    }
  }

  if (targets.length === 0) {
    console.log("No images over 500KB found.")
    return
  }

  console.log(`Found ${targets.length} image(s) over 500KB:`)
  for (const t of targets) {
    console.log(`  ${path.relative(contentDir, t.path)} (${(t.size / 1024 / 1024).toFixed(2)} MB)`)
  }

  let totalSaved = 0
  for (const { path: filePath, size: originalSize } of targets) {
    const ext = path.extname(filePath).toLowerCase()
    const tmpPath = `${filePath}.tmp`

    let pipeline = sharp(filePath)
      .rotate() // auto-rotate based on EXIF Orientation
      .resize(maxWidth, maxWidth, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })

    if (ext === ".jpg" || ext === ".jpeg") {
      pipeline = pipeline.jpeg({ quality, progressive: true, mozjpeg: true })
    } else if (ext === ".png") {
      pipeline = pipeline.png({ compressionLevel: 9, quality })
    }

    await pipeline.toFile(tmpPath)
    const newSize = (await fs.stat(tmpPath)).size

    if (newSize < originalSize) {
      await fs.rename(tmpPath, filePath)
      const saved = originalSize - newSize
      totalSaved += saved
      console.log(
        `✓ ${path.relative(contentDir, filePath)}: ${(originalSize / 1024 / 1024).toFixed(2)} MB → ${(newSize / 1024 / 1024).toFixed(2)} MB (saved ${(saved / 1024 / 1024).toFixed(2)} MB)`,
      )
    } else {
      await fs.unlink(tmpPath)
      console.log(`⊘ ${path.relative(contentDir, filePath)}: no size reduction, skipped`)
    }
  }

  console.log(`\nTotal saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`)
}

optimize().catch((err) => {
  console.error(err)
  process.exit(1)
})
