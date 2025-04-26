import { Metadata } from "next";
import { getMoviesByCategory } from "@/app/lib/api";
import { MovieGrid } from "@/app/components/movie-grid";
import { Pagination } from "@/app/components/pagination";
import { STATIC_LIST_PAGES } from "@/app/lib/static-params";

// Tiêu đề cho các danh mục
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

interface ListPageProps {
  params: {
    slug: string;
    page: string;
  };
}

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
export async function generateStaticParams() {
  // Trả về danh sách các slug và page để tạo trước các trang này
  return STATIC_LIST_PAGES;
}

export async function generateMetadata({ params }: ListPageProps): Promise<Metadata> {
  const title = CATEGORY_TITLES[params.slug] || "Danh sách phim";
  const page = params.page || "1";

  return {
    title: `${title} - Trang ${page} - VenChill`,
    description: `Danh sách ${title.toLowerCase()} mới nhất, trang ${page}, chất lượng cao tại VenChill.`,
  };
}

export default async function ListPageWithPagination({ params }: ListPageProps) {
  // Chuyển đổi tham số trang thành số
  const currentPage = parseInt(params.page) || 1;

  // Nếu là trang 1, chuyển hướng đến trang danh sách chính
  if (currentPage === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Đang chuyển hướng...</h1>
          <p className="text-gray-400">
            Đang chuyển hướng đến trang danh sách chính.
          </p>
          {/* Script chuyển hướng */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.location.href = "/danh-sach/${params.slug}";
              `,
            }}
          />
        </div>
      </div>
    );
  }

  // Lấy dữ liệu cho trang hiện tại
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
            Tổng cộng {data.params.pagination.totalItems} phim - Trang {currentPage}/{totalPages}
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
