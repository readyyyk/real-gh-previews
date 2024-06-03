/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    reactCompiler: true,
    ppr: true,
    //     npm install babel-plugin-react-compiler --force
    //     npm install next@rc react@rc react-dom@rc --force
  },

  images: {
    remotePatterns: [
      {
        hostname: "*",
      },
    ],
  },
};

export default config;
