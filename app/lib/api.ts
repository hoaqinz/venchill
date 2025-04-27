// API client for OPhim API
import { fetchFromCloudflareOrAPI } from "./cloudflare";

// Sử dụng API của OPhim với fallback
const API_URLS = [
  'https://ophim1.com/v1/api',
  'https://ophim1.cc/v1/api',
  'https://ophim9.cc/v1/api',
  'https://ophim.cc/v1/api',
  'https://ophim.tv/v1/api'
];

// Tạo hàm fetch API an toàn cho cả client và server
const fetchAPI = async (endpoint: string) => {
  let lastError;

  // Thử từng API URL cho đến khi thành công
  for (const baseUrl of API_URLS) {
    try {
      console.log(`Fetching API: ${baseUrl}${endpoint}`);

      const response = await fetch(`${baseUrl}${endpoint}`, {
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
      console.log(`API response success from ${baseUrl}${endpoint}`);
      return data;
    } catch (error) {
      console.error(`Error fetching from ${baseUrl}${endpoint}:`, error);
      lastError = error;
      // Tiếp tục thử URL tiếp theo
    }
  }

  // Nếu tất cả các URL đều thất bại, trả về dữ liệu mặc định
  console.error(`All API endpoints failed for ${endpoint}`, lastError);

  // Dữ liệu mẫu cho trang phim
  if (endpoint.startsWith('/phim/')) {
    return {
      status: 'success',
      data: {
        item: {
          _id: 'sample-id',
          name: 'Phim Mẫu',
          origin_name: 'Sample Movie',
          content: '<p>Đây là nội dung mẫu cho phim.</p>',
          type: 'single',
          status: 'completed',
          thumb_url: 'https://via.placeholder.com/300x450.png?text=Sample+Movie',
          poster_url: 'https://via.placeholder.com/800x450.png?text=Sample+Movie',
          slug: endpoint.split('/phim/')[1],
          year: 2023,
          time: '120 phút',
          quality: 'HD',
          lang: 'Vietsub',
          category: [
            { id: 'hanh-dong', name: 'Hành Động', slug: 'hanh-dong' },
          ],
          country: [
            { id: 'my', name: 'Mỹ', slug: 'my' }
          ],
          actor: ['Diễn viên 1', 'Diễn viên 2'],
          director: ['Đạo diễn'],
          episodes: [
            {
              server_name: 'Vietsub #1',
              server_data: [
                { name: '1', slug: '1', filename: 'Tập 1', link_embed: 'https://example.com/embed/1', link_m3u8: 'https://example.com/m3u8/1' },
              ]
            }
          ]
        }
      }
    };
  }

  // Dữ liệu mẫu cho danh sách phim
  return {
    status: 'success',
    data: {
      items: [
        {
          name: 'Phim Mẫu 1',
          origin_name: 'Sample Movie 1',
          thumb_url: 'https://via.placeholder.com/300x450.png?text=Sample+Movie+1',
          poster_url: 'https://via.placeholder.com/800x450.png?text=Sample+Movie+1',
          slug: 'phim-mau-1',
        },
        {
          name: 'Phim Mẫu 2',
          origin_name: 'Sample Movie 2',
          thumb_url: 'https://via.placeholder.com/300x450.png?text=Sample+Movie+2',
          poster_url: 'https://via.placeholder.com/800x450.png?text=Sample+Movie+2',
          slug: 'phim-mau-2',
        },
      ],
      params: {
        pagination: {
          totalItems: 100,
          totalItemsPerPage: 24,
          currentPage: 1,
          pageRanges: 0,
        }
      }
    }
  };
};



// Hàm kiểm tra phim có thuộc thể loại không
const isMovieInCategory = (movie: any, categorySlug: string): boolean => {
  // Nếu không có thông tin thể loại, trả về false
  if (!movie.category || !Array.isArray(movie.category)) {
    return false;
  }

  // Kiểm tra xem phim có thuộc thể loại không
  return movie.category.some((cat: any) => cat.slug === categorySlug);
};

// Hàm kiểm tra phim có phải là phim chiếu rạp không
const isMovieInTheater = (movie: any): boolean => {
  // Kiểm tra thuộc tính chieurap
  if (movie.chieurap === true) {
    return true;
  }

  // Kiểm tra tên phim có chứa từ khóa liên quan đến phim chiếu rạp
  const theaterKeywords = ['chiếu rạp', 'theater', 'cinema'];
  const movieName = (movie.name || '').toLowerCase();
  const originName = (movie.origin_name || '').toLowerCase();

  if (theaterKeywords.some(keyword =>
    movieName.includes(keyword) || originName.includes(keyword)
  )) {
    return true;
  }

  // Mở rộng tiêu chí: Phim lẻ có chất lượng cao và năm gần đây
  if (movie.type === 'single' && movie.quality &&
      (movie.quality.includes('HD') || movie.quality.includes('FHD')) &&
      movie.year && movie.year >= 2020) {

    // Kiểm tra thêm: Phim có IMDB hoặc TMDB score cao
    if (movie.imdb && movie.imdb.id) {
      return true;
    }

    if (movie.tmdb && movie.tmdb.vote_average && movie.tmdb.vote_average >= 6.5) {
      return true;
    }

    // Thêm một số phim nổi tiếng
    const popularMovieTitles = [
      'avatar', 'avengers', 'fast', 'furious', 'jurassic', 'spider-man', 'spiderman',
      'batman', 'superman', 'wonder woman', 'captain', 'thor', 'iron man', 'hulk',
      'black panther', 'doctor strange', 'guardians', 'ant-man', 'deadpool',
      'transformers', 'mission impossible', 'john wick', 'matrix', 'terminator',
      'star wars', 'harry potter', 'lord of the rings', 'hobbit'
    ];

    return popularMovieTitles.some(title =>
      movieName.includes(title) || originName.includes(title)
    );
  }

  return false;
};

// Hàm kiểm tra phim có phải là phim hoạt hình không
const isAnimeMovie = (movie: any): boolean => {
  // Kiểm tra type trực tiếp
  if (movie.type === 'hoathinh') {
    return true;
  }

  // Kiểm tra thể loại "hoat-hinh"
  if (isMovieInCategory(movie, 'hoat-hinh')) {
    return true;
  }

  // Kiểm tra tên phim có chứa từ khóa liên quan đến hoạt hình
  const animeKeywords = [
    'anime', 'hoạt hình', 'cartoon', 'animation', 'animated',
    'doraemon', 'pokemon', 'dragon ball', 'naruto', 'one piece', 'conan', 'ghibli',
    'pixar', 'disney', 'dreamworks', 'studio ghibli', 'hayao miyazaki',
    'your name', 'weathering with you', 'spirited away', 'totoro',
    'kung fu panda', 'how to train your dragon', 'toy story', 'incredibles',
    'frozen', 'moana', 'coco', 'inside out', 'up', 'wall-e', 'finding nemo',
    'shrek', 'madagascar', 'ice age', 'despicable me', 'minions'
  ];

  const movieName = (movie.name || '').toLowerCase();
  const originName = (movie.origin_name || '').toLowerCase();

  // Kiểm tra từ khóa trong tên phim
  if (animeKeywords.some(keyword => movieName.includes(keyword) || originName.includes(keyword))) {
    return true;
  }

  // Kiểm tra các đặc điểm khác của phim hoạt hình
  // Phim hoạt hình thường có thời lượng ngắn và nhiều tập
  if (movie.type === 'series' && movie.time && movie.time.includes('phút/tập')) {
    const minutes = parseInt(movie.time);
    if (!isNaN(minutes) && minutes < 30) {
      return true;
    }
  }

  // Kiểm tra quốc gia - phim Nhật Bản có khả năng cao là anime
  if (movie.country && Array.isArray(movie.country)) {
    const isJapanese = movie.country.some((country: any) =>
      country.slug === 'nhat-ban' || country.name.toLowerCase().includes('nhật')
    );

    // Nếu là phim Nhật và có thời lượng ngắn, có khả năng cao là anime
    if (isJapanese && movie.time && movie.time.includes('phút/tập')) {
      return true;
    }
  }

  return false;
};

// Home page data
export const getHomeData = async () => {
  try {
    // Thử lấy dữ liệu từ Cloudflare trước
    let homeData;
    try {
      homeData = await fetchFromCacheOrAPI('home_data.json', '/home');
    } catch (error) {
      console.error("Error fetching home data from Cloudflare:", error);
      homeData = await fetchAPI('/home');
    }

    // Lấy dữ liệu cho các chuyên mục từ Cloudflare hoặc API
    const [
      phimMoiCapNhatData1, phimMoiCapNhatData2, phimMoiCapNhatData3,
      phimBoData1, phimBoData2, phimBoData3,
      phimLeData1, phimLeData2, phimLeData3,
      hoatHinhData1, hoatHinhData2, hoatHinhData3
    ] = await Promise.all([
      fetchFromCacheOrAPI('category_data/phim-moi-cap-nhat_1.json', '/danh-sach/phim-moi-cap-nhat'),
      fetchFromCacheOrAPI('category_data/phim-moi-cap-nhat_2.json', '/danh-sach/phim-moi-cap-nhat?page=2'),
      fetchFromCacheOrAPI('category_data/phim-moi-cap-nhat_3.json', '/danh-sach/phim-moi-cap-nhat?page=3'),
      fetchFromCacheOrAPI('category_data/phim-bo_1.json', '/danh-sach/phim-bo'),
      fetchFromCacheOrAPI('category_data/phim-bo_2.json', '/danh-sach/phim-bo?page=2'),
      fetchFromCacheOrAPI('category_data/phim-bo_3.json', '/danh-sach/phim-bo?page=3'),
      fetchFromCacheOrAPI('category_data/phim-le_1.json', '/danh-sach/phim-le'),
      fetchFromCacheOrAPI('category_data/phim-le_2.json', '/danh-sach/phim-le?page=2'),
      fetchFromCacheOrAPI('category_data/phim-le_3.json', '/danh-sach/phim-le?page=3'),
      fetchFromCacheOrAPI('category_data/hoat-hinh_1.json', '/danh-sach/hoat-hinh'),
      fetchFromCacheOrAPI('category_data/hoat-hinh_2.json', '/danh-sach/hoat-hinh?page=2'),
      fetchFromCacheOrAPI('category_data/hoat-hinh_3.json', '/danh-sach/hoat-hinh?page=3')
    ]);

    // Lấy dữ liệu thể loại từ Cloudflare hoặc API
    const [actionMovies, romanceMovies, comedyMovies] = await Promise.all([
      fetchFromCacheOrAPI('genre_data/hanh-dong.json', '/the-loai/hanh-dong'),
      fetchFromCacheOrAPI('genre_data/tinh-cam.json', '/the-loai/tinh-cam'),
      fetchFromCacheOrAPI('genre_data/hai-huoc.json', '/the-loai/hai-huoc')
    ]).catch(() => [null, null, null]);

    // Kết hợp dữ liệu từ nhiều trang
    const phimMoiCapNhatItems = [
      ...(phimMoiCapNhatData1?.data?.items || []),
      ...(phimMoiCapNhatData2?.data?.items || []),
      ...(phimMoiCapNhatData3?.data?.items || [])
    ];

    const phimBoItems = [
      ...(phimBoData1?.data?.items || []),
      ...(phimBoData2?.data?.items || []),
      ...(phimBoData3?.data?.items || [])
    ].filter((movie: any) => movie.type === 'series');

    const phimLeItems = [
      ...(phimLeData1?.data?.items || []),
      ...(phimLeData2?.data?.items || []),
      ...(phimLeData3?.data?.items || [])
    ].filter((movie: any) => movie.type === 'single');

    const hoatHinhItems = [
      ...(hoatHinhData1?.data?.items || []),
      ...(hoatHinhData2?.data?.items || []),
      ...(hoatHinhData3?.data?.items || [])
    ];

    // Lọc phim theo thể loại
    const phimMoiCapNhat = {
      ...phimMoiCapNhatData1?.data,
      items: phimMoiCapNhatItems
    };

    // Đảm bảo phim bộ chỉ chứa phim bộ
    const phimBo = {
      ...phimBoData1?.data,
      items: phimBoItems
    };

    // Đảm bảo phim lẻ chỉ chứa phim lẻ
    const phimLe = {
      ...phimLeData1?.data,
      items: phimLeItems
    };

    // Lọc phim chiếu rạp từ tất cả các phim
    const allMoviesForTheater = [
      ...phimMoiCapNhatItems,
      ...phimLeItems
    ];

    // Loại bỏ các phim trùng lặp
    const uniqueTheaterMovies = Array.from(
      new Map(
        allMoviesForTheater
          .filter((movie: any) => isMovieInTheater(movie))
          .map(movie => [movie.slug, movie])
      ).values()
    );

    const phimChieuRap = {
      ...phimLeData1?.data,
      items: uniqueTheaterMovies
    };

    // Lọc phim hoạt hình từ tất cả các phim
    const allMovies = [
      ...hoatHinhItems,
      ...phimMoiCapNhatItems,
      ...phimBoItems,
      ...phimLeItems
    ];

    // Loại bỏ các phim trùng lặp
    const uniqueAnimeMovies = Array.from(
      new Map(
        allMovies
          .filter((movie: any) => isAnimeMovie(movie))
          .map(movie => [movie.slug, movie])
      ).values()
    );

    const phimHoatHinh = {
      ...hoatHinhData1?.data,
      items: uniqueAnimeMovies
    };

    // Kết hợp dữ liệu
    return {
      ...homeData,
      customSections: {
        phimMoiCapNhat,
        phimChieuRap,
        phimBo,
        phimLe,
        phimHoatHinh,
        // Thêm các thể loại phổ biến
        phimHanhDong: actionMovies?.data || { items: [] },
        phimTinhCam: romanceMovies?.data || { items: [] },
        phimHaiHuoc: comedyMovies?.data || { items: [] }
      }
    };
  } catch (error) {
    console.error("Error fetching home data:", error);
    return {
      status: 'success',
      data: { items: {} },
      customSections: {
        phimMoiCapNhat: { items: [] },
        phimChieuRap: { items: [] },
        phimBo: { items: [] },
        phimLe: { items: [] },
        phimHoatHinh: { items: [] },
        phimHanhDong: { items: [] },
        phimTinhCam: { items: [] },
        phimHaiHuoc: { items: [] }
      }
    };
  }
};

// Get movie by slug
export const getMovieBySlug = async (slug: string) => {
  try {
    return await fetchFromCacheOrAPI(`movie_data/${slug}.json`, `/phim/${slug}`);
  } catch (error) {
    console.error(`Error fetching movie ${slug}:`, error);
    return await fetchAPI(`/phim/${slug}`);
  }
};

// Get movie list by category
export const getMoviesByCategory = async (category: string, page: number = 1) => {
  try {
    // Sử dụng đúng định dạng URL theo API
    return await fetchFromCacheOrAPI(`category_data/${category}_${page}.json`, `/danh-sach/${category}?page=${page}`);
  } catch (error) {
    console.error(`Error fetching category ${category}:`, error);
    return await fetchAPI(`/danh-sach/${category}?page=${page}`);
  }
};

// Get movie list by genre
export const getMoviesByGenre = async (genre: string, page: number = 1) => {
  try {
    // Sử dụng đúng định dạng URL theo API
    const response = await fetchFromCacheOrAPI(`genre_data/${genre}.json`, `/the-loai/${genre}`);

    // Xử lý đặc biệt cho thể loại hoạt hình
    if (genre === 'hoat-hinh') {
      // Lấy thêm dữ liệu từ danh sách phim (nhiều trang)
      const [
        hoatHinh1, hoatHinh2, hoatHinh3,
        phimMoiCapNhat1, phimMoiCapNhat2, phimMoiCapNhat3,
        phimBo1, phimBo2, phimBo3,
        phimLe1, phimLe2, phimLe3
      ] = await Promise.all([
        fetchAPI('/danh-sach/hoat-hinh'),
        fetchAPI('/danh-sach/hoat-hinh?page=2'),
        fetchAPI('/danh-sach/hoat-hinh?page=3'),
        fetchAPI('/danh-sach/phim-moi-cap-nhat'),
        fetchAPI('/danh-sach/phim-moi-cap-nhat?page=2'),
        fetchAPI('/danh-sach/phim-moi-cap-nhat?page=3'),
        fetchAPI('/danh-sach/phim-bo'),
        fetchAPI('/danh-sach/phim-bo?page=2'),
        fetchAPI('/danh-sach/phim-bo?page=3'),
        fetchAPI('/danh-sach/phim-le'),
        fetchAPI('/danh-sach/phim-le?page=2'),
        fetchAPI('/danh-sach/phim-le?page=3')
      ]).catch(() => [null, null, null, null, null, null, null, null, null, null, null, null]);

      // Kết hợp tất cả các phim
      const allMovies = [
        ...(response?.data?.items || []),
        ...(hoatHinh1?.data?.items || []),
        ...(hoatHinh2?.data?.items || []),
        ...(hoatHinh3?.data?.items || []),
        ...(phimMoiCapNhat1?.data?.items || []),
        ...(phimMoiCapNhat2?.data?.items || []),
        ...(phimMoiCapNhat3?.data?.items || []),
        ...(phimBo1?.data?.items || []),
        ...(phimBo2?.data?.items || []),
        ...(phimBo3?.data?.items || []),
        ...(phimLe1?.data?.items || []),
        ...(phimLe2?.data?.items || []),
        ...(phimLe3?.data?.items || [])
      ];

      // Lọc phim hoạt hình
      const animeMovies = allMovies.filter(movie => isAnimeMovie(movie));

      // Loại bỏ các phim trùng lặp
      const uniqueMovies = Array.from(new Map(animeMovies.map(movie =>
        [movie.slug, movie]
      )).values());

      // Cập nhật danh sách phim
      return {
        ...response,
        data: {
          ...response.data,
          items: uniqueMovies,
          params: {
            pagination: {
              totalItems: uniqueMovies.length,
              totalItemsPerPage: 24,
              currentPage: 1,
              pageRanges: Math.ceil(uniqueMovies.length / 24)
            }
          }
        }
      };
    }

    // Xử lý cho các thể loại khác
    if (response && response.data && response.data.items) {
      // Đảm bảo phim thuộc thể loại này
      const filteredItems = response.data.items.filter((movie: any) => {
        if (!movie.category || !Array.isArray(movie.category)) {
          return false;
        }
        return movie.category.some((cat: any) => cat.slug === genre);
      });

      // Cập nhật danh sách phim
      return {
        ...response,
        data: {
          ...response.data,
          items: filteredItems,
          params: {
            pagination: {
              totalItems: filteredItems.length,
              totalItemsPerPage: 24,
              currentPage: 1,
              pageRanges: Math.ceil(filteredItems.length / 24)
            }
          }
        }
      };
    }

    return response;
  } catch (error) {
    console.error(`Error fetching movies for genre ${genre}:`, error);
    return {
      status: 'success',
      data: {
        items: [],
        params: {
          pagination: {
            totalItems: 0,
            totalItemsPerPage: 24,
            currentPage: 1,
            pageRanges: 0
          }
        }
      }
    };
  }
};

// Get movie list by country
export const getMoviesByCountry = async (country: string, page: number = 1) => {
  try {
    // Sử dụng đúng định dạng URL theo API
    const response = await fetchFromCacheOrAPI(`country_data/${country}.json`, `/quoc-gia/${country}`);

    // Lọc phim theo quốc gia
    if (response && response.data && response.data.items) {
      // Đảm bảo phim thuộc quốc gia này
      const filteredItems = response.data.items.filter((movie: any) => {
        if (!movie.country || !Array.isArray(movie.country)) {
          return false;
        }
        return movie.country.some((c: any) => c.slug === country);
      });

      // Cập nhật danh sách phim
      return {
        ...response,
        data: {
          ...response.data,
          items: filteredItems,
          params: {
            pagination: {
              totalItems: filteredItems.length,
              totalItemsPerPage: 24,
              currentPage: 1,
              pageRanges: Math.ceil(filteredItems.length / 24)
            }
          }
        }
      };
    }

    return response;
  } catch (error) {
    console.error(`Error fetching movies for country ${country}:`, error);
    return {
      status: 'success',
      data: {
        items: [],
        params: {
          pagination: {
            totalItems: 0,
            totalItemsPerPage: 24,
            currentPage: 1,
            pageRanges: 0
          }
        }
      }
    };
  }
};



// Get all categories
export const getCategories = async () => {
  try {
    // Lấy danh sách thể loại từ Cloudflare hoặc API
    const response = await fetchFromCacheOrAPI('categories.json', '/the-loai');
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);

    // Trả về danh sách thể loại mặc định nếu có lỗi
    return {
      status: 'success',
      data: [
        { _id: '620a21b2e0fc277084dfd0c5', name: 'Hành Động', slug: 'hanh-dong' },
        { _id: '620a220de0fc277084dfd16d', name: 'Tình Cảm', slug: 'tinh-cam' },
        { _id: '620a221de0fc277084dfd1c1', name: 'Hài Hước', slug: 'hai-huoc' },
        { _id: '620a222fe0fc277084dfd23d', name: 'Cổ Trang', slug: 'co-trang' },
        { _id: '620a2238e0fc277084dfd291', name: 'Tâm Lý', slug: 'tam-ly' },
        { _id: '620a2249e0fc277084dfd2e5', name: 'Hình Sự', slug: 'hinh-su' },
        { _id: '620a2253e0fc277084dfd339', name: 'Chiến Tranh', slug: 'chien-tranh' },
        { _id: '620a225fe0fc277084dfd38d', name: 'Thể Thao', slug: 'the-thao' },
        { _id: '620a2279e0fc277084dfd3e1', name: 'Võ Thuật', slug: 'vo-thuat' },
        { _id: '620a2282e0fc277084dfd435', name: 'Viễn Tưởng', slug: 'vien-tuong' },
        { _id: '620a2293e0fc277084dfd489', name: 'Phiêu Lưu', slug: 'phieu-luu' },
        { _id: '620a229be0fc277084dfd4dd', name: 'Khoa Học', slug: 'khoa-hoc' },
        { _id: '620a22ace0fc277084dfd531', name: 'Kinh Dị', slug: 'kinh-di' },
        { _id: '620a22bae0fc277084dfd585', name: 'Âm Nhạc', slug: 'am-nhac' },
        { _id: '620a22c8e0fc277084dfd5d9', name: 'Thần Thoại', slug: 'than-thoai' },
        { _id: '620e0e64d9648f114cde7728', name: 'Tài Liệu', slug: 'tai-lieu' },
        { _id: '620e4c0b6ba8271c5eef05a8', name: 'Gia Đình', slug: 'gia-dinh' },
        { _id: '620f3d2b91fa4af90ab697fe', name: 'Chính kịch', slug: 'chinh-kich' },
        { _id: '620f84d291fa4af90ab6b3f4', name: 'Bí ẩn', slug: 'bi-an' },
        { _id: '62121e821f1609c9d934585c', name: 'Học Đường', slug: 'hoc-duong' },
        { _id: '6218eb66a2d0f024a9de48d4', name: 'Kinh Điển', slug: 'kinh-dien' },
        { _id: '6242b89cc78eb57bbfe29f91', name: 'Phim 18+', slug: 'phim-18' }
      ]
    };
  }
};

// Fetch data from Cloudflare with fallback to API
export const fetchFromCacheOrAPI = async (key: string, endpoint: string) => {
  return await fetchFromCloudflareOrAPI(key, () => fetchAPI(endpoint));
};

// Get all countries
export const getCountries = async () => {
  try {
    return await fetchFromCacheOrAPI('countries.json', '/quoc-gia');
  } catch (error) {
    console.error("Error fetching countries:", error);
    return await fetchAPI('/quoc-gia');
  }
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
