/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["ui", "config", "database", "ai-agents"],
};

module.exports = nextConfig;
