// Cloudflare Worker script
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Serve static assets directly
    if (
      url.pathname.startsWith('/_next/') ||
      url.pathname.startsWith('/images/') ||
      url.pathname.startsWith('/assets/') ||
      url.pathname.match(/\.(js|css|json|ico|png|jpg|jpeg|gif|svg|webp)$/)
    ) {
      return fetch(request);
    }

    // For all other routes, serve the index.html file in _next/static
    try {
      const response = await fetch(new URL('/_next/static/index.html', url.origin));

      // Clone the response and modify headers
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('Content-Type', 'text/html; charset=UTF-8');

      return newResponse;
    } catch (error) {
      console.error('Error serving index.html:', error);

      // Try to serve the root index.html as a fallback
      try {
        const fallbackResponse = await fetch(new URL('/index.html', url.origin));
        const newFallbackResponse = new Response(fallbackResponse.body, fallbackResponse);
        newFallbackResponse.headers.set('Content-Type', 'text/html; charset=UTF-8');

        return newFallbackResponse;
      } catch (fallbackError) {
        console.error('Error serving fallback index.html:', fallbackError);
        return new Response('Error loading the application. Please try again later.', {
          status: 500,
          headers: {
            'Content-Type': 'text/plain'
          }
        });
      }
    }
  }
};
