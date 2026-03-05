/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["ui", "config", "database", "ai-agents"],

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevents clickjacking — stops site from being embedded in iframes
          { key: "X-Frame-Options", value: "DENY" },
          // Forces HTTPS for 1 year (preload-ready)
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          // Stops browsers from guessing MIME types
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Controls referrer info sent to other sites
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Restricts browser APIs available to the page
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Content Security Policy — blocks XSS, restricts scripts/styles/frames
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://maps.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: http:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://generativelanguage.googleapis.com",
              "frame-src https://js.stripe.com https://hooks.stripe.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
