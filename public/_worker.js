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
    
    // For all other routes, serve the index.html file
    const response = await fetch(new URL('/index.html', url.origin));
    
    // Clone the response and modify headers
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Content-Type', 'text/html; charset=UTF-8');
    
    return newResponse;
  }
};
