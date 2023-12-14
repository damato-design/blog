import { getCollection } from 'astro:content';

export default async function getPosts() {
  const collection = await getCollection('posts');
  const published = import.meta.env.PROD ? collection.filter((post) => !post?.data?.draft) : collection;
  return published.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
}
