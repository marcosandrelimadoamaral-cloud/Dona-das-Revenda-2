import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.donadarevenda.com.br';
    const now = new Date();

    return [
        { url: `${baseUrl}`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
        { url: `${baseUrl}/sobre`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/contato`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
        { url: `${baseUrl}/privacidade`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/termos-de-uso`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/lgpd`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    ];
}
