/**
 * Cloudflare API client
 */

// Base URL cho Cloudflare Worker API
const WORKER_API_URL = process.env.NEXT_PUBLIC_WORKER_API_URL || 'https://venchill-crawler.your-subdomain.workers.dev';

// Hàm fetch dữ liệu từ Cloudflare Worker
export async function fetchFromCloudflare(key: string) {
  try {
    // Kiểm tra xem WORKER_API_URL có tồn tại không
    if (!process.env.NEXT_PUBLIC_WORKER_API_URL) {
      throw new Error('Worker API URL not configured');
    }

    console.log(`Fetching from Cloudflare: ${key}`);
    const response = await fetch(`${WORKER_API_URL}/api/data/${key}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'force-cache', // Sử dụng cache để tránh quá nhiều requests
      next: { revalidate: 3600 } // Revalidate mỗi giờ
    });

    if (!response.ok) {
      throw new Error(`Cloudflare API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from Cloudflare (${key}):`, error);
    throw error;
  }
}

// Hàm fetch dữ liệu từ Cloudflare với fallback về API gốc
export async function fetchFromCloudflareOrAPI(key: string, fetchAPIFn: () => Promise<any>) {
  // Kiểm tra xem Worker API URL có được cấu hình không
  if (!process.env.NEXT_PUBLIC_WORKER_API_URL ||
      process.env.NEXT_PUBLIC_WORKER_API_URL.includes('your-subdomain')) {
    console.log(`Worker API not configured, using direct API for: ${key}`);
    return await fetchAPIFn();
  }

  try {
    // Thử lấy dữ liệu từ Cloudflare
    const data = await fetchFromCloudflare(key);
    console.log(`Using cached data from Cloudflare: ${key}`);
    return data;
  } catch (error) {
    console.error(`Error fetching from Cloudflare, falling back to API: ${key}`, error);
    // Fallback về API gốc
    return await fetchAPIFn();
  }
}
