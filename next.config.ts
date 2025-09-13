import type { NextConfig } from "next";

const nextConfig = {
  reactStrictMode: true,
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Add other configurations as needed
}

module.exports = nextConfig