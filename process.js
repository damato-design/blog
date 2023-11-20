const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const animals = path.resolve(__dirname, 'public', 'animals');
const ogimage = path.join(__dirname, 'src', 'components', 'OgImage', 'animals');

fs.readdir(animals, async function(err, data) {
  data.forEach((file) => {
    fs.readFile(path.join(animals, file), function (err, img) {
      const { name, ext } = path.parse(file);
      if (ext !== '.png') return;
      sharp(img).greyscale().resize(400, 400).webp().toFile(path.join(animals, `${name}.webp`));
      sharp(img).greyscale().resize(400, 400).png({ quality: 30 }).toFile(path.join(ogimage, `${name}.png`));
    });
  })
});