import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-red-600">404</h1>
        <h2 className="text-3xl font-bold text-white mt-4 mb-6">Trang không tồn tại</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
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
