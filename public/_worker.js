// Cloudflare Worker script
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Xử lý CORS
    if (request.method === 'OPTIONS') {
      return handleCors(request);
    }

    // Thêm các headers bảo mật
    const securityHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy': "default-src 'self' *.ophim1.com *.ophim.live; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: *.ophim1.com *.ophim.live; media-src 'self' *.ophim1.com *.ophim.live; connect-src 'self' *.ophim1.com *.ophim.live;",
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
    };

    // Xử lý các tệp tĩnh
    if (
      url.pathname.startsWith('/_next/') ||
      url.pathname.startsWith('/images/') ||
      url.pathname.startsWith('/assets/') ||
      url.pathname.match(/\.(js|css|json|ico|png|jpg|jpeg|gif|svg|webp|m3u8|ts)$/)
    ) {
      const response = await fetch(request);
      return addHeaders(response, securityHeaders);
    }

    // Xử lý các trang HTML
    try {
      // Kiểm tra xem có tệp HTML tương ứng không
      let htmlPath = url.pathname;
      if (htmlPath.endsWith('/')) {
        htmlPath += 'index.html';
      } else if (!htmlPath.endsWith('.html')) {
        htmlPath += '.html';
      }

      // Thử tìm tệp HTML
      try {
        const htmlResponse = await fetch(new URL(htmlPath, url.origin));
        if (htmlResponse.ok) {
          return addHeaders(htmlResponse, securityHeaders);
        }
      } catch (e) {
        // Bỏ qua lỗi và tiếp tục
      }

      // Nếu không tìm thấy, thử index.html
      const indexResponse = await fetch(new URL('/index.html', url.origin));
      if (indexResponse.ok) {
        return addHeaders(indexResponse, securityHeaders);
      }

      // Nếu không tìm thấy, trả về 404
      const notFoundResponse = await fetch(new URL('/404.html', url.origin));
      if (notFoundResponse.ok) {
        return addHeaders(
          new Response(notFoundResponse.body, {
            status: 404,
            headers: notFoundResponse.headers
          }),
          securityHeaders
        );
      }

      // Nếu không có trang 404, trả về lỗi mặc định
      return new Response('Page not found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
          ...securityHeaders
        }
      });
    } catch (error) {
      console.error('Error serving page:', error);

      // Trả về lỗi 500
      return new Response('Internal Server Error', {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
          ...securityHeaders
        }
      });
    }
  }
};

// Hàm xử lý CORS
function handleCors(request) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}

// Hàm thêm headers vào response
function addHeaders(response, headers) {
  const newResponse = new Response(response.body, response);

  // Thêm các headers bảo mật
  Object.keys(headers).forEach(key => {
    newResponse.headers.set(key, headers[key]);
  });

  return newResponse;
}
