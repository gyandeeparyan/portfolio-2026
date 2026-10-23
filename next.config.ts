import type { NextConfig } from "next";

// e.g. "/portfolio-2026" when served from a GitHub Pages project sub-path; empty locally.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Fully static: `next build` writes plain HTML/JS/CSS to ./out
  output: "export",
  images: { unoptimized: true },
  basePath,
};

export default nextConfig;
