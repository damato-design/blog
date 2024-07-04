import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import rss from "@astrojs/rss";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { getCollection } from "astro:content";

export async function GET(context) {

    const image = new URL(`/og-images/index.png`, context.url.origin).toString();
    const favicon = new URL(`/favicon.svg`, context.url.origin).toString();
    const atom = new URL(`/feed.xml`, context.url.origin).toString();

  // Load MDX renderer. Other renderers for UI frameworks (e.g. React, Vue, etc.) would need adding here if you were using those.
  const renderers = await loadRenderers([getMDXRenderer()]);

  // Create a new Astro container that we can render components with.
  // See https://docs.astro.build/en/reference/container-reference/
  const container = await AstroContainer.create({ renderers });

  // Load the content collection entries to add to our RSS feed.
  const posts = await getCollection('posts');
  const published = import.meta.env.PROD ? posts.filter((post) => !post?.data?.draft) : posts;

  // Loop over blog posts to create feed items for each, including full content.
  const items = [];
  for (const post of published) {
    // Get the `<Content/>` component for the current post.
    const { Content } = await post.render();
    // Use the Astro container to render the content to a string.
    const content = await container.renderToString(Content);
    
    const link = new URL(`/posts/${post.slug}`, context.url.origin).toString();
    
    items.push({ ...post.data, pubDate: post.data.date, link, content });
  }

  // Return our RSS feed XML response.
  return rss({
    title: 'blog.damato.design',
    description: 'Design Systems Hot Takes',
    site: context.site,
    items,
  });
}