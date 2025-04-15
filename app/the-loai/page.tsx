import Link from "next/link";

export default function GenrePage() {
  const genres = [
    { name: "Hành Động", slug: "hanh-dong" },
    { name: "Tình Cảm", slug: "tinh-cam" },
    { name: "Hài Hước", slug: "hai-huoc" },
    { name: "Cổ Trang", slug: "co-trang" },
    { name: "Tâm Lý", slug: "tam-ly" },
    { name: "Hình Sự", slug: "hinh-su" },
    { name: "Chiến Tranh", slug: "chien-tranh" },
    { name: "Thể Thao", slug: "the-thao" },
    { name: "Võ Thuật", slug: "vo-thuat" },
    { name: "Viễn Tưởng", slug: "vien-tuong" },
    { name: "Phiêu Lưu", slug: "phieu-luu" },
    { name: "Khoa Học", slug: "khoa-hoc" },
    { name: "Kinh Dị", slug: "kinh-di" },
    { name: "Âm Nhạc", slug: "am-nhac" },
    { name: "Thần Thoại", slug: "than-thoai" },
    { name: "Tài Liệu", slug: "tai-lieu" },
    { name: "Gia Đình", slug: "gia-dinh" },
    { name: "Chính kịch", slug: "chinh-kich" },
    { name: "Bí ẩn", slug: "bi-an" },
    { name: "Học Đường", slug: "hoc-duong" },
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Thể Loại Phim</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {genres.map((genre) => (
            <Link 
              key={genre.slug}
              href={`/the-loai/${genre.slug}`}
              className="bg-gray-800 hover:bg-gray-700 transition-colors p-4 rounded-lg text-center"
            >
              <h2 className="text-lg font-medium text-white">{genre.name}</h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
