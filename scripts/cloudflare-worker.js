/**
 * Cloudflare Worker để crawl dữ liệu phim từ OPhim API và lưu vào D1 Database
 */

// Danh sách API URLs
const API_URLS = [
  'https://ophim1.com/v1/api',
  'https://ophim1.cc/v1/api',
  'https://ophim9.cc/v1/api',
  'https://ophim.cc/v1/api',
  'https://ophim.tv/v1/api'
];

// Hàm fetch API với retry logic
async function fetchWithRetry(endpoint, retries = 3, delay = 1000) {
  let lastError;
  
  // Thử từng API URL cho đến khi thành công
  for (const baseUrl of API_URLS) {
    try {
      const url = `${baseUrl}${endpoint}`;
      console.log(`Fetching API: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        cf: {
          cacheTtl: 3600, // Cache 1 giờ
          cacheEverything: true
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`API response success from ${url}`);
      return data;
    } catch (error) {
      console.error(`Error fetching from ${baseUrl}${endpoint}:`, error);
      lastError = error;
      // Tiếp tục thử URL tiếp theo
    }
  }
  
  // Nếu tất cả các URL đều thất bại, thử lại sau một khoảng thời gian
  if (retries > 0) {
    console.log(`Retrying ${endpoint} after ${delay}ms...`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchWithRetry(endpoint, retries - 1, delay * 2);
  }
  
  throw lastError || new Error(`Failed to fetch ${endpoint}`);
}

// Hàm lưu dữ liệu vào D1 Database
async function saveToDatabase(env, table, data, key, value) {
  try {
    // Chuyển đổi dữ liệu thành JSON string
    const jsonData = JSON.stringify(data);
    
    // Tạo timestamp hiện tại
    const timestamp = new Date().toISOString();
    
    // Kiểm tra xem bảng đã tồn tại chưa
    const tableExists = await env.DB.prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name=?`
    ).bind(table).all();
    
    // Nếu bảng chưa tồn tại, tạo bảng mới
    if (tableExists.results.length === 0) {
      await env.DB.exec(`
        CREATE TABLE ${table} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          key TEXT NOT NULL,
          value TEXT,
          data TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `);
      
      // Tạo index cho key và value
      await env.DB.exec(`CREATE INDEX idx_${table}_key ON ${table}(key)`);
      if (value) {
        await env.DB.exec(`CREATE INDEX idx_${table}_value ON ${table}(value)`);
      }
    }
    
    // Kiểm tra xem dữ liệu đã tồn tại chưa
    const stmt = value 
      ? await env.DB.prepare(`SELECT id FROM ${table} WHERE key = ? AND value = ?`).bind(key, value)
      : await env.DB.prepare(`SELECT id FROM ${table} WHERE key = ?`).bind(key);
    
    const existingData = await stmt.all();
    
    if (existingData.results.length > 0) {
      // Cập nhật dữ liệu hiện có
      const updateStmt = value
        ? await env.DB.prepare(`UPDATE ${table} SET data = ?, updated_at = ? WHERE key = ? AND value = ?`)
            .bind(jsonData, timestamp, key, value)
        : await env.DB.prepare(`UPDATE ${table} SET data = ?, updated_at = ? WHERE key = ?`)
            .bind(jsonData, timestamp, key);
      
      await updateStmt.run();
      console.log(`Updated data in ${table} for key=${key}${value ? `, value=${value}` : ''}`);
    } else {
      // Thêm dữ liệu mới
      const insertStmt = value
        ? await env.DB.prepare(`INSERT INTO ${table} (key, value, data, updated_at) VALUES (?, ?, ?, ?)`)
            .bind(key, value, jsonData, timestamp)
        : await env.DB.prepare(`INSERT INTO ${table} (key, data, updated_at) VALUES (?, ?, ?)`)
            .bind(key, jsonData, timestamp);
      
      await insertStmt.run();
      console.log(`Inserted data into ${table} for key=${key}${value ? `, value=${value}` : ''}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error saving to database (${table}):`, error);
    return false;
  }
}

// Hàm lưu dữ liệu vào R2 Storage
async function saveToR2(env, key, data) {
  try {
    // Chuyển đổi dữ liệu thành JSON string
    const jsonData = JSON.stringify(data);
    
    // Lưu vào R2 bucket
    await env.BUCKET.put(key, jsonData, {
      httpMetadata: {
        contentType: 'application/json',
      }
    });
    
    console.log(`Saved data to R2 with key: ${key}`);
    return true;
  } catch (error) {
    console.error(`Error saving to R2 (${key}):`, error);
    return false;
  }
}

// Hàm chính để crawl dữ liệu
async function crawlData(env) {
  try {
    console.log('Starting data crawling...');
    
    // Crawl dữ liệu trang chủ
    console.log('Crawling home data...');
    const homeData = await fetchWithRetry('/home');
    
    // Lưu vào database và R2
    await saveToDatabase(env, 'home_data', homeData, 'latest');
    await saveToR2(env, 'home_data.json', homeData);
    
    console.log('Home data saved successfully');
    
    // Crawl dữ liệu danh mục
    const categories = [
      { slug: 'phim-moi-cap-nhat', name: 'Phim Mới Cập Nhật' },
      { slug: 'phim-bo', name: 'Phim Bộ' },
      { slug: 'phim-le', name: 'Phim Lẻ' },
      { slug: 'hoat-hinh', name: 'Phim Hoạt Hình' }
    ];
    
    for (const category of categories) {
      console.log(`Crawling category: ${category.name}...`);
      
      // Crawl 3 trang cho mỗi danh mục
      for (let page = 1; page <= 3; page++) {
        console.log(`Crawling page ${page} of ${category.name}...`);
        const url = `/danh-sach/${category.slug}?page=${page}`;
        const categoryData = await fetchWithRetry(url);
        
        // Lưu vào database và R2
        await saveToDatabase(env, 'category_data', categoryData, category.slug, page.toString());
        await saveToR2(env, `category_data/${category.slug}_${page}.json`, categoryData);
        
        // Đợi 1 giây giữa các request để tránh bị chặn
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      console.log(`Category ${category.name} saved successfully`);
    }
    
    // Crawl dữ liệu thể loại phổ biến
    const genres = [
      { slug: 'hanh-dong', name: 'Hành Động' },
      { slug: 'tinh-cam', name: 'Tình Cảm' },
      { slug: 'hai-huoc', name: 'Hài Hước' },
      { slug: 'co-trang', name: 'Cổ Trang' },
      { slug: 'tam-ly', name: 'Tâm Lý' },
      { slug: 'kinh-di', name: 'Kinh Dị' },
      { slug: 'vien-tuong', name: 'Viễn Tưởng' }
    ];
    
    for (const genre of genres) {
      console.log(`Crawling genre: ${genre.name}...`);
      const genreData = await fetchWithRetry(`/the-loai/${genre.slug}`);
      
      // Lưu vào database và R2
      await saveToDatabase(env, 'genre_data', genreData, genre.slug);
      await saveToR2(env, `genre_data/${genre.slug}.json`, genreData);
      
      // Đợi 1 giây giữa các request để tránh bị chặn
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Genre ${genre.name} saved successfully`);
    }
    
    // Crawl dữ liệu quốc gia phổ biến
    const countries = [
      { slug: 'viet-nam', name: 'Việt Nam' },
      { slug: 'han-quoc', name: 'Hàn Quốc' },
      { slug: 'trung-quoc', name: 'Trung Quốc' },
      { slug: 'nhat-ban', name: 'Nhật Bản' },
      { slug: 'thai-lan', name: 'Thái Lan' },
      { slug: 'au-my', name: 'Âu Mỹ' }
    ];
    
    for (const country of countries) {
      console.log(`Crawling country: ${country.name}...`);
      const countryData = await fetchWithRetry(`/quoc-gia/${country.slug}`);
      
      // Lưu vào database và R2
      await saveToDatabase(env, 'country_data', countryData, country.slug);
      await saveToR2(env, `country_data/${country.slug}.json`, countryData);
      
      // Đợi 1 giây giữa các request để tránh bị chặn
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Country ${country.name} saved successfully`);
    }
    
    // Lấy danh sách thể loại và quốc gia
    console.log('Crawling categories list...');
    const categoriesList = await fetchWithRetry('/the-loai');
    await saveToDatabase(env, 'categories', categoriesList, 'all');
    await saveToR2(env, 'categories.json', categoriesList);
    
    console.log('Crawling countries list...');
    const countriesList = await fetchWithRetry('/quoc-gia');
    await saveToDatabase(env, 'countries', countriesList, 'all');
    await saveToR2(env, 'countries.json', countriesList);
    
    console.log('All data crawled and saved successfully');
    return { success: true, message: 'Data crawled successfully' };
  } catch (error) {
    console.error('Error crawling data:', error);
    return { success: false, error: error.message };
  }
}

// Xử lý các requests
export default {
  // Xử lý scheduled event (cron job)
  async scheduled(event, env, ctx) {
    ctx.waitUntil(crawlData(env));
  },
  
  // Xử lý HTTP requests
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Endpoint để chạy crawler thủ công
    if (url.pathname === '/api/crawl') {
      ctx.waitUntil(crawlData(env));
      return new Response(JSON.stringify({ success: true, message: 'Crawler started' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Endpoint để lấy dữ liệu từ R2
    if (url.pathname.startsWith('/api/data/')) {
      const key = url.pathname.replace('/api/data/', '');
      
      try {
        const object = await env.BUCKET.get(key);
        
        if (object === null) {
          return new Response(JSON.stringify({ error: 'Not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const data = await object.json();
        return new Response(JSON.stringify(data), {
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600'
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
