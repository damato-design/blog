import { getCollection } from 'astro:content';
import { Feed } from 'feed';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

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

// MDX isn't rendered properly yet
// https://github.com/withastro/roadmap/issues/533
function removeImport(body) {
    return body.replace(/import [^\s]+ from [^/]+\/\w+.astro';/gm, '');
}

export default async function(context) {
    const feed = getFeed(context);
    let posts = [];
    try {
      posts = await getCollection('posts');
    } catch (err) {}
    const published = import.meta.env.PROD ? posts.filter((post) => !post?.data?.draft) : posts;
    return published.reduce((feed, post) => {
        const url = new URL(`/posts/${post.slug}`, context.url.origin).toString();
        const item = {
            title: post.data.title,
            id: url,
            date: post.data.date,
            description: post.data.desc,
            link: url,
            content: md.render(removeImport(post.body)),
            image: new URL(`/og-images/${post.slug}.png`, context.url.origin).toString(), 
        };
        feed.addItem(item);
        return feed;
    }, feed);
}