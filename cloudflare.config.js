// Cloudflare Pages configuration
module.exports = {
  // Build settings
  build: {
    command: "npm run build",
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
      pattern: "/static/*",
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },

    // Handle API routes
    {
      pattern: "/api/*",
      headers: {
        "Cache-Control": "no-cache",
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
