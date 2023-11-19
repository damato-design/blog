import sharp from 'sharp';
import { getCollection } from 'astro:content';
import OgImage from '@components/OgImage';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  const index = { slug: 'index', data: { title: 'Design Systems Hot Takes' } };
  return [index].concat(posts).map((entry) => ({
    params: { slug: entry.slug }, props: { entry },
  }));
}

export async function GET({ props }) {
  const svg = await OgImage(props.entry);
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}