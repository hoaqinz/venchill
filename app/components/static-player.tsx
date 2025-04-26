import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/app/lib/utils";

interface StaticPlayerProps {
  currentEpisode: any;
  movie: any;
  nextEpisode?: any;
  prevEpisode?: any;
}

export default function StaticPlayer({ currentEpisode, movie, nextEpisode, prevEpisode }: StaticPlayerProps) {
  // Xác định URL video và loại video
  const getVideoInfo = () => {
    // Kiểm tra nếu có link embed
    if (currentEpisode?.link_embed) {
      // Nếu là iframe HTML, trích xuất src
      if (currentEpisode.link_embed.includes('<iframe')) {
        const srcMatch = currentEpisode.link_embed.match(/src=['"]([^'"]+)['"]/);
        if (srcMatch && srcMatch[1]) {
          return { url: srcMatch[1], type: 'iframe' };
        }
      }
      // Nếu là URL trực tiếp
      return { url: currentEpisode.link_embed, type: 'iframe' };
    }

    // Kiểm tra nếu có link m3u8
    if (currentEpisode?.link_m3u8) {
      return { url: currentEpisode.link_m3u8, type: 'm3u8' };
    }

    return { url: "", type: 'unknown' };
  };

  const { url: videoUrl, type: videoType } = getVideoInfo();
  const posterUrl = movie?.poster_url || movie?.thumb_url || "";

  return (
    <div className="relative w-full h-full bg-black">
      {videoUrl ? (
        <>
          {/* Video Player */}
          {videoType === 'iframe' ? (
            // Iframe Player
            <iframe
              src={videoUrl}
              className="w-full h-full border-0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : videoType === 'm3u8' ? (
            // Fallback for m3u8: Show a message with direct link
            <div className="flex items-center justify-center h-full flex-col p-4">
              <div className="bg-black/80 p-6 rounded-lg text-center backdrop-blur-md max-w-md">
                <h3 className="text-white font-bold text-xl mb-4">
                  Không thể phát video trực tiếp
                </h3>
                <p className="text-gray-300 mb-4">
                  Trình duyệt của bạn không hỗ trợ phát video HLS trực tiếp.
                </p>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md inline-block"
                >
                  Mở video trong tab mới
                </a>
              </div>
            </div>
          ) : (
            // Unknown video type
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-white text-xl font-bold mb-4">
                  Không tìm thấy nguồn phát
                </p>
                <p className="text-gray-400 text-sm">
                  Rất tiếc, không tìm thấy nguồn phát cho tập phim này.
                </p>
              </div>
            </div>
          )}

          {/* Next Episode Button */}
          {nextEpisode && (
            <div className="absolute top-4 right-4 z-50">
              <Link
                href={`/xem-phim/${movie?.slug || ''}/${nextEpisode?.slug || ''}`}
                className="bg-red-600/80 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-300 backdrop-blur-sm"
              >
                Tập tiếp theo
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </>
      ) : (
        // No video URL
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-white text-xl font-bold mb-4">
              Không tìm thấy nguồn phát
            </p>
            <p className="text-gray-400 text-sm">
              Rất tiếc, không tìm thấy nguồn phát cho tập phim này.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
