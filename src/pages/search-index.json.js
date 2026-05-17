import { getCollection } from 'astro:content';
import { stripMarkdown } from '../utils/strip-markdown';

export async function GET() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const index = posts.map((post) => ({
    id: post.slug,
    title: post.data.title,
    date: post.data.date.toISOString(),
    description: post.data.description || '',
    tags: post.data.tags,
    slug: post.slug,
    body: stripMarkdown(post.body || ''),
  }));

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
}
