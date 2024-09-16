const path = require('path');
const fs = require('fs');
const fm = require('frontmatter');

const animals = path.resolve(__dirname, 'public', 'animals');
const posts = path.resolve(__dirname, 'src', 'content', 'posts');

function readFile(filePath) {
    return fs.promises.readFile(path.resolve(posts, filePath), 'utf8');
}

async function main() {
    const animalFilePaths = await fs.promises.readdir(animals);
    const postFilePaths = await fs.promises.readdir(posts);
    const postData = await Promise.all(postFilePaths.map(readFile));
    const allAnimals = animalFilePaths.reduce((acc, filePath) => {
        const { name, ext } = path.parse(filePath);
        return ext === '.png' ? acc : [...acc, name];
    }, []);
    const usedAnimals = postData
        .map(fm)
        .map(({ data }) => data.animal)
        .filter(Boolean);
    const unusedAnimals = allAnimals.filter((animal) => !usedAnimals.includes(animal));
    console.log(unusedAnimals, unusedAnimals.length);
}

main();