import Link from "next/link";
import Image from "next/image";
import { getHomeData } from "@/app/lib/api";
import { getImageUrl } from "@/app/lib/utils";

async function getData() {
  try {
    // Lấy dữ liệu phim từ API đã cập nhật
    const homeData = await getHomeData();

    if (!homeData || !homeData.customSections) {
      console.error("Invalid home data structure:", homeData);
      // Trả về dữ liệu mẫu nếu không lấy được dữ liệu từ API
      return {
        phimMoiCapNhat: [],
        phimChieuRap: [],
        phimBo: [],
        phimLe: [],
        phimHoatHinh: [],
        phimHanhDong: [],
        phimTinhCam: [],
        phimHaiHuoc: [],
        trendingMovies: []
      };
    }

    // Lấy dữ liệu từ các chuyên mục
    const phimMoiCapNhat = homeData?.customSections?.phimMoiCapNhat?.items || [];
    const phimChieuRap = homeData?.customSections?.phimChieuRap?.items || [];
    const phimBo = homeData?.customSections?.phimBo?.items || [];
    const phimLe = homeData?.customSections?.phimLe?.items || [];
    const phimHoatHinh = homeData?.customSections?.phimHoatHinh?.items || [];

    // Lấy dữ liệu từ các thể loại phổ biến
    const phimHanhDong = homeData?.customSections?.phimHanhDong?.items || [];
    const phimTinhCam = homeData?.customSections?.phimTinhCam?.items || [];
    const phimHaiHuoc = homeData?.customSections?.phimHaiHuoc?.items || [];

    // Lấy phim đề xuất từ API
    const phimDeXuat = homeData?.data?.items?.phim_de_cu || [];

    // Tạo danh sách phim trending từ phim đề xuất hoặc phim mới cập nhật
    const trendingMovies = phimDeXuat.length > 0 ? phimDeXuat : phimMoiCapNhat.slice(0, 10);

    return {
      phimMoiCapNhat: phimMoiCapNhat.slice(0, 16),
      phimChieuRap: phimChieuRap.slice(0, 16),
      phimBo: phimBo.slice(0, 16),
      phimLe: phimLe.slice(0, 16),
      phimHoatHinh: phimHoatHinh.slice(0, 16),
      phimHanhDong: phimHanhDong.slice(0, 16),
      phimTinhCam: phimTinhCam.slice(0, 16),
      phimHaiHuoc: phimHaiHuoc.slice(0, 16),
      trendingMovies: trendingMovies.slice(0, 10)
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    // Trả về mảng rỗng để tránh lỗi
    return {
      phimMoiCapNhat: [],
      phimChieuRap: [],
      phimBo: [],
      phimLe: [],
      phimHoatHinh: [],
      phimHanhDong: [],
      phimTinhCam: [],
      phimHaiHuoc: [],
      trendingMovies: []
    };
  }
}

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  // Wrap in try-catch to handle any errors
  try {
    const {
      phimMoiCapNhat,
      phimChieuRap,
      phimBo,
      phimLe,
      phimHoatHinh,
      phimHanhDong,
      phimTinhCam,
      phimHaiHuoc,
      trendingMovies
    } = await getData();

    // Lấy phim nổi bật cho hero section
    const heroMovie = trendingMovies[0] || phimMoiCapNhat[0];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Giống Netflix */}
      {heroMovie && (
        <div className="relative h-[80vh] min-h-[600px] w-full">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={getImageUrl(heroMovie.poster_url || heroMovie.thumb_url)}
              alt={heroMovie.name}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
                {heroMovie.name}
              </h1>
              <p className="text-xl text-gray-300 mb-4 drop-shadow-md">
                {heroMovie.origin_name} ({heroMovie.year})
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {heroMovie.category?.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/the-loai/${cat.slug}`}
                    className="text-xs bg-red-600/80 text-white px-2 py-1 rounded"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              <p className="text-gray-300 mb-8 line-clamp-3 text-lg">
                {heroMovie.content ? heroMovie.content.replace(/<[^>]*>?/gm, '') : ""}
              </p>

              <div className="flex gap-4">
                <Link href={`/phim/${heroMovie.slug}`} className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-md font-medium text-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Xem Ngay
                </Link>
                <Link href={`/phim/${heroMovie.slug}`} className="bg-gray-800/80 hover:bg-gray-700 text-white px-8 py-4 rounded-md font-medium text-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Chi Tiết
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Trending Movies - Slider giống Netflix */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Phim Đang Hot</h2>
          <div className="relative overflow-hidden">
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
              {trendingMovies.map((movie) => (
                <Link key={movie._id} href={`/phim/${movie.slug}`} className="flex-shrink-0 w-[250px] group">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                    <Image
                      src={getImageUrl(movie.thumb_url)}
                      alt={movie.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-white line-clamp-1 group-hover:text-red-500 transition-colors">
                        {movie.name}
                      </h3>
                      <p className="text-xs text-gray-300 mt-1">{movie.origin_name}</p>
                    </div>

                    {/* Episode badge */}
                    {movie.episode_current && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                        {movie.episode_current}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Phim Mới Cập Nhật */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Phim Mới Cập Nhật</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {phimMoiCapNhat.slice(0, 16).map((movie) => (
              <Link key={movie._id || movie.slug} href={`/phim/${movie.slug}`} className="group">
                <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                  <Image
                    src={getImageUrl(movie.thumb_url)}
                    alt={movie.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-red-500 transition-colors">
                      {movie.name}
                    </h3>
                    <p className="text-xs text-gray-300 mt-1 line-clamp-1">{movie.origin_name}</p>
                  </div>

                  {/* Episode badge */}
                  {movie.episode_current && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      {movie.episode_current}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/danh-sach/phim-moi-cap-nhat" className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium">
              Xem thêm
            </Link>
          </div>
        </div>

        {/* Phim Chiếu Rạp */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Phim Chiếu Rạp</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {phimChieuRap.slice(0, 16).map((movie) => (
              <Link key={movie._id || movie.slug} href={`/phim/${movie.slug}`} className="group">
                <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                  <Image
                    src={getImageUrl(movie.thumb_url)}
                    alt={movie.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-red-500 transition-colors">
                      {movie.name}
                    </h3>
                    <p className="text-xs text-gray-300 mt-1 line-clamp-1">{movie.origin_name}</p>
                  </div>

                  {/* Episode badge */}
                  {movie.episode_current && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      {movie.episode_current}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/danh-sach/phim-chieu-rap" className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium">
              Xem thêm
            </Link>
          </div>
        </div>

        {/* Phim Bộ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Phim Bộ</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {phimBo.slice(0, 16).map((movie) => (
              <Link key={movie._id || movie.slug} href={`/phim/${movie.slug}`} className="group">
                <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                  <Image
                    src={getImageUrl(movie.thumb_url)}
                    alt={movie.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-red-500 transition-colors">
                      {movie.name}
                    </h3>
                    <p className="text-xs text-gray-300 mt-1 line-clamp-1">{movie.origin_name}</p>
                  </div>

                  {/* Episode badge */}
                  {movie.episode_current && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      {movie.episode_current}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/danh-sach/phim-bo" className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium">
              Xem thêm
            </Link>
          </div>
        </div>

        {/* Phim Lẻ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Phim Lẻ</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {phimLe.slice(0, 16).map((movie) => (
              <Link key={movie._id || movie.slug} href={`/phim/${movie.slug}`} className="group">
                <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                  <Image
                    src={getImageUrl(movie.thumb_url)}
                    alt={movie.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-red-500 transition-colors">
                      {movie.name}
                    </h3>
                    <p className="text-xs text-gray-300 mt-1 line-clamp-1">{movie.origin_name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/danh-sach/phim-le" className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium">
              Xem thêm
            </Link>
          </div>
        </div>

        {/* Phim Hoạt Hình */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Phim Hoạt Hình</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {phimHoatHinh.slice(0, 16).map((movie) => (
              <Link key={movie._id || movie.slug} href={`/phim/${movie.slug}`} className="group">
                <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                  <Image
                    src={getImageUrl(movie.thumb_url)}
                    alt={movie.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-red-500 transition-colors">
                      {movie.name}
                    </h3>
                    <p className="text-xs text-gray-300 mt-1 line-clamp-1">{movie.origin_name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/danh-sach/hoat-hinh" className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium">
              Xem thêm
            </Link>
          </div>
        </div>

        {/* Phim Hành Động */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Phim Hành Động</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {phimHanhDong.slice(0, 16).map((movie) => (
              <Link key={movie._id || movie.slug} href={`/phim/${movie.slug}`} className="group">
                <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                  <Image
                    src={getImageUrl(movie.thumb_url)}
                    alt={movie.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-red-500 transition-colors">
                      {movie.name}
                    </h3>
                    <p className="text-xs text-gray-300 mt-1 line-clamp-1">{movie.origin_name}</p>
                  </div>

                  {/* Episode badge */}
                  {movie.episode_current && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      {movie.episode_current}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/the-loai/hanh-dong" className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium">
              Xem thêm
            </Link>
          </div>
        </div>

        {/* Phim Tình Cảm */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Phim Tình Cảm</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {phimTinhCam.slice(0, 16).map((movie) => (
              <Link key={movie._id || movie.slug} href={`/phim/${movie.slug}`} className="group">
                <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                  <Image
                    src={getImageUrl(movie.thumb_url)}
                    alt={movie.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-red-500 transition-colors">
                      {movie.name}
                    </h3>
                    <p className="text-xs text-gray-300 mt-1 line-clamp-1">{movie.origin_name}</p>
                  </div>

                  {/* Episode badge */}
                  {movie.episode_current && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      {movie.episode_current}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/the-loai/tinh-cam" className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium">
              Xem thêm
            </Link>
          </div>
        </div>

        {/* Phim Hài Hước */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Phim Hài Hước</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {phimHaiHuoc.slice(0, 16).map((movie) => (
              <Link key={movie._id || movie.slug} href={`/phim/${movie.slug}`} className="group">
                <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                  <Image
                    src={getImageUrl(movie.thumb_url)}
                    alt={movie.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-red-500 transition-colors">
                      {movie.name}
                    </h3>
                    <p className="text-xs text-gray-300 mt-1 line-clamp-1">{movie.origin_name}</p>
                  </div>

                  {/* Episode badge */}
                  {movie.episode_current && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      {movie.episode_current}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/the-loai/hai-huoc" className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium">
              Xem thêm
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Khám Phá Theo Danh Mục</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Link href="/danh-sach" className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white p-6 rounded-lg text-center transition-all duration-300 transform hover:scale-105">
              <h3 className="text-xl font-bold">Danh Sách Phim</h3>
              <p className="text-sm mt-2 text-gray-200">Tất cả các danh mục phim</p>
            </Link>

            <Link href="/the-loai" className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white p-6 rounded-lg text-center transition-all duration-300 transform hover:scale-105">
              <h3 className="text-xl font-bold">Thể Loại</h3>
              <p className="text-sm mt-2 text-gray-200">Phim theo thể loại</p>
            </Link>

            <Link href="/quoc-gia" className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white p-6 rounded-lg text-center transition-all duration-300 transform hover:scale-105">
              <h3 className="text-xl font-bold">Quốc Gia</h3>
              <p className="text-sm mt-2 text-gray-200">Phim theo quốc gia</p>
            </Link>


          </div>
        </div>
      </div>
    </div>
  );
  } catch (error) {
    console.error("Error rendering home page:", error);
    // Fallback UI in case of error
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-red-600 mb-4">VenChill</h1>
        <p className="text-white text-center mb-8">Đang tải dữ liệu phim, vui lòng đợi trong giây lát...</p>
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
}
