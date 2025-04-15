"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Movie } from "@/app/types";
import { getImageUrl, truncateText, parseHtml } from "@/app/lib/utils";
import { FiPlay, FiInfo } from "react-icons/fi";
import { Button } from "@/app/components/ui/button";

interface HeroSliderProps {
  movies: Movie[];
}

export function HeroSlider({ movies = [] }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const featuredMovies = Array.isArray(movies) ? movies.slice(0, 5) : [];

  useEffect(() => {
    if (featuredMovies.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === featuredMovies.length - 1 ? 0 : prevIndex + 1
        );
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [featuredMovies.length]);

  if (!featuredMovies.length) return null;

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Slides */}
      {featuredMovies.map((movie, index) => (
        <div
          key={movie._id || index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={getImageUrl(movie.poster_url || movie.thumb_url)}
              alt={movie.name || "Movie poster"}
              fill
              priority
              className="object-cover"
              onLoad={() => setIsLoaded(true)}
              onError={() => setIsLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                {movie.name || ""}
              </h1>
              <p className="text-lg text-gray-300 mb-2">
                {movie.origin_name || ""} {movie.year ? `(${movie.year})` : ""}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {Array.isArray(movie.category) && movie.category.map((cat) => (
                  <Link
                    key={cat.id || cat.slug}
                    href={`/the-loai/${cat.slug}`}
                    className="text-xs bg-red-600/80 text-white px-2 py-1 rounded"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              <p className="text-gray-300 mb-6 line-clamp-3">
                {movie.content ? truncateText(parseHtml(movie.content), 200) : ""}
              </p>

              <div className="flex gap-4">
                <Link href={`/phim/${movie.slug}`}>
                  <Button className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
                    <FiPlay /> Xem Phim
                  </Button>
                </Link>
                <Link href={`/phim/${movie.slug}`}>
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 flex items-center gap-2">
                    <FiInfo /> Chi Tiết
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Indicators */}
      {featuredMovies.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? "bg-red-600 w-6" : "bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
