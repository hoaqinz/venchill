import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combine Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format movie duration
export function formatDuration(duration: string): string {
  return duration || "N/A";
}

// Format episode text
export function formatEpisode(episode: string): string {
  return episode || "N/A";
}

// Get image URL
export function getImageUrl(path: string): string {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http")) return path;

  try {
    return `https://img.ophim.live/uploads/movies/${path}`;
  } catch (error) {
    console.error("Error generating image URL:", error);
    return "/placeholder.jpg";
  }
}

// Format movie title
export function formatMovieTitle(name: string, origin_name: string): string {
  if (!name) return origin_name || "Unknown";
  if (!origin_name) return name;
  return `${name} (${origin_name})`;
}

// Truncate text
export function truncateText(text: string, length: number): string {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

// Parse HTML content
export function parseHtml(html: string): string {
  if (!html) return "";
  // Remove HTML tags
  return html.replace(/<[^>]*>?/gm, '');
}

// Format year
export function formatYear(year: number): string {
  return year ? year.toString() : "N/A";
}
