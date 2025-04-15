import { Metadata } from "next";
import { getMoviesByGenre, getCategories } from "@/app/lib/api";
import { MovieGrid } from "@/app/components/movie-grid";
import { Pagination } from "@/app/components/pagination";

interface GenrePageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
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
import { STATIC_CATEGORY_SLUGS } from "@/app/lib/static-params";

export async function generateStaticParams() {
  // Trả về danh sách các slug của thể loại để tạo trước các trang này
  return STATIC_CATEGORY_SLUGS.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: GenrePageProps): Promise<Metadata> {
  const categoryName = await getCategoryName(params.slug);

  return {
    title: `Phim ${categoryName} - VenChill`,
    description: `Danh sách phim ${categoryName.toLowerCase()} mới nhất, chất lượng cao tại VenChill.`,
  };
}

export default async function GenrePage({ params, searchParams }: GenrePageProps) {
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
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
            Tổng cộng {data.params.pagination.totalItems} phim
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
