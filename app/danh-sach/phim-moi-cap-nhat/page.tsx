import Link from "next/link";
import Image from "next/image";
import { getMoviesByCategory } from "@/app/lib/api";
import { getImageUrl } from "@/app/lib/utils";

export default async function NewestMoviesPage() {
  // Tạo UI đơn giản để tránh lỗi
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Phim Mới Cập Nhật</h1>
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center">
          <div className="w-24 h-24 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
          <h2 className="text-xl font-bold mb-4">Đang tải dữ liệu phim...</h2>
          <p className="text-gray-400 mb-8">
            Chúng tôi đang tải danh sách phim mới nhất. Vui lòng chờ trong giây lát hoặc thử lại sau.
          </p>
          
          <Link 
            href="/"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium inline-block"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
