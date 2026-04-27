import { blogPosts } from "./blogData";

export const blogSummaries = blogPosts.map(post => ({
  id: post.id,
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  date: post.date,
  category: post.category,
  image: post.image,
  imageAlt: post.imageAlt,
  readTime: post.readTime
}));
