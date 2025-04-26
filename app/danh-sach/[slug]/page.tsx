import { Metadata } from "next";
import { getMoviesByCategory } from "@/app/lib/api";
import { MovieGrid } from "@/app/components/movie-grid";
import { Pagination } from "@/app/components/pagination";

interface ListPageProps {
  params: {
    slug: string;
  };
}

const CATEGORY_TITLES: Record<string, string> = {
  "phim-moi-cap-nhat": "Phim Mới Cập Nhật",
  "phim-bo": "Phim Bộ",
  "phim-le": "Phim Lẻ",
  "hoat-hinh": "Phim Hoạt Hình",
  "tv-shows": "TV Shows",
  "phim-vietsub": "Phim Vietsub",
  "phim-thuyet-minh": "Phim Thuyết Minh",
  "phim-long-tieng": "Phim Lồng Tiếng",
  "phim-bo-dang-chieu": "Phim Bộ Đang Chiếu",
  "phim-bo-hoan-thanh": "Phim Bộ Hoàn Thành",
  "phim-sap-chieu": "Phim Sắp Chiếu",
  "subteam": "Phim Subteam",
};

async function getData(slug: string, page: number = 1) {
  try {
    const response = await getMoviesByCategory(slug, page);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movies for category ${slug}:`, error);
    return {
      items: [],
      params: {
        pagination: {
          totalItems: 0,
          totalItemsPerPage: 24,
          currentPage: 1,
          pageRanges: 0,
        },
      },
    };
  }
}

// Khi sử dụng output: 'export', cần có hàm generateStaticParams
import { STATIC_LIST_SLUGS, STATIC_LIST_PAGES } from "@/app/lib/static-params";

export async function generateStaticParams() {
  // Trả về danh sách các slug của danh mục để tạo trước các trang này
  // Chỉ tạo trang đầu tiên cho mỗi danh mục
  return STATIC_LIST_SLUGS.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: ListPageProps): Promise<Metadata> {
  const title = CATEGORY_TITLES[params.slug] || "Danh sách phim";

  return {
    title: `${title} - VenChill`,
    description: `Danh sách ${title.toLowerCase()} mới nhất, chất lượng cao tại VenChill.`,
  };
}

export default async function ListPage({ params }: ListPageProps) {
  // Luôn sử dụng trang 1 cho trang danh sách chính
  const currentPage = 1;
  const data = await getData(params.slug, currentPage);
  const title = CATEGORY_TITLES[params.slug] || "Danh sách phim";

  const totalPages = Math.ceil(
    data.params.pagination.totalItems / data.params.pagination.totalItemsPerPage
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="text-gray-400 mt-2">
            Tổng cộng {data.params.pagination.totalItems} phim
          </p>
        </div>

        <MovieGrid movies={data.items} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl={`/danh-sach/${params.slug}`}
        />
      </div>
    </div>
  );
}
