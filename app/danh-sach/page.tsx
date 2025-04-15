import Link from "next/link";

export default function ListPage() {
  const categories = [
    { name: "Phim Mới Cập Nhật", slug: "phim-moi-cap-nhat" },
    { name: "Phim Bộ", slug: "phim-bo" },
    { name: "Phim Lẻ", slug: "phim-le" },
    { name: "Phim Hoạt Hình", slug: "hoat-hinh" },
    { name: "TV Shows", slug: "tv-shows" },
    { name: "Phim Vietsub", slug: "phim-vietsub" },
    { name: "Phim Thuyết Minh", slug: "phim-thuyet-minh" },
    { name: "Phim Lồng Tiếng", slug: "phim-long-tieng" },
    { name: "Phim Bộ Đang Chiếu", slug: "phim-bo-dang-chieu" },
    { name: "Phim Bộ Hoàn Thành", slug: "phim-bo-hoan-thanh" },
    { name: "Phim Sắp Chiếu", slug: "phim-sap-chieu" },
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Danh Sách Phim</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.slug}
              href={`/danh-sach/${category.slug}`}
              className="bg-gray-800 hover:bg-gray-700 transition-colors p-6 rounded-lg text-center"
            >
              <h2 className="text-xl font-semibold text-white">{category.name}</h2>
              <p className="mt-2 text-sm text-gray-400">Xem danh sách</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
