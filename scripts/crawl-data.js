require('dotenv').config();
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

// Khởi tạo Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

// Hàm sleep để tránh quá nhiều request cùng lúc
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Hàm fetch API với retry logic
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  try {
    const response = await axios.get(url, {
      timeout: 10000, // 10 giây timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    return response.data;
  } catch (error) {
    if (retries <= 0) throw error;
    console.log(`Retrying ${url} after ${delay}ms...`);
    await sleep(delay);
    return fetchWithRetry(url, retries - 1, delay * 2);
  }
}

async function crawlAndSaveData() {
  try {
    console.log('Starting data crawling...');
    
    // Crawl dữ liệu trang chủ
    console.log('Crawling home data...');
    const homeData = await fetchWithRetry('https://ophim1.com/v1/api/home');
    
    // Lưu vào database
    await supabase
      .from('home_data')
      .upsert({ id: 'latest', data: homeData, updated_at: new Date().toISOString() });
    
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
        const url = `https://ophim1.com/v1/api/danh-sach/${category.slug}?page=${page}`;
        const categoryData = await fetchWithRetry(url);
        
        await supabase
          .from('category_data')
          .upsert({ 
            slug: category.slug, 
            page: page,
            data: categoryData, 
            updated_at: new Date().toISOString() 
          });
        
        // Đợi 1 giây giữa các request để tránh bị chặn
        await sleep(1000);
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
      const genreData = await fetchWithRetry(`https://ophim1.com/v1/api/the-loai/${genre.slug}`);
      
      await supabase
        .from('genre_data')
        .upsert({ 
          slug: genre.slug, 
          data: genreData, 
          updated_at: new Date().toISOString() 
        });
      
      // Đợi 1 giây giữa các request để tránh bị chặn
      await sleep(1000);
      
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
      const countryData = await fetchWithRetry(`https://ophim1.com/v1/api/quoc-gia/${country.slug}`);
      
      await supabase
        .from('country_data')
        .upsert({ 
          slug: country.slug, 
          data: countryData, 
          updated_at: new Date().toISOString() 
        });
      
      // Đợi 1 giây giữa các request để tránh bị chặn
      await sleep(1000);
      
      console.log(`Country ${country.name} saved successfully`);
    }
    
    console.log('All data crawled and saved successfully');
  } catch (error) {
    console.error('Error crawling data:', error);
  }
}

// Chạy function
crawlAndSaveData();
