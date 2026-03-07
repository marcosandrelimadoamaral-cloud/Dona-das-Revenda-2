import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard', '/onboarding', '/checkout', '/login', '/signup', '/api'],
        },
        sitemap: 'https://donadarevenda.com.br/sitemap.xml',
    };
}
