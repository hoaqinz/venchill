import { Metadata } from "next";
import { getMoviesByGenre, getCategories } from "@/app/lib/api";
import { MovieGrid } from "@/app/components/movie-grid";
import { Pagination } from "@/app/components/pagination";
import { STATIC_CATEGORY_PAGES } from "@/app/lib/static-params";

interface GenrePageProps {
  params: {
    slug: string;
    page: string;
  };
}

async function getData(slug: string, page: number = 1) {
  try {
    const response = await getMoviesByGenre(slug, page);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movies for genre ${slug}:`, error);
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

async function getCategoryName(slug: string) {
  try {
    const response = await getCategories();
    const category = response.data.find((cat) => cat.slug === slug);
    return category ? category.name : "Thể loại phim";
  } catch (error) {
    console.error("Error fetching categories:", error);
    return "Thể loại phim";
  }
}

// Khi sử dụng output: 'export', cần có hàm generateStaticParams
export async function generateStaticParams() {
  // Trả về danh sách các slug và page để tạo trước các trang này
  // Chỉ trả về các mục có tham số page (không phải trang đầu tiên)
  return STATIC_CATEGORY_PAGES.filter(item => item.page !== undefined);
}

export async function generateMetadata({ params }: GenrePageProps): Promise<Metadata> {
  const categoryName = await getCategoryName(params.slug);
  const page = params.page || "1";

  return {
    title: `Phim ${categoryName} - Trang ${page} - VenChill`,
    description: `Danh sách phim ${categoryName.toLowerCase()} mới nhất, trang ${page}, chất lượng cao tại VenChill.`,
  };
}

export default async function GenrePageWithPagination({ params }: GenrePageProps) {
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
                window.location.href = "/the-loai/${params.slug}";
              `,
            }}
          />
        </div>
      </div>
    );
  }

  // Lấy dữ liệu cho trang hiện tại
  const data = await getData(params.slug, currentPage);
  const categoryName = await getCategoryName(params.slug);

  const totalPages = Math.ceil(
    data.params.pagination.totalItems / data.params.pagination.totalItemsPerPage
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Phim {categoryName}</h1>
          <p className="text-gray-400 mt-2">
            Tổng cộng {data.params.pagination.totalItems} phim - Trang {currentPage}/{totalPages}
          </p>
        </div>

        <MovieGrid movies={data.items} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl={`/the-loai/${params.slug}`}
        />
      </div>
    </div>
  );
}
