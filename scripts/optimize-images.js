#!/usr/bin/env node

/**
 * Image Optimization Script
 *
 * This script optimizes images for web use:
 * - Converts to WebP format
 * - Generates multiple sizes for responsive images
 * - Creates thumbnails
 * - Compresses for optimal file size
 *
 * Usage:
 *   node scripts/optimize-images.js <input-file> [output-dir]
 *
 * Example:
 *   node scripts/optimize-images.js public/images/projects/portfolio-website.png
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

// Configuration
const CONFIG = {
  quality: 85,
  thumbnailSize: { width: 400, height: 300 },
  sizes: [
    { name: 'full', width: 1920 },
    { name: 'md', width: 1280 },
    { name: 'sm', width: 640 },
  ]
};

async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function optimizeImage(inputPath, outputDir) {
  console.log(`\n🖼️  Optimizing: ${inputPath}`);

  // Get input file info
  const inputName = path.basename(inputPath, path.extname(inputPath));
  const metadata = await sharp(inputPath).metadata();

  console.log(`   Original: ${metadata.width}x${metadata.height}, ${metadata.format}, ${(metadata.size / 1024).toFixed(2)}KB`);

  // Determine output directory
  const finalOutputDir = outputDir || path.dirname(inputPath);
  await ensureDir(finalOutputDir);

  const results = [];

  // Generate full-size WebP
  const fullOutput = path.join(finalOutputDir, `${inputName}.webp`);
  await sharp(inputPath)
    .resize(CONFIG.sizes[0].width, null, {
      withoutEnlargement: true,
      fit: 'inside'
    })
    .webp({ quality: CONFIG.quality })
    .toFile(fullOutput);

  const fullStats = await fs.stat(fullOutput);
  results.push({ name: 'full', path: fullOutput, size: fullStats.size });
  console.log(`   ✓ Full size: ${fullOutput} (${(fullStats.size / 1024).toFixed(2)}KB)`);

  // Generate responsive sizes
  for (const size of CONFIG.sizes.slice(1)) {
    const output = path.join(finalOutputDir, `${inputName}-${size.name}.webp`);
    await sharp(inputPath)
      .resize(size.width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: CONFIG.quality })
      .toFile(output);

    const stats = await fs.stat(output);
    results.push({ name: size.name, path: output, size: stats.size });
    console.log(`   ✓ ${size.name.toUpperCase()} size: ${output} (${(stats.size / 1024).toFixed(2)}KB)`);
  }

  // Generate thumbnail
  const thumbnailDir = path.join(path.dirname(finalOutputDir), 'thumbnails');
  await ensureDir(thumbnailDir);

  const thumbOutput = path.join(thumbnailDir, `${inputName}-thumb.webp`);
  await sharp(inputPath)
    .resize(CONFIG.thumbnailSize.width, CONFIG.thumbnailSize.height, {
      fit: 'cover',
      position: 'center'
    })
    .webp({ quality: 80 })
    .toFile(thumbOutput);

  const thumbStats = await fs.stat(thumbOutput);
  results.push({ name: 'thumbnail', path: thumbOutput, size: thumbStats.size });
  console.log(`   ✓ Thumbnail: ${thumbOutput} (${(thumbStats.size / 1024).toFixed(2)}KB)`);

  // Summary
  const totalSaved = metadata.size - results.reduce((sum, r) => sum + r.size, 0) / results.length;
  const percentSaved = ((totalSaved / metadata.size) * 100).toFixed(1);
  console.log(`\n   💾 Average savings: ${(totalSaved / 1024).toFixed(2)}KB (${percentSaved}%)`);

  return results;
}

async function batchOptimize(pattern) {
  const glob = require('glob');
  const files = glob.sync(pattern);

  console.log(`\n🔍 Found ${files.length} images to optimize\n`);

  for (const file of files) {
    try {
      await optimizeImage(file);
    } catch (error) {
      console.error(`   ❌ Error optimizing ${file}:`, error.message);
    }
  }

  console.log('\n✅ Batch optimization complete!\n');
}

// CLI Handler
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
📸 Image Optimization Tool

Usage:
  node scripts/optimize-images.js <input-file> [output-dir]
  node scripts/optimize-images.js --batch "<pattern>"

Examples:
  node scripts/optimize-images.js public/images/projects/my-image.png
  node scripts/optimize-images.js public/images/avatar.jpg public/images/avatars
  node scripts/optimize-images.js --batch "public/images/projects/*.png"

Options:
  --batch    Optimize multiple images matching a glob pattern
  --help     Show this help message
    `);
    process.exit(0);
  }

  if (args[0] === '--batch') {
    await batchOptimize(args[1]);
  } else {
    const inputPath = args[0];
    const outputDir = args[1];

    try {
      await optimizeImage(inputPath, outputDir);
      console.log('\n✅ Optimization complete!\n');
    } catch (error) {
      console.error('\n❌ Error:', error.message);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = { optimizeImage, batchOptimize };
