/**
 * Cloudflare API client
 */

// Base URL cho Cloudflare Worker API
const WORKER_API_URL = process.env.NEXT_PUBLIC_WORKER_API_URL || 'https://venchill-crawler.acejunpio.workers.dev';

// Base URL cho Cloudflare R2 Storage
const R2_URL = 'https://pub-f0628ac6784b48e5944988d4ea90cd70.r2.dev';

// Hàm fetch dữ liệu từ Cloudflare R2 Storage
export async function fetchFromR2(key: string) {
  try {
    console.log(`Fetching from R2: ${key}`);
    const response = await fetch(`${R2_URL}/${key}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'force-cache', // Sử dụng cache để tránh quá nhiều requests
      next: { revalidate: 3600 } // Revalidate mỗi giờ
    });

    if (!response.ok) {
      throw new Error(`R2 error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from R2 (${key}):`, error);
    throw error;
  }
}

// Hàm fetch dữ liệu từ Cloudflare Worker
export async function fetchFromCloudflare(key: string) {
  try {
    // Kiểm tra xem WORKER_API_URL có tồn tại không
    if (!process.env.NEXT_PUBLIC_WORKER_API_URL) {
      throw new Error('Worker API URL not configured');
    }

    console.log(`Fetching from Cloudflare Worker: ${key}`);
    const response = await fetch(`${WORKER_API_URL}/api/data/${key}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'force-cache', // Sử dụng cache để tránh quá nhiều requests
      next: { revalidate: 3600 } // Revalidate mỗi giờ
    });

    if (!response.ok) {
      throw new Error(`Cloudflare Worker API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from Cloudflare Worker (${key}):`, error);
    throw error;
  }
}

// Hàm fetch dữ liệu từ Cloudflare với fallback về API gốc
export async function fetchFromCloudflareOrAPI(key: string, fetchAPIFn: () => Promise<any>) {
  console.log(`[DEBUG] Fetching data for key: ${key}`);

  // Kiểm tra xem có cache trong localStorage không
  if (typeof window !== 'undefined') {
    try {
      const cacheKey = `cloudflare_cache_${key.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const now = new Date().getTime();
        // Cache có hiệu lực trong 1 giờ
        if (now - timestamp < 3600000) {
          console.log(`[DEBUG] Using localStorage cache for: ${key}`);
          return data;
        }
      }
    } catch (e) {
      console.error('[DEBUG] Error reading from localStorage cache:', e);
    }
  }

  // Thử lấy từ Worker API trước (bỏ qua R2 vì có vấn đề với quyền truy cập)
  try {
    // Kiểm tra xem Worker API URL có được cấu hình không
    if (!process.env.NEXT_PUBLIC_WORKER_API_URL ||
        process.env.NEXT_PUBLIC_WORKER_API_URL.includes('your-subdomain')) {
      console.log(`[DEBUG] Worker API not configured, using direct API for: ${key}`);
      const data = await fetchAPIFn();
      console.log(`[DEBUG] Got data from direct API for: ${key}`, { dataSize: JSON.stringify(data).length });
      return data;
    }

    console.log(`[DEBUG] Fetching from Worker API: ${key}, URL: ${process.env.NEXT_PUBLIC_WORKER_API_URL}/api/data/${key}`);
    const data = await fetchFromCloudflare(key);
    console.log(`[DEBUG] Using data from Worker API: ${key}`, { dataSize: JSON.stringify(data).length });

    // Lưu vào localStorage cache
    if (typeof window !== 'undefined') {
      try {
        const cacheKey = `cloudflare_cache_${key.replace(/[^a-zA-Z0-9]/g, '_')}`;
        localStorage.setItem(cacheKey, JSON.stringify({
          data,
          timestamp: new Date().getTime()
        }));
        console.log(`[DEBUG] Saved data to localStorage cache: ${key}`);
      } catch (e) {
        console.error('[DEBUG] Error writing to localStorage cache:', e);
      }
    }

    return data;
  } catch (error) {
    console.error(`[DEBUG] Error fetching from Worker API, falling back to direct API: ${key}`, error);

    // Fallback về API gốc
    try {
      console.log(`[DEBUG] Fetching from direct API: ${key}`);
      const data = await fetchAPIFn();
      console.log(`[DEBUG] Using data from direct API: ${key}`, { dataSize: JSON.stringify(data).length });

      // Lưu vào localStorage cache
      if (typeof window !== 'undefined') {
        try {
          const cacheKey = `cloudflare_cache_${key.replace(/[^a-zA-Z0-9]/g, '_')}`;
          localStorage.setItem(cacheKey, JSON.stringify({
            data,
            timestamp: new Date().getTime()
          }));
          console.log(`[DEBUG] Saved data from direct API to localStorage cache: ${key}`);
        } catch (e) {
          console.error('[DEBUG] Error writing to localStorage cache:', e);
        }
      }

      return data;
    } catch (apiError) {
      console.error(`[DEBUG] Error fetching from direct API: ${key}`, apiError);
      throw apiError;
    }
  }
}
