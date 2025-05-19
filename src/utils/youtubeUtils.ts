
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
