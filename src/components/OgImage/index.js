import { join } from 'path';
import { readFile } from 'node:fs/promises';
import satori from "satori";
import { html } from 'satori-html';
import heatColor from '../../heat.js';

async function base64Animal(animal = 'dragon') {
  const filename = join(process.cwd(), 'src', 'components', 'OgImage', 'animals', `${animal}.png`);
  const file = await readFile(filename, "base64");
  return `data:image/png;base64,${file}`;
}

async function base64Logo() {
  const filename = join(process.cwd(), 'src', 'components', 'OgImage', 'damato-logo.png');
  const file = await readFile(filename, "base64");
  return `data:image/png;base64,${file}`;
}

async function getOptions() {
  const filename = join(process.cwd(), 'src', 'components', 'OgImage', 'Garamond-Light.ttf');
  const file = await readFile(filename);
  return {
    width: 1200,
    height: 630,
    fonts: [{
      name: 'Garamond Nova',
      data: file,
      weight: 400,
      style: 'normal',
    }]
  }
}

const style = `
  .root {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1rem;
    position: relative;
    background: white;
  }

  .cover {
    color: white;
    padding: 2rem;
    font-size: 8rem;
    letter-spacing: -.05em;
    line-height: 1.05;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .byline {
    font-size: 2rem;
  }

  .logo {
    margin-top: auto;
  }

  .animal {
    position: absolute;
    width: 800px;
    height: 800px;
    top: 100px;
    right: -10%;
  }
`;

export default async function OgImage({ data }) {
  const {
    animal,
    heat,
    title,
  } = data;
  const options = await getOptions();
  const img = await base64Animal(animal);
  const logo = await base64Logo();
  const markup = `
  <style>${style}</style>
  <div class="root">
    <div class="cover" style="background-color: ${heatColor(heat)};">
      <span>${ title }</span>
    </div>
    <p class="byline">blog.damato.design</p>
    <img class="logo" src="${logo}" width="270" height="50"/>
    <img class="animal" src="${img}" width="300" height="300"/>
  </div>
`;
  return satori(html(markup), options);
}