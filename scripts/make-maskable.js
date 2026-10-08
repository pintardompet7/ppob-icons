const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = 'source';
const OUT = 'icons/maskable';
const SIZES = [192, 512];
const PADDING = 0.20;

fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const files = fs.readdirSync(SRC).filter(f => /\.(png|jpe?g)$/i.test(f));

  for (const file of files) {
    const name = path.parse(file).name;
    const input = path.join(SRC, file);

    for (const size of SIZES) {
      const inner = Math.round(size * (1 - PADDING * 2));
      const offset = Math.round((size - inner) / 2);

      await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
      })
      .composite([{
        input: await sharp(input).resize(inner, inner, { fit: 'contain' }).toBuffer(),
        top: offset,
        left: offset
      }])
      .png()
      .toFile(path.join(OUT, `${name}-${size}-maskable.png`));

      console.log(`✅ ${name}-${size}-maskable.png`);
    }
  }
})();
