// Cloudflare Pages configuration
module.exports = {
  // Build settings
  build: {
    command: "npm run cloudflare:build",
    directory: ".next",
    environment: {
      NODE_VERSION: "18",
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },

  // Routes configuration
  routes: [
    // Handle static assets
    {
      pattern: "/_next/*",
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },

    // Handle images
    {
      pattern: "/images/*",
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },

    // Handle all other routes
    {
      pattern: "/*",
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    },
  ],
};
