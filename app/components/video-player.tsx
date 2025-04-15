"use client";

import { useState, useEffect, useRef } from "react";
import { Episode, EpisodeData } from "@/app/types";

interface VideoPlayerProps {
  episodes: Episode[];
  currentEpisode: string;
  slug: string;
}

export function VideoPlayer({ episodes, currentEpisode, slug }: VideoPlayerProps) {
  const [activeServer, setActiveServer] = useState<string>(episodes[0]?.server_name || "");
  const [episodeData, setEpisodeData] = useState<EpisodeData | null>(null);
  const playerRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Find the episode data based on the current episode and active server
    const server = episodes.find((server) => server.server_name === activeServer);
    if (server) {
      const episode = server.server_data.find((ep) => ep.slug === currentEpisode);
      if (episode) {
        setEpisodeData(episode);
      } else if (server.server_data.length > 0) {
        // If the current episode is not found, use the first episode
        setEpisodeData(server.server_data[0]);
      }
    }
  }, [activeServer, currentEpisode, episodes]);

  const handleServerChange = (serverName: string) => {
    setActiveServer(serverName);
  };

  if (!episodes.length || !episodeData) {
    return (
      <div className="aspect-video bg-black flex items-center justify-center">
        <p className="text-white">Không tìm thấy nguồn phát</p>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      {/* Video Player */}
      <div className="aspect-video relative">
        <iframe
          ref={playerRef}
          src={episodeData.link_embed}
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          title={episodeData.filename}
        ></iframe>
      </div>

      {/* Server Selection */}
      <div className="p-4 bg-gray-900">
        <div className="mb-4">
          <h3 className="text-white text-sm font-medium mb-2">Chọn Server:</h3>
          <div className="flex flex-wrap gap-2">
            {episodes.map((server) => (
              <button
                key={server.server_name}
                onClick={() => handleServerChange(server.server_name)}
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
      </div>
    </div>
  );
}
