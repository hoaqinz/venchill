"use client";

import { Movie } from "@/app/types";
import { MovieCard } from "@/app/components/movie-card";

interface MovieGridProps {
  movies: Movie[];
  title?: string;
}

export function MovieGrid({ movies = [], title }: MovieGridProps) {
  // Ensure movies is an array and filter out invalid items
  const validMovies = Array.isArray(movies)
    ? movies.filter(movie => movie && movie._id && movie.slug)
    : [];

  if (validMovies.length === 0) {
    return (
      <section className="py-6">
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
        )}
        <div className="py-10 text-center">
          <h2 className="text-xl font-bold text-gray-400">Không tìm thấy phim</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {validMovies.map((movie) => (
          <MovieCard key={movie._id || movie.slug} movie={movie} />
        ))}
      </div>
    </section>
  );
}
