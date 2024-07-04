import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import { getCollection } from 'astro:content';
import { Feed } from 'feed';
import RssContent from '@components/RssContent.astro';

function getFeed(context) {
    const image = new URL(`/og-images/index.png`, context.url.origin).toString();
    const favicon = new URL(`/favicon.svg`, context.url.origin).toString();
    const json = new URL(`/feed.json`, context.url.origin).toString();
    const atom = new URL(`/feed.xml`, context.url.origin).toString();
    return new Feed({
        title: 'blog.damato.design',
        description: 'Design Systems Hot Takes',
        id: context.url.origin,
        link: context.url.origin,
        language: "en",
        image,
        favicon,
        copyright: `All rights reserved ${new Date().getFullYear()}, Donnie D'Amato`,
        generator: "Astro.build",
        feedLinks: {
            json,
            atom,
            rss: atom
        },
        author: {
            name: "Donnie D'Amato",
            email: "donnie@damato.design",
            link: "https://blog.damato.design"
        }
    });
}

export default async function(context) {
    const feed = getFeed(context);
    const container = await AstroContainer.create({
        renderers: [
            { name: "@astrojs/mdx", serverEntrypoint: "astro/jsx/server.js" },
        ],
    });
    let posts = [];
    try {
      posts = await getCollection('posts');
    } catch (err) {}
    const published = import.meta.env.PROD ? posts.filter((post) => !post?.data?.draft) : posts;

    const items = await Promise.all(published.map(async (post) => {
        const url = new URL(`/posts/${post.slug}`, context.url.origin).toString();
        const content = await container.renderToString(RssContent, {
            params: { slug: post.slug }
        });
        
        return {
            title: post.data.title,
            id: url,
            date: post.data.date,
            description: post.data.desc,
            link: url,
            content,
            image: new URL(`/og-images/${post.slug}.png`, context.url.origin).toString(), 
        };
    }));

    items.forEach((item) => feed.addItem(item));

    return feed;
}