import { getCollection } from 'astro:content';
import { Feed } from 'feed';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

function getFeed(context) {
    return new Feed({
        title: 'blog.damato.design',
        description: 'Design Systems Hot Takes',
        id: context.url.origin,
        link: context.url.origin,
        language: "en",
        //image: "http://example.com/image.png",
        //favicon: "http://example.com/favicon.ico",
        copyright: `All rights reserved ${new Date().getFullYear()}, Donnie D'Amato`,
        generator: "Astro.build",
        feedLinks: {
            json: `${context.url.origin}/rss.json`,
            atom: `${context.url.origin}/rss.xml`
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
    let posts = [];
    try {
      posts = await getCollection('posts');
    } catch (err) {}
    return posts.reduce((feed, post) => {
        const url = new URL(`posts/${post.slug}`, import.meta.env.SITE).toString();
        const item = {
            title: post.data.title,
            id: url,
            date: post.data.date,
            description: post.data.desc,
            link: url,
            content: md.render(post.body),
            image: new URL(`og-images/${post.slug}`, import.meta.env.SITE).toString(), 
        };
        feed.addItem(item);
        return feed;
    }, feed);
}