"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/app/lib/utils";

// Định nghĩa kiểu dữ liệu cho kết quả tìm kiếm
interface Movie {
  _id?: string;
  name: string;
  origin_name: string;
  slug: string;
  thumb_url: string;
  poster_url?: string;
  episode_current?: string;
  quality?: string;
  lang?: string;
  year?: number;
}

interface SearchResult {
  items: Movie[];
  params: {
    pagination: {
      totalItems: number;
      totalItemsPerPage: number;
      currentPage: number;
      pageRanges: number;
    };
  };
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [searchQuery, setSearchQuery] = useState(keyword);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm tìm kiếm phim
  const searchMovies = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Gọi API tìm kiếm
      const response = await fetch(`/api/search?keyword=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error(`Lỗi tìm kiếm: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Lỗi khi tìm kiếm:", err);
      setError("Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý sự kiện tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tim-kiem?keyword=${encodeURIComponent(searchQuery)}`);
      searchMovies(searchQuery);
    }
  };

  // Tìm kiếm khi keyword thay đổi
  useEffect(() => {
    if (keyword) {
      searchMovies(keyword);
    }
  }, [keyword]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Tìm Kiếm Phim</h1>

        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Nhập tên phim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Tìm Kiếm
            </button>
          </form>
        </div>

        {keyword ? (
          <div>
            <h2 className="text-xl font-bold mb-6">Kết quả tìm kiếm cho: "{keyword}"</h2>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-400 mt-4">Đang tìm kiếm...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <p className="text-gray-400">
                  Vui lòng thử lại với từ khóa khác hoặc quay lại sau.
                </p>
              </div>
            ) : searchResults && searchResults.items.length > 0 ? (
              <div>
                <p className="text-gray-400 mb-6">
                  Tìm thấy {searchResults.params.pagination.totalItems} kết quả
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {searchResults.items.map((movie) => (
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
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">
                  Không tìm thấy kết quả nào cho "{keyword}".
                </p>
                <p className="text-gray-500">
                  Vui lòng thử lại với từ khóa khác.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">
              Nhập từ khóa vào ô tìm kiếm để bắt đầu tìm kiếm phim.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
