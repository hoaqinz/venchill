// Danh sách các slug cho các trang tĩnh
// Thêm tất cả các slug phim phổ biến và các slug được yêu cầu cụ thể
export const STATIC_MOVIE_SLUGS = [
  // Marvel movies
  'nguoi-nhen-du-hanh-vu-tru-nhen',
  'nguoi-nhen-khong-con-nha',
  'nguoi-nhen-xa-nha',
  'nguoi-nhen-tro-ve-nha',
  'nguoi-sat',
  'nguoi-sat-2',
  'nguoi-sat-3',
  'nguoi-kien',
  'nguoi-kien-va-chien-binh-ong-the-gioi-luong-tu',
  'thor-tinh-yeu-va-sam-set',
  'black-panther-wakanda-bat-diet',
  'doctor-strange-da-vu-tru-hon-loan',
  'shang-chi-va-huyen-thoai-thap-nhan',
  'venom-doi-mat-tu-than',

  // DC movies
  'nguoi-doi-dau-tien',
  'nguoi-vo-hoan-hao',

  // Action movies
  'biet-doi-danh-thue',
  'ke-huy-diet',
  'sieu-anh-hung',

  // Specific requested movies
  'toi-co-the-thay-truoc-ti-le-thanh-cong',
  'muc-than-ky',
  'cau-be-chuot-chui-cao-va-ngua',

  // Add more popular movies to avoid future errors
  'oppenheimer',
  'barbie',
  'fast-and-furious-x',
  'mission-impossible-dead-reckoning-part-one',
  'john-wick-chapter-4',
  'the-flash',
  'transformers-rise-of-the-beasts',
  'guardians-of-the-galaxy-vol-3',
  'the-little-mermaid',
  'spider-man-across-the-spider-verse',
  'the-super-mario-bros-movie',
  'ant-man-and-the-wasp-quantumania',
  'creed-iii',
  'the-hunger-games-the-ballad-of-songbirds-and-snakes',
  'napoleon',
  'aquaman-and-the-lost-kingdom',
  'the-marvels',
  'blue-beetle',
  'haunted-mansion',
  'indiana-jones-and-the-dial-of-destiny',
];

// Tạo danh sách các slug tập phim từ danh sách slug phim
export const STATIC_EPISODE_SLUGS = STATIC_MOVIE_SLUGS.map(slug => ({ slug, tap: '1' }));

export const STATIC_CATEGORY_SLUGS = [
  'hanh-dong',
  'tinh-cam',
  'hai-huoc',
  'co-trang',
  'tam-ly',
  'hinh-su',
  'chien-tranh',
  'the-thao',
  'am-nhac',
  'khoa-hoc',
  'vien-tuong',
  'phieu-luu',
  'kinh-di',
  'hoat-hinh',
];

export const STATIC_COUNTRY_SLUGS = [
  'viet-nam',
  'trung-quoc',
  'han-quoc',
  'nhat-ban',
  'thai-lan',
  'au-my',
];

// Tạo danh sách các slug và trang cho danh mục
// Mỗi danh mục sẽ có 3 trang
export const STATIC_LIST_PAGES = [];
const LIST_SLUGS = [
  'phim-moi-cap-nhat',
  'phim-bo',
  'phim-le',
  'hoat-hinh',
  'tv-shows',
  'phim-vietsub',
  'phim-thuyet-minh',
  'phim-long-tieng',
  'phim-bo-dang-chieu',
  'phim-bo-hoan-thanh',
  'phim-sap-chieu',
  'subteam',
];

// Tạo danh sách các trang cho mỗi danh mục
for (const slug of LIST_SLUGS) {
  // Tạo trang đầu tiên (không có tham số page)
  STATIC_LIST_PAGES.push({ slug });

  // Tạo các trang 1, 2, 3 với tham số page
  for (let page = 1; page <= 3; page++) {
    STATIC_LIST_PAGES.push({ slug, page: page.toString() });
  }
}

// Giữ lại danh sách slug đơn giản cho các trường hợp khác
export const STATIC_LIST_SLUGS = LIST_SLUGS;
