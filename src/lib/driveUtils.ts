/**
 * Google Drive Video & Media Utilities.
 * Enables pasting any Google Drive shareable link to automatically:
 * 1. Extract the unique Google Drive File / Folder ID.
 * 2. Generate a valid preview / thumbnail / embed stream URL.
 * 3. Provide direct Google Drive watch / play URLs that open instantly when tapped.
 */

export function extractGoogleDriveId(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // Standard /file/d/{id} format
  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]{25,})/);
  if (fileMatch) return fileMatch[1];

  // Open with query param ?id={id}
  const idParamMatch = trimmed.match(/drive\.google\.com\/(?:open|uc|thumbnail)\?(?:.*&)?id=([a-zA-Z0-9_-]{25,})/);
  if (idParamMatch) return idParamMatch[1];

  // Folder link drive.google.com/drive/folders/{id}
  const folderMatch = trimmed.match(/drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]{25,})/);
  if (folderMatch) return folderMatch[1];

  // Generic docs.google.com/file/d/{id}
  const docsMatch = trimmed.match(/docs\.google\.com\/file\/d\/([a-zA-Z0-9_-]{25,})/);
  if (docsMatch) return docsMatch[1];

  // If user pasted bare 28-33 char ID directly
  if (/^[a-zA-Z0-9_-]{25,50}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export function isGoogleDriveUrl(url?: string): boolean {
  if (!url) return false;
  return /drive\.google\.com|docs\.google\.com/.test(url) || extractGoogleDriveId(url) !== null;
}

export function getGoogleDrivePreviewUrl(urlOrId?: string): string {
  const fileId = extractGoogleDriveId(urlOrId) || urlOrId;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

export function getGoogleDriveThumbnailUrl(urlOrId?: string): string {
  const fileId = extractGoogleDriveId(urlOrId) || urlOrId;
  if (!fileId) return '';
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
}

export function getGoogleDriveDirectPlayUrl(urlOrId?: string): string {
  const fileId = extractGoogleDriveId(urlOrId) || urlOrId;
  return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
}

export function openGoogleDriveDirectly(urlOrId?: string) {
  const playUrl = getGoogleDriveDirectPlayUrl(urlOrId);
  try {
    const win = window.open(playUrl, '_blank', 'noopener,noreferrer');
    if (win) {
      win.focus();
    }
  } catch (err) {
    console.error('Failed to open Google Drive:', err);
    window.location.href = playUrl;
  }
}

export function isInstagramUrl(url?: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  return /instagram\.com|instagr\.am/i.test(trimmed);
}

export function cleanInstagramUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function openInstagramDirectly(url?: string) {
  if (!url) return;
  const fullUrl = cleanInstagramUrl(url);
  try {
    const win = window.open(fullUrl, '_blank', 'noopener,noreferrer');
    if (win) {
      win.focus();
    }
  } catch (err) {
    console.error('Failed to open Instagram:', err);
    window.location.href = fullUrl;
  }
}

