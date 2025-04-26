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
// Có thể tùy chỉnh theo từng phim hoặc tập phim
const getIntroDuration = (movie, episode) => {
  // Mặc định là 90 giây
  let introDuration = 90;

  // Tùy chỉnh theo phim cụ thể
  if (movie && movie.slug) {
    // Ví dụ: phim có giới thiệu dài hơn
    if (movie.slug.includes('nguoi-nhen')) {
      introDuration = 120; // 2 phút
    } else if (movie.slug.includes('nguoi-sat')) {
      introDuration = 100; // 1 phút 40 giây
    }
  }

  return introDuration;
};

const INTRO_DURATION = 90; // seconds - giá trị mặc định

// Thời gian còn lại để hiển thị nút tập tiếp theo (20 giây)
const NEXT_EPISODE_THRESHOLD = 20; // seconds

export default function MoviePlayer({ currentEpisode, movie, nextEpisode, prevEpisode }: MoviePlayerProps) {
  // Tạo key duy nhất cho video hiện tại để lưu trạng thái
  const videoKey = `${movie?.slug || ''}:${currentEpisode?.slug || ''}:${currentEpisode?.name || ''}`;

  // Khởi tạo state từ localStorage nếu có
  const getSavedState = () => {
    if (typeof window === 'undefined') return 0;
    try {
      const saved = localStorage.getItem(`venchill:${videoKey}:time`);
      const savedTime = saved ? parseFloat(saved) : 0;
      console.log(`Retrieved saved position: ${savedTime}s for key ${videoKey}`);
      return savedTime;
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return 0;
    }
  };

  // Kiểm tra xem localStorage có hoạt động không
  useEffect(() => {
    try {
      localStorage.setItem('venchill:test', 'test');
      const test = localStorage.getItem('venchill:test');
      if (test === 'test') {
        console.log('localStorage is working properly');
        localStorage.removeItem('venchill:test');
      } else {
        console.error('localStorage test failed');
      }
    } catch (e) {
      console.error('localStorage is not available:', e);
    }
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(getSavedState());
  const [duration, setDuration] = useState(45 * 60); // 45 minutes in seconds
  const [volume, setVolume] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showNextEpisode, setShowNextEpisode] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const reactPlayerRef = useRef<any>(null);
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
    console.log('Skipping intro...');
    // Lấy thời gian giới thiệu tùy chỉnh theo phim
    const introDuration = getIntroDuration(movie, currentEpisode);
    console.log(`Using intro duration: ${introDuration}s for ${movie?.slug || 'unknown movie'}`);

    // Chuyển đến sau đoạn giới thiệu
    setCurrentTime(introDuration);
    setProgress((introDuration / duration) * 100);
    setShowSkipIntro(false);

    // Lưu vị trí mới vào localStorage
    try {
      localStorage.setItem(`venchill:${videoKey}:time`, introDuration.toString());
      console.log(`Saved skip position to localStorage: ${introDuration}s`);
    } catch (e) {
      console.error('Error saving skip position to localStorage', e);
    }

    // Nếu đang phát video, cập nhật vị trí của ReactPlayer
    // Sử dụng setTimeout để đảm bảo ReactPlayer đã được khởi tạo đầy đủ
    setTimeout(() => {
      if (reactPlayerRef.current && reactPlayerRef.current.seekTo) {
        // Sử dụng seekTo của ReactPlayer
        try {
          // Đặt isPlaying = true trước khi seekTo để đảm bảo video tiếp tục phát
          setIsPlaying(true);
          reactPlayerRef.current.seekTo(introDuration, 'seconds');
          console.log('Skipped to:', introDuration);

          // Hiển thị thông báo đã bỏ qua giới thiệu
          alert(`Đã bỏ qua giới thiệu và chuyển đến ${formatTime(introDuration)}`);
        } catch (e) {
          console.error('Error seeking with ReactPlayer:', e);

          // Fallback: Tìm ReactPlayer instance hoặc video element
          try {
            const playerInstance = document.querySelector('video');
            if (playerInstance) {
              playerInstance.currentTime = introDuration;
              console.log('Skipped to (global fallback):', introDuration);
            }
          } catch (innerE) {
            console.error('Error with global fallback seeking:', innerE);
          }
        }
      } else if (playerRef.current) {
        // Fallback: Tìm ReactPlayer instance hoặc video element
        try {
          const playerInstance = playerRef.current.querySelector('video');
          if (playerInstance) {
            playerInstance.currentTime = introDuration;
            console.log('Skipped to (fallback):', introDuration);
          } else {
            console.warn('No video element found for fallback seeking');

            // Thử tìm video element trong toàn bộ document
            const globalVideoElement = document.querySelector('video');
            if (globalVideoElement) {
              globalVideoElement.currentTime = introDuration;
              console.log('Skipped to (global fallback):', introDuration);
            }
          }
        } catch (e) {
          console.error('Error with fallback seeking:', e);
        }
      } else {
        console.warn('No player reference available for seeking');

        // Thử tìm video element trong toàn bộ document
        try {
          const globalVideoElement = document.querySelector('video');
          if (globalVideoElement) {
            globalVideoElement.currentTime = introDuration;
            console.log('Skipped to (last resort fallback):', introDuration);
          }
        } catch (e) {
          console.error('Error with last resort fallback seeking:', e);
        }
      }
    }, 500); // Đợi 500ms để đảm bảo ReactPlayer đã được khởi tạo đầy đủ
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
    const savedTime = getSavedState();
    if (savedTime > 0) {
      // Nếu đã xem hơn 10 giây, hiển thị thông báo tiếp tục xem
      if (savedTime > 10 && savedTime < duration - 30) {
        setShowResumePrompt(true);
        console.log(`Saved position found: ${formatTime(savedTime)}`);
      } else {
        // Nếu thời gian quá ngắn hoặc gần kết thúc, tự động đặt vị trí
        setCurrentTime(savedTime);
        setProgress((savedTime / duration) * 100);
        console.log(`Auto-resumed from: ${formatTime(savedTime)}`);
      }
    }
  }, [movie?.slug, currentEpisode?.slug, duration]);

  // Hàm tiếp tục xem từ vị trí đã lưu
  const resumeFromSavedPosition = () => {
    console.log('Resuming from saved position...');
    const savedTime = getSavedState();
    if (savedTime > 0) {
      setCurrentTime(savedTime);
      setProgress((savedTime / duration) * 100);
      setShowResumePrompt(false);
      setIsPlaying(true);

      // Nếu đang sử dụng ReactPlayer, cập nhật vị trí
      setTimeout(() => {
        if (reactPlayerRef.current && reactPlayerRef.current.seekTo) {
          try {
            reactPlayerRef.current.seekTo(savedTime, 'seconds');
            console.log(`Resumed playback at: ${formatTime(savedTime)}`);

            // Hiển thị thông báo đã tiếp tục xem
            alert(`Đã tiếp tục xem từ vị trí ${formatTime(savedTime)}`);
          } catch (e) {
            console.error('Error seeking with ReactPlayer:', e);

            // Fallback: Tìm video element trong toàn bộ document
            try {
              const playerInstance = document.querySelector('video');
              if (playerInstance) {
                playerInstance.currentTime = savedTime;
                console.log('Resumed at (global fallback):', savedTime);
              }
            } catch (innerE) {
              console.error('Error with global fallback seeking:', innerE);
            }
          }
        } else if (playerRef.current) {
          // Fallback: Tìm ReactPlayer instance hoặc video element
          try {
            const playerInstance = playerRef.current.querySelector('video');
            if (playerInstance) {
              playerInstance.currentTime = savedTime;
              console.log('Resumed at (fallback):', savedTime);
            } else {
              console.warn('No video element found for fallback seeking');

              // Thử tìm video element trong toàn bộ document
              const globalVideoElement = document.querySelector('video');
              if (globalVideoElement) {
                globalVideoElement.currentTime = savedTime;
                console.log('Resumed at (global fallback):', savedTime);
              }
            }
          } catch (e) {
            console.error('Error with fallback seeking:', e);
          }
        } else {
          console.warn('No player reference available for seeking');

          // Thử tìm video element trong toàn bộ document
          try {
            const globalVideoElement = document.querySelector('video');
            if (globalVideoElement) {
              globalVideoElement.currentTime = savedTime;
              console.log('Resumed at (last resort fallback):', savedTime);
            }
          } catch (e) {
            console.error('Error with last resort fallback seeking:', e);
          }
        }
      }, 500); // Đợi 500ms để đảm bảo ReactPlayer đã được khởi tạo đầy đủ
    } else {
      console.warn('No saved position found');
      alert('Không tìm thấy vị trí đã lưu. Bắt đầu xem từ đầu.');
      startFromBeginning();
    }
  };

  // Hàm bắt đầu xem từ đầu
  const startFromBeginning = () => {
    console.log('Starting from beginning...');
    setCurrentTime(0);
    setProgress(0);
    setShowResumePrompt(false);
    setIsPlaying(true);

    // Xóa vị trí đã lưu
    try {
      localStorage.removeItem(`venchill:${videoKey}:time`);
      console.log(`Removed saved position for ${videoKey}`);
    } catch (e) {
      console.error('Error removing from localStorage', e);
    }

    // Đặt vị trí của ReactPlayer về 0
    setTimeout(() => {
      if (reactPlayerRef.current && reactPlayerRef.current.seekTo) {
        try {
          reactPlayerRef.current.seekTo(0, 'seconds');
          console.log('Set playback position to beginning');
        } catch (e) {
          console.error('Error seeking to beginning:', e);
        }
      } else {
        console.warn('ReactPlayer reference not available for seeking to beginning');
      }
    }, 1000); // Đợi 1 giây để đảm bảo ReactPlayer đã được khởi tạo
  };

  // Lưu trạng thái xem mỗi 5 giây
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (isPlaying && currentTime > 0) {
        try {
          // Lưu vị trí hiện tại vào localStorage
          localStorage.setItem(`venchill:${videoKey}:time`, currentTime.toString());
          console.log(`Saved position: ${formatTime(currentTime)}`);

          // Lưu thêm thông tin về phim và tập đang xem
          if (movie && currentEpisode) {
            const historyItem = {
              movieId: movie.id,
              movieSlug: movie.slug,
              movieName: movie.name,
              episodeId: currentEpisode.id,
              episodeSlug: currentEpisode.slug,
              episodeName: currentEpisode.name,
              poster: movie.poster_url || movie.thumb_url,
              time: currentTime,
              duration: duration,
              progress: (currentTime / duration) * 100,
              timestamp: new Date().getTime()
            };

            // Lưu vào lịch sử xem
            localStorage.setItem(`venchill:history:${videoKey}`, JSON.stringify(historyItem));
          }
        } catch (e) {
          console.error('Error saving to localStorage', e);
        }
      }
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [isPlaying, currentTime, movie, currentEpisode, duration, videoKey]);

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
    // Log mỗi 5 giây để tránh spam console
    if (Math.floor(currentTime) % 5 === 0) {
      console.log('Current Time:', formatTime(currentTime), 'Is Playing:', isPlaying);
    }

    // Lấy thời gian giới thiệu tùy chỉnh theo phim
    const introDuration = getIntroDuration(movie, currentEpisode);

    // Hiển thị nút bỏ qua giới thiệu khi thời gian > 10s và < (introDuration - 5s)
    // Luôn hiển thị nút bỏ qua giới thiệu trong khoảng thời gian này, bất kể trạng thái phát
    if (currentTime > 10 && currentTime < introDuration - 5) {
      if (!showSkipIntro) {
        setShowSkipIntro(true);
        console.log(`Showing Skip Intro button at ${formatTime(currentTime)}`);
      }
    } else if (showSkipIntro) {
      setShowSkipIntro(false);
      console.log(`Hiding Skip Intro button at ${formatTime(currentTime)}`);
    }

    // Hiển thị nút tập tiếp theo khi gần kết thúc video
    if (nextEpisode && isPlaying && duration > 0 && (duration - currentTime) < NEXT_EPISODE_THRESHOLD) {
      if (!showNextEpisode) {
        setShowNextEpisode(true);
        console.log(`Showing Next Episode button at ${formatTime(currentTime)}`);
      }
    } else if (showNextEpisode) {
      setShowNextEpisode(false);
      console.log(`Hiding Next Episode button at ${formatTime(currentTime)}`);
    }
  }, [currentTime, isPlaying, duration, nextEpisode, showSkipIntro, showNextEpisode]);

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
      {showSkipIntro && (
        <button
          onClick={skipIntro}
          className="absolute bottom-24 right-8 z-50 bg-red-600/80 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-300 backdrop-blur-sm animate-pulse"
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
              {showResumePrompt ? (
                // Hiển thị thông báo tiếp tục xem
                <div className="bg-black/70 p-6 rounded-lg backdrop-blur-md max-w-md">
                  <h3 className="text-white font-bold text-xl mb-2">
                    Tiếp tục xem?
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Bạn đã xem đến {formatTime(getSavedState())} / {formatTime(duration)}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={startFromBeginning}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                    >
                      Xem từ đầu
                    </button>
                    <button
                      onClick={resumeFromSavedPosition}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                    >
                      Tiếp tục xem
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                // Nút play mặc định
                <>
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
                </>
              )}
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
                ref={reactPlayerRef}
                url={videoUrl}
                width="100%"
                height="100%"
                playing={isPlaying}
                controls={true}
                progressInterval={500} // Cập nhật tiến trình mỗi 500ms thay vì 1000ms mặc định
                // Đặt vị trí bắt đầu nếu có vị trí đã lưu
                playbackRate={1.0}
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
                  // Cập nhật trạng thái hiện tại
                  setCurrentTime(state.playedSeconds);
                  setProgress(state.played * 100);

                  // Lưu trạng thái ngay lập tức khi người dùng đã xem được ít nhất 10 giây
                  if (state.playedSeconds > 10) {
                    if (!hasStarted) {
                      setHasStarted(true);
                      console.log('Started watching, saving initial position');
                    }

                    // Lưu vị trí hiện tại vào localStorage mỗi khi có tiến triển
                    try {
                      localStorage.setItem(`venchill:${videoKey}:time`, state.playedSeconds.toString());
                      // Không log mỗi lần để tránh spam console
                      if (Math.floor(state.playedSeconds) % 10 === 0) { // Log mỗi 10 giây
                        console.log(`Auto-saved position: ${formatTime(state.playedSeconds)}`);
                      }
                    } catch (e) {
                      console.error('Error saving position to localStorage', e);
                    }
                  }
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
