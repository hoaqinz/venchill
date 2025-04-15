"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/app/lib/utils";

// Import React Player dynamically to avoid SSR issues
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

// Import HLS.js dynamically
const Hls = dynamic(() => import("hls.js"), { ssr: false });

interface MoviePlayerProps {
  currentEpisode: any;
  movie: any;
  nextEpisode?: any;
  prevEpisode?: any;
}

// Thời gian giới thiệu thông thường (90 giây)
const INTRO_DURATION = 90; // seconds

// Thời gian còn lại để hiển thị nút tập tiếp theo (20 giây)
const NEXT_EPISODE_THRESHOLD = 20; // seconds

export default function MoviePlayer({ currentEpisode, movie, nextEpisode, prevEpisode }: MoviePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(45 * 60); // 45 minutes in seconds
  const [volume, setVolume] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showNextEpisode, setShowNextEpisode] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!playerRef.current) return;

    if (!isFullscreen) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Bỏ qua đoạn giới thiệu
  const skipIntro = () => {
    // Chuyển đến sau đoạn giới thiệu (90 giây)
    setCurrentTime(INTRO_DURATION);
    setProgress((INTRO_DURATION / duration) * 100);
    setShowSkipIntro(false);

    // Lưu vị trí mới
    const watchKey = getWatchKey();
    if (watchKey) {
      localStorage.setItem(watchKey, INTRO_DURATION.toString());
    }
  };

  // Chuyển đến tập tiếp theo
  const goToNextEpisode = () => {
    if (nextEpisode && movie) {
      // Xóa trạng thái xem của tập hiện tại
      const watchKey = getWatchKey();
      if (watchKey) {
        localStorage.removeItem(watchKey);
      }

      // Chuyển đến trang xem tập tiếp theo
      router.push(`/xem-phim/${movie.slug}/${nextEpisode.slug}`);
    }
  };

  // Khóa để lưu trạng thái xem
  const getWatchKey = () => {
    if (!movie || !currentEpisode) return null;
    return `watch_${movie.slug}_${currentEpisode.slug}`;
  };

  // Lấy trạng thái xem đã lưu
  useEffect(() => {
    const watchKey = getWatchKey();
    if (watchKey) {
      const savedTime = localStorage.getItem(watchKey);
      if (savedTime) {
        const parsedTime = parseFloat(savedTime);
        if (!isNaN(parsedTime) && parsedTime > 0) {
          setCurrentTime(parsedTime);
          setProgress((parsedTime / duration) * 100);
          console.log(`Loaded saved position: ${formatTime(parsedTime)}`);
        }
      }
    }
  }, [movie?.slug, currentEpisode?.slug]);

  // Lưu trạng thái xem mỗi 5 giây
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (isPlaying && currentTime > 0) {
        const watchKey = getWatchKey();
        if (watchKey) {
          localStorage.setItem(watchKey, currentTime.toString());
          console.log(`Saved position: ${formatTime(currentTime)}`);
        }
      }
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [isPlaying, currentTime, movie?.slug, currentEpisode?.slug]);

  // Update progress when playing
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prevTime) => {
          const newTime = prevTime + 1;
          if (newTime >= duration) {
            setIsPlaying(false);
            clearInterval(intervalRef.current as NodeJS.Timeout);
            return duration;
          }
          return newTime;
        });
        setProgress((prevProgress) => {
          const newProgress = (currentTime / duration) * 100;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentTime, duration]);

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Hiển thị nút bỏ qua giới thiệu khi đến đoạn giới thiệu
  useEffect(() => {
    // Hiển thị nút bỏ qua giới thiệu khi thời gian > 10s và < 85s
    if (isPlaying && currentTime > 10 && currentTime < INTRO_DURATION - 5) {
      setShowSkipIntro(true);
    } else {
      setShowSkipIntro(false);
    }

    // Hiển thị nút tập tiếp theo khi gần kết thúc video
    if (nextEpisode && isPlaying && duration > 0 && (duration - currentTime) < NEXT_EPISODE_THRESHOLD) {
      setShowNextEpisode(true);
    } else {
      setShowNextEpisode(false);
    }
  }, [currentTime, isPlaying, duration, nextEpisode]);

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const progressBarWidth = rect.width;
    const clickPercentage = (clickPosition / progressBarWidth) * 100;
    const newTime = (clickPercentage / 100) * duration;

    setCurrentTime(newTime);
    setProgress(clickPercentage);
  };

  // Determine video URL and type
  const isM3u8 = currentEpisode?.link_m3u8 && currentEpisode.link_m3u8.includes('.m3u8');

  // Check if embed URL is an iframe HTML or direct URL
  let isEmbed = false;
  let embedUrl = '';

  if (currentEpisode?.link_embed) {
    if (currentEpisode.link_embed.includes('<iframe')) {
      // Extract src from iframe HTML
      const srcMatch = currentEpisode.link_embed.match(/src=['"]([^'"]+)['"]/);
      if (srcMatch && srcMatch[1]) {
        isEmbed = true;
        embedUrl = srcMatch[1];
      }
    } else {
      // Direct URL
      isEmbed = true;
      embedUrl = currentEpisode.link_embed;
    }
  }

  // Prioritize m3u8 over embed
  const videoUrl = isM3u8 ? currentEpisode.link_m3u8 :
                  isEmbed ? embedUrl :
                  null;

  console.log('Video URL:', videoUrl);
  console.log('Is M3U8:', isM3u8);
  console.log('Is Embed:', isEmbed);

  return (
    <div ref={playerRef} className="absolute inset-0 bg-black flex flex-col items-center justify-center">
      {/* Nút bỏ qua giới thiệu */}
      {showSkipIntro && isPlaying && (
        <button
          onClick={skipIntro}
          className="absolute bottom-24 right-8 z-50 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-300 backdrop-blur-sm"
        >
          Bỏ qua giới thiệu
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Nút tập tiếp theo */}
      {showNextEpisode && nextEpisode && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-black/70 p-6 rounded-lg text-center backdrop-blur-md w-80">
          <p className="text-white text-lg mb-2">Tập tiếp theo sẽ phát trong {Math.floor(duration - currentTime)} giây</p>
          <h3 className="text-white font-bold text-xl mb-4">{nextEpisode.name}</h3>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowNextEpisode(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Hủy
            </button>
            <button
              onClick={goToNextEpisode}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              Xem ngay
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {!isPlaying ? (
        // Thumbnail with play button
        <div className="relative w-full h-full">
          <Image
            src={getImageUrl(movie.poster_url || movie.thumb_url)}
            alt={movie.name}
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <button
                onClick={togglePlay}
                className="w-20 h-20 bg-red-600/80 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-red-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              </button>
              <p className="text-white text-lg font-medium">
                {movie.name} - Tập {currentEpisode.name}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Nhấn vào nút play để xem phim
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Real video player using ReactPlayer
        <div className="relative w-full h-full bg-black">
          {videoUrl ? (
            isEmbed ? (
              // Use iframe for embed URLs
              <div className="w-full h-full">
                <iframe
                  src={videoUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  title={`${movie.name} - Tập ${currentEpisode.name}`}
                  style={{ position: 'absolute', top: 0, left: 0 }}
                />
              </div>
            ) : (
              // Use ReactPlayer for m3u8 and other URLs
              <ReactPlayer
                url={videoUrl}
                width="100%"
                height="100%"
                playing={isPlaying}
                controls={true}
                config={{
                  file: {
                    forceHLS: isM3u8,
                    forceVideo: true,
                    hlsOptions: {
                      enableWorker: true,
                      lowLatencyMode: true,
                      startLevel: 2,
                      maxBufferLength: 30,        // Tăng buffer để giảm việc rebuffering
                      maxMaxBufferLength: 60,     // Buffer tối đa
                      backBufferLength: 30,       // Lưu buffer phía sau để quay lại nhanh hơn
                      maxBufferSize: 60 * 1000000, // Kích thước buffer tối đa (60MB)
                      maxBufferHole: 0.5,         // Lỗ hổng buffer tối đa
                      liveSyncDuration: 3,        // Độ trễ cho phép khi xem trực tiếp
                      manifestLoadingTimeOut: 10000, // Thời gian chờ tải manifest
                      manifestLoadingMaxRetry: 4,  // Số lần thử lại tối đa
                      startFragPrefetch: true,     // Tải trước fragment đầu tiên
                      testBandwidth: true,         // Kiểm tra băng thông
                    },
                    attributes: {
                      crossOrigin: "anonymous",    // Hỗ trợ CORS
                      preload: "auto",             // Tự động tải trước
                    },
                  },
                }}
                onProgress={(state) => {
                  setCurrentTime(state.playedSeconds);
                  setProgress(state.played * 100);
                }}
                onDuration={(duration) => setDuration(duration)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onEnded={() => setIsPlaying(false)}
                style={{ position: 'absolute', top: 0, left: 0 }}
              />
            )
          ) : (
            // Fallback if no video URL is available
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-white text-xl font-bold mb-4">
                  Không tìm thấy nguồn phát
                </p>
                <p className="text-gray-400 text-sm">
                  Rất tiếc, không tìm thấy nguồn phát cho tập phim này.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chỉ hiển thị điều khiển tùy chỉnh khi không phải là embed */}
      {!isEmbed && !isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="text-white hover:text-red-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <div className="text-white text-sm">00:00 / {formatTime(duration)}</div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-red-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-700 h-1 rounded-full overflow-hidden">
            <div className="bg-red-600 h-full rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}
