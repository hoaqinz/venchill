"use client";

import Link from "next/link";
import { useState } from "react";
import { Episode } from "@/app/types";

interface EpisodeListProps {
  episodes: Episode[];
  slug: string;
  currentEpisode?: string;
}

export function EpisodeList({ episodes, slug, currentEpisode }: EpisodeListProps) {
  const [activeServer, setActiveServer] = useState<string>(episodes[0]?.server_name || "");

  if (!episodes.length) {
    return (
      <div className="p-4 bg-gray-900 rounded-lg">
        <p className="text-white">Không có tập phim nào</p>
      </div>
    );
  }

  const server = episodes.find((server) => server.server_name === activeServer);
  const episodeData = server?.server_data || [];

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-white text-lg font-medium mb-4">Danh sách tập phim</h3>
        
        {/* Server Selection */}
        <div className="mb-4">
          <h4 className="text-gray-400 text-sm mb-2">Chọn Server:</h4>
          <div className="flex flex-wrap gap-2">
            {episodes.map((server) => (
              <button
                key={server.server_name}
                onClick={() => setActiveServer(server.server_name)}
                className={`px-3 py-1 text-xs rounded ${
                  activeServer === server.server_name
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {server.server_name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Episode Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {episodeData.map((episode) => (
            <Link
              key={episode.slug}
              href={`/xem-phim/${slug}/${episode.slug}`}
              className={`text-center py-2 text-sm rounded transition-colors ${
                currentEpisode === episode.slug
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {episode.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
