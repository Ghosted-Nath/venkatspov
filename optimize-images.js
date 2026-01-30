// optimize-images.js
// Run: node optimize-images.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = './public/works';
const OUTPUT_DIR = './public/works';
const QUALITY = 85;

async function optimizeImages() {
  try {
    // Read all files in directory
    const files = fs.readdirSync(INPUT_DIR);
    
    console.log('🚀 Starting image optimization...\n');

    for (const file of files) {
      // Only process jpg, jpeg, png files
      if (!/\.(jpg|jpeg|png)$/i.test(file)) {
        continue;
      }

      const inputPath = path.join(INPUT_DIR, file);
      const outputFilename = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      const outputPath = path.join(OUTPUT_DIR, outputFilename);

      // Get original file size
      const originalSize = fs.statSync(inputPath).size;

      // Convert to WebP
      await sharp(inputPath)
        .webp({ quality: QUALITY })
        .toFile(outputPath);

      // Get new file size
      const newSize = fs.statSync(outputPath).size;
      const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);

      console.log(`✅ ${file}`);
      console.log(`   Original: ${(originalSize / 1024).toFixed(0)}KB`);
      console.log(`   Optimized: ${(newSize / 1024).toFixed(0)}KB`);
      console.log(`   Reduction: ${reduction}%\n`);
    }

    console.log('🎉 Image optimization complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Update products.js to use .webp extensions');
    console.log('2. Test images load correctly');
    console.log('3. Delete old .jpg/.png files (after backup!)');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

optimizeImages();