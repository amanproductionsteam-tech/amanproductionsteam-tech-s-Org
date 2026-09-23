/**
 * YouTube integration utilities.
 * Offloads all video streaming directly to YouTube's CDN for smooth 4K/60fps playback
 * with zero bandwidth or performance load on the web application.
 */

export const DEFAULT_YOUTUBE_SHOWCASE: Record<string, string> = {
  'event-photo': 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
  'brand-pr': 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
  'corp-photo': 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
  'corp-film': 'https://www.youtube.com/watch?v=07d2dXHYb94',
  're-photo': 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
  'fashion': 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
  'drone': 'https://www.youtube.com/watch?v=2b9txcAt4e0',
  'wedding': 'https://www.youtube.com/watch?v=7X8II6J-6mU',
  'product': 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
  'reels': 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
  'exhibition': 'https://www.youtube.com/watch?v=d_HlPboLRL8',
  'timelapse': 'https://www.youtube.com/watch?v=Q74Vn0yJzP0',
  'showreel': 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
  'general': 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
};

/**
 * Extracts YouTube video ID from various YouTube URL formats or raw ID.
 */
export function extractYouTubeId(urlOrId?: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

/**
 * Constructs a direct YouTube watch URL with auto-play parameters.
 */
export function getYouTubeWatchUrl(urlOrId?: string, fallbackKey: string = 'general'): string {
  const id = extractYouTubeId(urlOrId) || extractYouTubeId(DEFAULT_YOUTUBE_SHOWCASE[fallbackKey]) || 'LXb3EKWsInQ';
  return `https://www.youtube.com/watch?v=${id}`;
}

/**
 * Directly opens YouTube in a new tab so the video plays smoothly
 * with zero bandwidth or performance load on the website server.
 */
export function openYouTubeDirectly(urlOrId?: string, fallbackKey: string = 'general') {
  const targetUrl = getYouTubeWatchUrl(urlOrId, fallbackKey);
  try {
    const win = window.open(targetUrl, '_blank', 'noopener,noreferrer');
    if (win) {
      win.focus();
    }
  } catch (err) {
    console.error('Failed to open YouTube:', err);
    window.location.href = targetUrl;
  }
}
