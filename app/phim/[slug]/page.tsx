import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { getMovieBySlug, getMoviesByCategory } from "@/app/lib/api";
import { getImageUrl } from "@/app/lib/utils";

interface MoviePageProps {
  params: {
    slug: string;
  };
}

async function getData(slug: string) {
  try {
    const response = await getMovieBySlug(slug);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie data:", error);
    return null;
  }
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const data = await getData(params.slug);

  if (!data || !data.item) {
    return {
      title: "Không tìm thấy phim - VenChill",
      description: "Phim không tồn tại hoặc đã bị xóa.",
    };
  }

  const movie = data.item;

  return {
    title: `${movie.name} (${movie.origin_name}) - VenChill`,
    description: movie.content ? movie.content.replace(/<[^>]*>?/gm, '') : "",
    openGraph: {
      images: [getImageUrl(movie.poster_url || movie.thumb_url)],
    },
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const data = await getData(params.slug);

  if (!data || !data.item) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Không tìm thấy phim</h1>
          <p className="text-gray-400 mb-8">Phim không tồn tại hoặc đã bị xóa.</p>
          <Link
            href="/"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium inline-block"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const movie = data.item;

  // Lấy phim liên quan
  let relatedMovies = [];
  if (movie.category && movie.category.length > 0) {
    try {
      const relatedResponse = await getMoviesByCategory('phim-moi-cap-nhat');
      relatedMovies = relatedResponse?.data?.items || [];
      // Lọc bỏ phim hiện tại
      relatedMovies = relatedMovies.filter(m => m._id !== movie._id).slice(0, 6);
    } catch (error) {
      console.error("Error fetching related movies:", error);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Movie Banner */}
      <div className="relative h-[50vh] min-h-[400px]">
        <Image
          src={getImageUrl(movie.poster_url || movie.thumb_url)}
          alt={movie.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 -mt-32 relative z-10">
          {/* Movie Poster */}
          <div className="w-full md:w-1/4 lg:w-1/5">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-xl">
              <Image
                src={getImageUrl(movie.thumb_url)}
                alt={movie.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Watch Button */}
            <Link href={`/xem-phim/${movie.slug}/1`} className="w-full block mt-4">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 py-4 rounded-md font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Xem Phim
              </button>
            </Link>
          </div>

          {/* Movie Info */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {movie.name}
            </h1>
            <h2 className="text-xl text-gray-300 mb-4">
              {movie.origin_name} ({movie.year})
            </h2>

            {/* Movie Meta */}
            <div className="flex flex-wrap gap-4 mb-6">
              {movie.time && (
                <div className="flex items-center gap-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {movie.time}
                </div>
              )}

              {movie.episode_current && (
                <div className="flex items-center gap-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                  {movie.episode_current}
                </div>
              )}

              {movie.year && (
                <div className="flex items-center gap-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {movie.year}
                </div>
              )}

              {movie.quality && (
                <div className="flex items-center gap-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  {movie.quality}
                </div>
              )}

              {movie.lang && (
                <div className="flex items-center gap-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  {movie.lang}
                </div>
              )}
            </div>

            {/* Categories */}
            {movie.category && movie.category.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Thể loại
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.category.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/the-loai/${cat.slug}`}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Countries */}
            {movie.country && movie.country.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  Quốc gia
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.country.map((country) => (
                    <Link
                      key={country.id}
                      href={`/quoc-gia/${country.slug}`}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700"
                    >
                      {country.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Cast */}
            {movie.actor && movie.actor.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Diễn viên
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.actor.map((actor, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {movie.content && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2">Nội dung phim</h3>
                <div className="text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: movie.content }} />
              </div>
            )}
          </div>
        </div>

        {/* Episode List */}
        {movie.type !== "single" && movie.episodes && movie.episodes.length > 0 && (
          <div className="mt-8 bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Danh sách tập phim</h3>

            {movie.episodes.map((server) => (
              <div key={server.server_name} className="mb-6">
                <h4 className="text-lg font-medium mb-3">{server.server_name}</h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                  {server.server_data.map((episode) => (
                    <Link
                      key={episode.slug}
                      href={`/xem-phim/${movie.slug}/${episode.slug}`}
                      className="text-center py-2 text-sm rounded transition-colors bg-gray-800 text-gray-300 hover:bg-gray-700"
                    >
                      {episode.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Related Movies */}
        {relatedMovies.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-white">Phim Liên Quan</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedMovies.map((movie) => (
                <Link key={movie._id} href={`/phim/${movie.slug}`} className="group">
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
          </div>
        )}
      </div>
    </div>
  );
}
