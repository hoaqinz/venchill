"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [searchQuery, setSearchQuery] = useState(keyword);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tim-kiem?keyword=${encodeURIComponent(searchQuery)}`);
    }
  };

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
          <div className="text-center py-12">
            <h2 className="text-xl font-bold mb-4">Kết quả tìm kiếm cho: "{keyword}"</h2>
            <p className="text-gray-400 mb-8">
              Chức năng tìm kiếm đang được phát triển. Vui lòng quay lại sau!
            </p>
            <div className="w-24 h-24 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
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
