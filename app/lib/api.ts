// API client for OPhim API

// Sử dụng API của OPhim
const API_BASE_URL = 'https://ophim1.com/v1/api';

// Tạo hàm fetch API an toàn cho cả client và server
const fetchAPI = async (endpoint: string) => {
  try {
    console.log(`Fetching API: ${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store', // Không cache để luôn lấy dữ liệu mới nhất
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`API response for ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return { status: 'error', message: error instanceof Error ? error.message : 'Unknown error', data: { items: [] } };
  }
};

// Home page data
export const getHomeData = async () => {
  return await fetchAPI('/home');
};

// Get movie by slug
export const getMovieBySlug = async (slug: string) => {
  return await fetchAPI(`/phim/${slug}`);
};

// Get movie list by category
export const getMoviesByCategory = async (category: string, page: number = 1) => {
  return await fetchAPI(`/danh-sach/${category}?page=${page}`);
};

// Get movie list by genre
export const getMoviesByGenre = async (genre: string, page: number = 1) => {
  return await fetchAPI(`/the-loai/${genre}?page=${page}`);
};

// Get movie list by country
export const getMoviesByCountry = async (country: string, page: number = 1) => {
  return await fetchAPI(`/quoc-gia/${country}?page=${page}`);
};

// Search movies
export const searchMovies = async (keyword: string, page: number = 1) => {
  return await fetchAPI(`/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`);
};

// Get all categories
export const getCategories = async () => {
  return await fetchAPI('/the-loai');
};

// Get all countries
export const getCountries = async () => {
  return await fetchAPI('/quoc-gia');
};

// Get latest movies
export const getLatestMovies = async (page: number = 1) => {
  return await fetchAPI(`/danh-sach/phim-moi-cap-nhat?page=${page}`);
};

// Get trending movies
export const getTrendingMovies = async () => {
  // Lấy phim bộ đang chiếu và phim lẻ mới nhất
  const [series, single] = await Promise.all([
    fetchAPI('/danh-sach/phim-bo-dang-chieu?page=1'),
    fetchAPI('/danh-sach/phim-le?page=1')
  ]);

  // Kết hợp và trộn lẫn các phim
  const combinedItems = [
    ...(series?.data?.items || []),
    ...(single?.data?.items || [])
  ].sort(() => Math.random() - 0.5).slice(0, 10);

  return { data: { items: combinedItems } };
};
