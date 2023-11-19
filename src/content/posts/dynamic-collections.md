---
title: Dynamic Astro Collections
desc:  Using framework magic in the pursuit of laziness.
heat: 0
date: 2023-04-10
animal: squirrel
---

When I first heard of [Astro](https://astro.build/) it sounded incredible. I thought of it as the next step after working with [11ty](https://www.11ty.dev/). That step is requiring framework support such as [React, Vue, or others](https://docs.astro.build/en/guides/integrations-guide/#official-integrations). While I often avoid frameworks, a framework allows for a shared understanding with a team to achieve a result within the guardrails, [even if convoluted](https://twitter.com/CherryJimbo/status/1643778121944952833).

So for documentation sites that expect to host components written in a framework, Astro seems like a solid choice. However, my initial review of the project had some serious critism when finally attempting to build a site.

## Low maintenance

One of the most important qualities of a documentation site is for it to be low maintenance. This can result in lots of different kinds of optimizations but one of the first I think about is how easy it is to create a new page and have it immediately appear in a navigational interface. It's a non-starter if I need to configure simple navigation by letting the project know that I made a new page and where that new page is in the project. We can do better, but at the time Astro just couldn't do this without accessing some internal methods and even then it didn't seem possible without rebuilding the entire site. The ergonomics weren't great and I decided to pause on the project.

## Content collections

Astro has come a long way since my complaints. Earlier this year with the release of their v2.0, they have introduced [Content Collections](https://astro.build/blog/introducing-content-collections/). Much of their post is talking about it being typesafe which is good but what I was more excited about was the ability to fetch content and manipulate it to render navigation.

[The documentation suggests a few ways to configure a collection](https://docs.astro.build/en/guides/content-collections/) but all of them assume you are manually curating the collection. I'd like to avoid this so you don't need to provide much instruction past "put files here".

Assume the following project `/src` file structure, reduced for brevity. We'll be discussing each top-level directory and its setup to get this to work.

```bash
├── components
│   └── MainNavigation
│       └── index.jsx
├── content
│   ├── components
│   │   ├── button.mdx
│   │   └── ...
│   ├── foundations
│   │   ├── color.mdx
│   │   └── ...
│   ├── ...
│   └── config.js
├── layouts
│   └── Page.astro
├── pages
│   ├── [collection]
│   │   └── [...slug].astro
│   └── index.astro
├── utils
│   └── getAllCollections.js
└── ...
```

### Content

The following is an example of how to [define a collection from the Astro docs](https://docs.astro.build/en/guides/content-collections/#defining-a-collection-schema). The most important part here is the `config.js` file shown below.

```js
// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';
// 2. Define your collection(s)
const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
  }),
});
// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  'blog': blogCollection,
};
```

Note the last comment. The key needs to match your collection directory name. This means that when you add a new directory, this file needs to know and have definitions added. I want to avoid that, so here's my version:

```js
import path from 'path';
import { z, defineCollection } from 'astro:content';
const glob = import.meta.glob('./**'); /* vite */

export const collectionNames = Object.keys(glob).map((filepath) => path.basename(path.dirname(filepath)));

const schema = {
  schema: z.object({
    title: z.string()
  })
};

function assignCollection(acc, name) {
  return Object.assign(acc, { [name]: defineCollection({ ...schema }) });
} 

export const collections = collectionNames.reduce(assignCollection, {});
```

The first new part is using [the `glob` function from Vite](https://vitejs.dev/guide/features.html#glob-import) to get all files relative to this config file. We could be more specific here to look only for `.md{x,} ` but this works fine as-is.

After using the `glob` function to get the files, we parse the filepaths to get the directory that each one is in. This assumes that each section (eg., `/blog`) is only one level deep. This will return an array of directory names that we'll use later. For us, this return `['components', 'foundations']`.

Finally, the `collectionNames` array is reduced using the `assignCollection` function. This creates a new collection definition with each section in the same way we would have done it manually in the original example. During the build step, Astro will create types based on the schema.

Before moving on, make sure you have some content in the markdown files (including the `title` frontmatter) to test out.

### Pages

Next we'll dynamically render our pages. We've set up a [dynamic route](https://docs.astro.build/en/core-concepts/routing/#dynamic-routes) at `[collection][...slug].astro`. As you might have guessed, the `collection` part is the directory name found within `/content` from earlier. For our file structure, this'll eventually write `components` and `foundations` into the url. The slug is created from the file names in each of these directories (`button` and `color`). Here's how we get that to work using frontmatter in the `[...slug].astro` file which is mostly copied from [the official documentation](https://docs.astro.build/en/guides/content-collections/#building-for-static-output-default).

```js
import Page from '@layouts/Page.astro';
import getAllCollections from '@utils/getAllCollections.js';

export async function getStaticPaths() {
  const content = await getAllCollections();
  return content.map((entry) => {
    params: { slug: entry.slug, collection: entry.collection }
    props: { entry }
  });
}

const { entry } = Astro.props;
const { Content } = await entry.render();
```

A few things to note. The `@layouts` alias points to the `/layouts` directory where I have a single `Page.astro` as the base layout. The `@utils` alias points to reusable functions. [These aliases can be setup](https://docs.astro.build/en/guides/aliases/) in the `tsconfig.json` file at the root of the project. The `getAllCollections` function we will need to use twice. Once here to make the paths to content, and a second time to build navigation. I imagine there's a way for this to run once, but this was easiest for me while I explored this solution.

This is what the `getAllCollections` function looks like:

```js
import { getCollection } from 'astro:content';
import { collectionNames } from '@content/config';

export default async function getAllCollections() {
  const collections = await Promise.all(
    collectionNames.map((name) => getCollection(name));
  );
  return collections.flat();
}
```

The `getCollection` function from Astro will get the data for a single given collection. We have created a list of collections back at the `content/config.js` file as an export called `collectionNames`. So we loop over that to get all of the content and write the section it came from within the metadata. After resolving all the promises, we flatten the result because this is a single-level navigational structure. If you need nesting, you might not want to flatten the results here and have your own tree returned.

At this point we should be rendering pages dynamically. However, we'd also like to automatically generate a navigational interface from this too.

### Layouts

In the `Page.astro` file, we'll need to manipulate the result of the `getAllCollections` function to create a tree for navigation.

```js
import path from 'path';
import getAllCollections from '@utils/getAllCollections.js';

function buildNavigation(collections) {
  return collections.reduce((acc, entry) => {
    // collection is the collectionName string
    const { collection } = entry;
    if (!acc[collection]) acc[collection] = {};
    const { slug, data } = collection;
    acc[collection][data.title] = path.join(import.meta.env.BASE_URL, collection, slug);
  }, {})
}

const collections = await getAllCollections();
const tree = buildNavigation(collections);
```

As we loop over the items in the collection, we get the `title` and build the `url`.

{% aside %}
If you want your navigation to have a specific order, you'd need to either include additional metadata in the `/content` markdown files for this function to sort by and/or provide an order to the `collectionNames` within the `content/config.js`.
{% endaside %}

### Components

Finally we create a navigation component to consume the `tree`. This could be done in any framework, even as an Astro component since it can be a list of links. I've chosen to use React to have several subcomponents in the same file.

```jsx
import React from 'react';

function Section({ section, entries }) {
  const navigation = Object.entries(entries);
  if (!navigation.length) return null;

  return (
    <li>
      <span>{section}</span>
      <ul>
        { navigation.map(([title, url]) => 
          <Item name={ title } url={ url } key={ name }/>
        )}
      </ul>
    </li>
  );
}

function Item({ title, url }) {
  return (
    <li>
      <a href={ url }>{ title }</a>
    </li>
  );
}

export default function MainNavigation({ tree }) {
  const navigation = Object.entries(tree);
  if (!navigation.length) return null;

  return (
    <nav>
      <ul>
        { navigation.map(([section, entries]) => 
          <Section section={ section } entries={ entries } key={ section }/>
        )}
      </ul>
    </nav>
  )
}
```

There's nothing special to see here. The incoming `tree` prop is the object that represents the navigation for the content made in the `buildNavigation` function from earlier. The component will traverse the tree and render out the links.

Finally, back in the `Page.astro` file, import the `<MainNavigation/>` and render it in the body passing in the `tree`.

```jsx
<MainNavigation tree={ tree }>
```

And that's it! Now as markdown pages are created in the `/content` directory, they are automatically added to the navigation.