import { Metadata } from "next";
import { getMoviesByCountry, getCountries } from "@/app/lib/api";
import { MovieGrid } from "@/app/components/movie-grid";
import { Pagination } from "@/app/components/pagination";

interface CountryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

async function getData(slug: string, page: number = 1) {
  try {
    const response = await getMoviesByCountry(slug, page);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movies for country ${slug}:`, error);
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

async function getCountryName(slug: string) {
  try {
    const response = await getCountries();
    const country = response.data.find((c) => c.slug === slug);
    return country ? country.name : "Quốc gia";
  } catch (error) {
    console.error("Error fetching countries:", error);
    return "Quốc gia";
  }
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const countryName = await getCountryName(params.slug);
  
  return {
    title: `Phim ${countryName} - VenChill`,
    description: `Danh sách phim ${countryName.toLowerCase()} mới nhất, chất lượng cao tại VenChill.`,
  };
}

export default async function CountryPage({ params, searchParams }: CountryPageProps) {
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const data = await getData(params.slug, currentPage);
  const countryName = await getCountryName(params.slug);
  
  const totalPages = Math.ceil(
    data.params.pagination.totalItems / data.params.pagination.totalItemsPerPage
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Phim {countryName}</h1>
          <p className="text-gray-400 mt-2">
            Tổng cộng {data.params.pagination.totalItems} phim
          </p>
        </div>
        
        <MovieGrid movies={data.items} />
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl={`/quoc-gia/${params.slug}`}
        />
      </div>
    </div>
  );
}
