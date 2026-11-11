/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = (process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/$/, '');

  // 1. Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/pricing',
    '/features',
    '/contact',
    '/privacy-policy',
    '/terms',
  ].map((route) => ({
    url: `${domain}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Fetch Dynamic Pages from Backend
  let dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/pages/sitemap-list`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.pages)) {
        dynamicPages = data.pages.map((page: any) => ({
          url: `${domain}/page/${page.slug}`,
          lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.6,
        }));
      }
    }
  } catch {
    // If backend is not running during build or unreachable, gracefully build static pages
  }

  return [...staticPages, ...dynamicPages];
}
