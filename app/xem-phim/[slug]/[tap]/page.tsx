import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { getMovieBySlug } from "@/app/lib/api";
import { getImageUrl } from "@/app/lib/utils";
import MoviePlayer from "@/app/components/movie-player";

interface WatchPageProps {
  params: {
    slug: string;
    tap: string;
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

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const data = await getData(params.slug);

  if (!data || !data.item) {
    return {
      title: "Không tìm thấy phim - VenChill",
      description: "Phim không tồn tại hoặc đã bị xóa.",
    };
  }

  const movie = data.item;

  return {
    title: `Xem phim ${movie.name} - Tập ${params.tap} - VenChill`,
    description: movie.content ? movie.content.replace(/<[^>]*>?/gm, '') : "",
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
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

  // Tìm tập phim hiện tại
  let currentEpisode = null;
  let episodeServer = null;
  let episodeIndex = 0;
  let nextEpisode = null;
  let prevEpisode = null;

  if (movie.episodes && movie.episodes.length > 0) {
    // Tìm server và tập phim hiện tại
    for (const server of movie.episodes) {
      const episodeData = server.server_data.find(ep => ep.slug === params.tap);
      if (episodeData) {
        currentEpisode = episodeData;
        episodeServer = server;
        episodeIndex = server.server_data.indexOf(episodeData);
        break;
      }
    }

    // Tìm tập tiếp theo và tập trước
    if (episodeServer) {
      if (episodeIndex > 0) {
        prevEpisode = episodeServer.server_data[episodeIndex - 1];
      }

      if (episodeIndex < episodeServer.server_data.length - 1) {
        nextEpisode = episodeServer.server_data[episodeIndex + 1];
      }
    }
  }

  // Nếu không tìm thấy tập phim, sử dụng tập đầu tiên
  if (!currentEpisode && movie.episodes && movie.episodes.length > 0 && movie.episodes[0].server_data.length > 0) {
    currentEpisode = movie.episodes[0].server_data[0];
    episodeServer = movie.episodes[0];
    episodeIndex = 0;

    if (episodeServer.server_data.length > 1) {
      nextEpisode = episodeServer.server_data[1];
    }
  }

  // Log thông tin để debug
  console.log('Current Episode:', currentEpisode);
  if (currentEpisode) {
    console.log('Video URLs:', {
      m3u8: currentEpisode.link_m3u8,
      embed: currentEpisode.link_embed
    });
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{movie.name}</h1>
            <p className="text-gray-400">
              {currentEpisode ? `Tập ${currentEpisode.name}` : `Tập ${params.tap}`}
            </p>
          </div>
          <div className="flex gap-4">
            <Link href={`/phim/${movie.slug}`} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Chi tiết phim
            </Link>
            <Link href="/" className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Trang chủ
            </Link>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6">
          {currentEpisode ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Giả lập player */}
                <MoviePlayer
                  currentEpisode={currentEpisode}
                  movie={movie}
                  nextEpisode={nextEpisode}
                  prevEpisode={prevEpisode}
                />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
                <p className="text-gray-400">
                  Không tìm thấy tập phim. Vui lòng thử lại sau!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Episode Navigation */}
        <div className="flex justify-between mb-8">
          {prevEpisode ? (
            <Link
              href={`/xem-phim/${movie.slug}/${prevEpisode.slug}`}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Tập trước: {prevEpisode.name}
            </Link>
          ) : (
            <div></div>
          )}

          {nextEpisode ? (
            <Link
              href={`/xem-phim/${movie.slug}/${nextEpisode.slug}`}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2"
            >
              Tập tiếp theo: {nextEpisode.name}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div></div>
          )}
        </div>

        {/* Episode List */}
        {movie.episodes && movie.episodes.length > 0 && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Danh sách tập phim</h3>

            {movie.episodes.map((server) => (
              <div key={server.server_name} className="mb-6">
                <h4 className="text-lg font-medium mb-3">{server.server_name}</h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                  {server.server_data.map((episode) => (
                    <Link
                      key={episode.slug}
                      href={`/xem-phim/${movie.slug}/${episode.slug}`}
                      className={`text-center py-2 text-sm rounded transition-colors ${episode.slug === params.tap ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                    >
                      {episode.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Movie Info */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/4 lg:w-1/5">
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                <Image
                  src={getImageUrl(movie.thumb_url)}
                  alt={movie.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="w-full md:w-3/4 lg:w-4/5">
              <h2 className="text-2xl font-bold text-white mb-2">{movie.name}</h2>
              <p className="text-gray-400 mb-4">{movie.origin_name} ({movie.year})</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {movie.category?.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/the-loai/${cat.slug}`}
                    className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs hover:bg-gray-700"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              {movie.content && (
                <div className="text-gray-300 text-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: movie.content }} />
              )}

              <Link
                href={`/phim/${movie.slug}`}
                className="inline-block mt-4 text-red-500 hover:text-red-400 text-sm"
              >
                Xem thêm thông tin phim
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
