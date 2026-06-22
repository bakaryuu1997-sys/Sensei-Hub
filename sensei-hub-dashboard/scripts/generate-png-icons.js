const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgPath = path.resolve(__dirname, '../public/icon.svg');
if (!fs.existsSync(svgPath)) {
  console.error(`Error: SVG file not found at ${svgPath}`);
  process.exit(1);
}

const svgBuffer = fs.readFileSync(svgPath);

const targets = [
  { name: 'icon-light-32x32.png', size: 32 },
  { name: 'icon-dark-32x32.png', size: 32 },
  { name: 'apple-icon.png', size: 180 }
];

async function generate() {
  for (const target of targets) {
    const outputPath = path.resolve(__dirname, '../public', target.name);
    await sharp(svgBuffer)
      .resize(target.size, target.size)
      .png()
      .toFile(outputPath);
    console.log(`Generated ${target.name} (${target.size}x${target.size})`);
  }
}

generate()
  .then(() => {
    console.log('PNG Icons generation completed successfully!');
  })
  .catch(err => {
    console.error('Error generating PNG icons:', err);
    process.exit(1);
  });
