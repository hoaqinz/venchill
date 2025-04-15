"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Movie } from "@/app/types";
import { formatEpisode, formatYear, getImageUrl, truncateText } from "@/app/lib/utils";
import { Card, CardContent, CardFooter } from "@/app/components/ui/card";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);

  if (!movie || !movie.slug) {
    return null;
  }

  return (
    <Link href={`/phim/${movie.slug}`}>
      <Card className="overflow-hidden group h-full transition-all duration-300 hover:scale-105 hover:shadow-xl bg-black/20 border-0">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={imageError ? "/placeholder.jpg" : getImageUrl(movie.thumb_url)}
            alt={movie.name || "Movie poster"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-all duration-500 group-hover:scale-110"
            priority={false}
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100" />

          {/* Episode badge */}
          {movie.episode_current && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
              {formatEpisode(movie.episode_current)}
            </div>
          )}

          {/* Quality badge */}
          {movie.quality && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
              {movie.quality}
            </div>
          )}
        </div>

        <CardContent className="p-3">
          <h3 className="font-bold text-sm line-clamp-1 text-white group-hover:text-red-500 transition-colors">
            {movie.name || "Unknown Title"}
          </h3>
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">
            {movie.origin_name || ""}
          </p>
        </CardContent>

        <CardFooter className="p-3 pt-0 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">{formatYear(movie.year)}</span>
          </div>
          <div className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-300">
            {movie.lang || "N/A"}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
