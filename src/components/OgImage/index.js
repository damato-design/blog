import { join } from 'path';
import { readFileSync } from 'node:fs';
import satori from "satori";
import { html } from 'satori-html';
import heat from '../../heat.js';

async function getOptions() {
  const garamond = join(process.cwd(), 'src', 'components', 'OgImage', 'Garamond-Light.ttf');
  const outfit = join(process.cwd(), 'src', 'components', 'OgImage', 'Outfit-Medium.ttf');
  return {
    width: 1200,
    height: 630,
    fonts: [{
      name: 'Garamond Nova',
      data: readFileSync(garamond),
      weight: 400,
      style: 'normal',
    }, {
      name: 'Outfit',
      data: readFileSync(outfit),
      weight: 500,
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

  .publisher {
    font-size: 3rem;
    margin-top: auto;
    font-family: Outfit;
    text-transform: uppercase;
  }
`;


export default async function OgImage({ slug, data }) {
  const options = await getOptions();
  const markup = `
  <style>${style}</style>
  <div class="root">
    <div class="cover" style="background-color: ${heat(data.heat)};">
      <span>${ data.title }</span>
    </div>
    <p class="byline">blog.damato.design</p>
    <span class="publisher">D<span style="color: ${heat(data.heat)};">’</span>Amato</span>
  </div>
`;
  return satori(html(markup), options);
}