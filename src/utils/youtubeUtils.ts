
/**
 * Utility functions for YouTube URL validation and processing
 */

/**
 * Validates if a string is a valid YouTube URL
 * @param url The URL to validate
 * @returns boolean indicating if the URL is valid
 */
export const isValidYouTubeUrl = (url: string): boolean => {
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return regex.test(url);
};

/**
 * Checks if a YouTube URL is a playlist
 * @param url The URL to check
 * @returns boolean indicating if the URL is a playlist
 */
export const isPlaylistUrl = (url: string): boolean => {
  return url.includes('playlist?list=') || url.includes('&list=');
};

/**
 * Checks if a YouTube URL is a Shorts video
 * @param url The URL to check
 * @returns boolean indicating if the URL is a Shorts video
 */
export const isShortsUrl = (url: string): boolean => {
  return url.includes('/shorts/');
};

/**
 * Extracts video ID from various YouTube URL formats including Shorts
 * @param url The YouTube URL
 * @returns The video ID or null if not found
 */
export const extractVideoId = (url: string): string | null => {
  // Handle Shorts URLs: https://youtube.com/shorts/dQw4w9WgXcQ
  if (url.includes('/shorts/')) {
    const match = url.match(/\/shorts\/([^?&/#]+)/);
    return match ? match[1] : null;
  }
  
  // Handle regular video URLs
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

/**
 * Extracts playlist ID from YouTube URL
 * @param url The YouTube URL
 * @returns The playlist ID or null if not found
 */
export const extractPlaylistId = (url: string): string | null => {
  const match = url.match(/[?&]list=([^&]+)/);
  return match ? match[1] : null;
};

/**
 * Gets YouTube video ID from URL (alias for extractVideoId)
 * @param url The YouTube URL
 * @returns The video ID or null if not found
 */
export const getYoutubeVideoId = (url: string): string | null => {
  return extractVideoId(url);
};

/**
 * Gets YouTube thumbnail URL for a video ID
 * @param videoId The YouTube video ID
 * @returns The thumbnail URL
 */
export const getYoutubeThumbnailUrl = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
};
