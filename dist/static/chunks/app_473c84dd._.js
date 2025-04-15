(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/app/lib/utils.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "cn": (()=>cn),
    "formatDuration": (()=>formatDuration),
    "formatEpisode": (()=>formatEpisode),
    "formatMovieTitle": (()=>formatMovieTitle),
    "formatYear": (()=>formatYear),
    "getImageUrl": (()=>getImageUrl),
    "parseHtml": (()=>parseHtml),
    "truncateText": (()=>truncateText)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function formatDuration(duration) {
    return duration || "N/A";
}
function formatEpisode(episode) {
    return episode || "N/A";
}
function getImageUrl(path) {
    if (!path) return "/placeholder.jpg";
    if (path.startsWith("http")) return path;
    try {
        return `https://img.ophim.live/uploads/movies/${path}`;
    } catch (error) {
        console.error("Error generating image URL:", error);
        return "/placeholder.jpg";
    }
}
function formatMovieTitle(name, origin_name) {
    if (!name) return origin_name || "Unknown";
    if (!origin_name) return name;
    return `${name} (${origin_name})`;
}
function truncateText(text, length) {
    if (!text) return "";
    if (text.length <= length) return text;
    return text.slice(0, length) + "...";
}
function parseHtml(html) {
    if (!html) return "";
    // Remove HTML tags
    return html.replace(/<[^>]*>?/gm, '');
}
function formatYear(year) {
    return year ? year.toString() : "N/A";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/components/movie-player.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>MoviePlayer)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/utils.ts [app-client] (ecmascript)");
;
;
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
// Import React Player dynamically to avoid SSR issues
const ReactPlayer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.r("[project]/node_modules/react-player/lazy/index.js [app-client] (ecmascript, next/dynamic entry, async loader)")(__turbopack_context__.i), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/react-player/lazy/index.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = ReactPlayer;
// Import HLS.js dynamically
const Hls = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(_c1 = ()=>__turbopack_context__.r("[project]/node_modules/hls.js/dist/hls.mjs [app-client] (ecmascript, next/dynamic entry, async loader)")(__turbopack_context__.i), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/hls.js/dist/hls.mjs [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c2 = Hls;
// Thời gian giới thiệu thông thường (90 giây)
const INTRO_DURATION = 90; // seconds
// Thời gian còn lại để hiển thị nút tập tiếp theo (20 giây)
const NEXT_EPISODE_THRESHOLD = 20; // seconds
function MoviePlayer({ currentEpisode, movie, nextEpisode, prevEpisode }) {
    _s();
    const [isPlaying, setIsPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [progress, setProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [currentTime, setCurrentTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [duration, setDuration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(45 * 60); // 45 minutes in seconds
    const [volume, setVolume] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(100);
    const [isFullscreen, setIsFullscreen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSkipIntro, setShowSkipIntro] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showNextEpisode, setShowNextEpisode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const playerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const reactPlayerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const intervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Format time in MM:SS
    const formatTime = (seconds)=>{
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
    // Toggle play/pause
    const togglePlay = ()=>{
        setIsPlaying(!isPlaying);
    };
    // Toggle fullscreen
    const toggleFullscreen = ()=>{
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
    const skipIntro = ()=>{
        // Chuyển đến sau đoạn giới thiệu (90 giây)
        setCurrentTime(INTRO_DURATION);
        setProgress(INTRO_DURATION / duration * 100);
        setShowSkipIntro(false);
        // Lưu vị trí mới
        const watchKey = getWatchKey();
        if (watchKey) {
            localStorage.setItem(watchKey, INTRO_DURATION.toString());
        }
        // Nếu đang phát video, cập nhật vị trí của ReactPlayer
        if (reactPlayerRef.current) {
            // Sử dụng seekTo của ReactPlayer
            reactPlayerRef.current.seekTo(INTRO_DURATION, 'seconds');
            console.log('Skipped to:', INTRO_DURATION);
        } else if (playerRef.current) {
            // Fallback: Tìm ReactPlayer instance
            const playerInstance = playerRef.current.querySelector('video');
            if (playerInstance) {
                playerInstance.currentTime = INTRO_DURATION;
                console.log('Skipped to (fallback):', INTRO_DURATION);
            }
        }
    };
    // Chuyển đến tập tiếp theo
    const goToNextEpisode = ()=>{
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
    const getWatchKey = ()=>{
        if (!movie || !currentEpisode) return null;
        return `watch_${movie.slug}_${currentEpisode.slug}`;
    };
    // Lấy trạng thái xem đã lưu
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MoviePlayer.useEffect": ()=>{
            const watchKey = getWatchKey();
            if (watchKey) {
                const savedTime = localStorage.getItem(watchKey);
                if (savedTime) {
                    const parsedTime = parseFloat(savedTime);
                    if (!isNaN(parsedTime) && parsedTime > 0) {
                        setCurrentTime(parsedTime);
                        setProgress(parsedTime / duration * 100);
                        console.log(`Loaded saved position: ${formatTime(parsedTime)}`);
                    }
                }
            }
        }
    }["MoviePlayer.useEffect"], [
        movie?.slug,
        currentEpisode?.slug
    ]);
    // Lưu trạng thái xem mỗi 5 giây
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MoviePlayer.useEffect": ()=>{
            const saveInterval = setInterval({
                "MoviePlayer.useEffect.saveInterval": ()=>{
                    if (isPlaying && currentTime > 0) {
                        const watchKey = getWatchKey();
                        if (watchKey) {
                            localStorage.setItem(watchKey, currentTime.toString());
                            console.log(`Saved position: ${formatTime(currentTime)}`);
                        }
                    }
                }
            }["MoviePlayer.useEffect.saveInterval"], 5000);
            return ({
                "MoviePlayer.useEffect": ()=>clearInterval(saveInterval)
            })["MoviePlayer.useEffect"];
        }
    }["MoviePlayer.useEffect"], [
        isPlaying,
        currentTime,
        movie?.slug,
        currentEpisode?.slug
    ]);
    // Update progress when playing
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MoviePlayer.useEffect": ()=>{
            if (isPlaying) {
                intervalRef.current = setInterval({
                    "MoviePlayer.useEffect": ()=>{
                        setCurrentTime({
                            "MoviePlayer.useEffect": (prevTime)=>{
                                const newTime = prevTime + 1;
                                if (newTime >= duration) {
                                    setIsPlaying(false);
                                    clearInterval(intervalRef.current);
                                    return duration;
                                }
                                return newTime;
                            }
                        }["MoviePlayer.useEffect"]);
                        setProgress({
                            "MoviePlayer.useEffect": (prevProgress)=>{
                                const newProgress = currentTime / duration * 100;
                                return newProgress > 100 ? 100 : newProgress;
                            }
                        }["MoviePlayer.useEffect"]);
                    }
                }["MoviePlayer.useEffect"], 1000);
            } else {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            }
            return ({
                "MoviePlayer.useEffect": ()=>{
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                }
            })["MoviePlayer.useEffect"];
        }
    }["MoviePlayer.useEffect"], [
        isPlaying,
        currentTime,
        duration
    ]);
    // Listen for fullscreen change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MoviePlayer.useEffect": ()=>{
            const handleFullscreenChange = {
                "MoviePlayer.useEffect.handleFullscreenChange": ()=>{
                    setIsFullscreen(!!document.fullscreenElement);
                }
            }["MoviePlayer.useEffect.handleFullscreenChange"];
            document.addEventListener('fullscreenchange', handleFullscreenChange);
            return ({
                "MoviePlayer.useEffect": ()=>{
                    document.removeEventListener('fullscreenchange', handleFullscreenChange);
                }
            })["MoviePlayer.useEffect"];
        }
    }["MoviePlayer.useEffect"], []);
    // Hiển thị nút bỏ qua giới thiệu khi đến đoạn giới thiệu
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MoviePlayer.useEffect": ()=>{
            console.log('Current Time:', currentTime, 'Is Playing:', isPlaying);
            // Hiển thị nút bỏ qua giới thiệu khi thời gian > 10s và < 85s
            // Luôn hiển thị nút bỏ qua giới thiệu trong khoảng thời gian này, bất kể trạng thái phát
            if (currentTime > 10 && currentTime < INTRO_DURATION - 5) {
                setShowSkipIntro(true);
                console.log('Showing Skip Intro button');
            } else {
                setShowSkipIntro(false);
            }
            // Hiển thị nút tập tiếp theo khi gần kết thúc video
            if (nextEpisode && isPlaying && duration > 0 && duration - currentTime < NEXT_EPISODE_THRESHOLD) {
                setShowNextEpisode(true);
            } else {
                setShowNextEpisode(false);
            }
        }
    }["MoviePlayer.useEffect"], [
        currentTime,
        isPlaying,
        duration,
        nextEpisode
    ]);
    // Handle progress bar click
    const handleProgressClick = (e)=>{
        if (!playerRef.current) return;
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const progressBarWidth = rect.width;
        const clickPercentage = clickPosition / progressBarWidth * 100;
        const newTime = clickPercentage / 100 * duration;
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
    const videoUrl = isM3u8 ? currentEpisode.link_m3u8 : isEmbed ? embedUrl : null;
    console.log('Video URL:', videoUrl);
    console.log('Is M3U8:', isM3u8);
    console.log('Is Embed:', isEmbed);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: playerRef,
        className: "absolute inset-0 bg-black flex flex-col items-center justify-center",
        children: [
            showSkipIntro && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: skipIntro,
                className: "absolute bottom-24 right-8 z-50 bg-red-600/80 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-300 backdrop-blur-sm animate-pulse",
                children: [
                    "Bỏ qua giới thiệu",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        className: "h-5 w-5",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M13 5l7 7-7 7M5 5l7 7-7 7"
                        }, void 0, false, {
                            fileName: "[project]/app/components/movie-player.tsx",
                            lineNumber: 268,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/movie-player.tsx",
                        lineNumber: 267,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/movie-player.tsx",
                lineNumber: 262,
                columnNumber: 9
            }, this),
            showNextEpisode && nextEpisode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-black/70 p-6 rounded-lg text-center backdrop-blur-md w-80",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-white text-lg mb-2",
                        children: [
                            "Tập tiếp theo sẽ phát trong ",
                            Math.floor(duration - currentTime),
                            " giây"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/movie-player.tsx",
                        lineNumber: 276,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-white font-bold text-xl mb-4",
                        children: nextEpisode.name
                    }, void 0, false, {
                        fileName: "[project]/app/components/movie-player.tsx",
                        lineNumber: 277,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-4 justify-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowNextEpisode(false),
                                className: "bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md",
                                children: "Hủy"
                            }, void 0, false, {
                                fileName: "[project]/app/components/movie-player.tsx",
                                lineNumber: 279,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: goToNextEpisode,
                                className: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2",
                                children: [
                                    "Xem ngay",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-5 w-5",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M9 5l7 7-7 7"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/movie-player.tsx",
                                            lineNumber: 291,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/movie-player.tsx",
                                        lineNumber: 290,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/movie-player.tsx",
                                lineNumber: 285,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/movie-player.tsx",
                        lineNumber: 278,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/movie-player.tsx",
                lineNumber: 275,
                columnNumber: 9
            }, this),
            !isPlaying ? // Thumbnail with play button
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full h-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getImageUrl"])(movie.poster_url || movie.thumb_url),
                        alt: movie.name,
                        fill: true,
                        className: "object-cover opacity-30"
                    }, void 0, false, {
                        fileName: "[project]/app/components/movie-player.tsx",
                        lineNumber: 301,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: togglePlay,
                                    className: "w-20 h-20 bg-red-600/80 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-red-700 transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-10 w-10 text-white",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/movie-player.tsx",
                                            lineNumber: 314,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/movie-player.tsx",
                                        lineNumber: 313,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/movie-player.tsx",
                                    lineNumber: 309,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-white text-lg font-medium",
                                    children: [
                                        movie.name,
                                        " - Tập ",
                                        currentEpisode.name
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/movie-player.tsx",
                                    lineNumber: 317,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-400 text-sm mt-2",
                                    children: "Nhấn vào nút play để xem phim"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/movie-player.tsx",
                                    lineNumber: 320,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/movie-player.tsx",
                            lineNumber: 308,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/movie-player.tsx",
                        lineNumber: 307,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/movie-player.tsx",
                lineNumber: 300,
                columnNumber: 9
            }, this) : // Real video player using ReactPlayer
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full h-full bg-black",
                children: videoUrl ? isEmbed ? // Use iframe for embed URLs
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full h-full",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                        src: videoUrl,
                        width: "100%",
                        height: "100%",
                        frameBorder: "0",
                        allowFullScreen: true,
                        title: `${movie.name} - Tập ${currentEpisode.name}`,
                        style: {
                            position: 'absolute',
                            top: 0,
                            left: 0
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/components/movie-player.tsx",
                        lineNumber: 333,
                        columnNumber: 17
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/movie-player.tsx",
                    lineNumber: 332,
                    columnNumber: 15
                }, this) : // Use ReactPlayer for m3u8 and other URLs
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReactPlayer, {
                    ref: reactPlayerRef,
                    url: videoUrl,
                    width: "100%",
                    height: "100%",
                    playing: isPlaying,
                    controls: true,
                    config: {
                        file: {
                            forceHLS: isM3u8,
                            forceVideo: true,
                            hlsOptions: {
                                enableWorker: true,
                                lowLatencyMode: true,
                                startLevel: 2,
                                maxBufferLength: 30,
                                maxMaxBufferLength: 60,
                                backBufferLength: 30,
                                maxBufferSize: 60 * 1000000,
                                maxBufferHole: 0.5,
                                liveSyncDuration: 3,
                                manifestLoadingTimeOut: 10000,
                                manifestLoadingMaxRetry: 4,
                                startFragPrefetch: true,
                                testBandwidth: true
                            },
                            attributes: {
                                crossOrigin: "anonymous",
                                preload: "auto"
                            }
                        }
                    },
                    onProgress: (state)=>{
                        setCurrentTime(state.playedSeconds);
                        setProgress(state.played * 100);
                    },
                    onDuration: (duration)=>setDuration(duration),
                    onPause: ()=>setIsPlaying(false),
                    onPlay: ()=>setIsPlaying(true),
                    onEnded: ()=>setIsPlaying(false),
                    style: {
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }
                }, void 0, false, {
                    fileName: "[project]/app/components/movie-player.tsx",
                    lineNumber: 345,
                    columnNumber: 15
                }, this) : // Fallback if no video URL is available
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center h-full",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-white text-xl font-bold mb-4",
                                children: "Không tìm thấy nguồn phát"
                            }, void 0, false, {
                                fileName: "[project]/app/components/movie-player.tsx",
                                lineNumber: 392,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-400 text-sm",
                                children: "Rất tiếc, không tìm thấy nguồn phát cho tập phim này."
                            }, void 0, false, {
                                fileName: "[project]/app/components/movie-player.tsx",
                                lineNumber: 395,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/movie-player.tsx",
                        lineNumber: 391,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/movie-player.tsx",
                    lineNumber: 390,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/components/movie-player.tsx",
                lineNumber: 328,
                columnNumber: 9
            }, this),
            !isEmbed && !isPlaying && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: togglePlay,
                                        className: "text-white hover:text-red-500 transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            className: "h-8 w-8",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/movie-player.tsx",
                                                    lineNumber: 414,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/movie-player.tsx",
                                                    lineNumber: 415,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/movie-player.tsx",
                                            lineNumber: 413,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/movie-player.tsx",
                                        lineNumber: 409,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-white text-sm",
                                        children: [
                                            "00:00 / ",
                                            formatTime(duration)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/movie-player.tsx",
                                        lineNumber: 418,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/movie-player.tsx",
                                lineNumber: 408,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: toggleFullscreen,
                                    className: "text-white hover:text-red-500 transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        className: "h-6 w-6",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/movie-player.tsx",
                                            lineNumber: 426,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/movie-player.tsx",
                                        lineNumber: 425,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/movie-player.tsx",
                                    lineNumber: 421,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/movie-player.tsx",
                                lineNumber: 420,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/movie-player.tsx",
                        lineNumber: 407,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 w-full bg-gray-700 h-1 rounded-full overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-red-600 h-full rounded-full",
                            style: {
                                width: '0%'
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/components/movie-player.tsx",
                            lineNumber: 432,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/movie-player.tsx",
                        lineNumber: 431,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/movie-player.tsx",
                lineNumber: 406,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/movie-player.tsx",
        lineNumber: 259,
        columnNumber: 5
    }, this);
}
_s(MoviePlayer, "WRnRkEHjllRTWPavK3eYg3UtpPo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c3 = MoviePlayer;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "ReactPlayer");
__turbopack_context__.k.register(_c1, "Hls$dynamic");
__turbopack_context__.k.register(_c2, "Hls");
__turbopack_context__.k.register(_c3, "MoviePlayer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=app_473c84dd._.js.map