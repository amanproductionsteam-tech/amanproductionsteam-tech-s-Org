export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  parents?: string[];
}

export interface DriveStorageQuota {
  limit?: string;
  usage?: string;
  usageInDrive?: string;
}

export interface DriveUserInfo {
  displayName?: string;
  emailAddress?: string;
  photoLink?: string;
}

// Fetch Drive user and quota info
export async function getDriveAbout(token: string): Promise<{ user: DriveUserInfo; quota: DriveStorageQuota }> {
  const res = await fetch('https://www.googleapis.com/drive/v3/about?fields=user,storageQuota', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to fetch Drive account information.');
  }
  const data = await res.json();
  return {
    user: data.user || {},
    quota: data.storageQuota || {},
  };
}

// List files from Google Drive
export async function listDriveFiles(
  token: string,
  options?: {
    folderId?: string;
    mimeTypeFilter?: 'all' | 'images' | 'videos' | 'folders' | 'documents';
    searchTerm?: string;
  }
): Promise<DriveFile[]> {
  const queryParts = ['trashed = false'];

  if (options?.folderId) {
    queryParts.push(`'${options.folderId}' in parents`);
  }

  if (options?.searchTerm && options.searchTerm.trim()) {
    const clean = options.searchTerm.replace(/'/g, "\\'");
    queryParts.push(`name contains '${clean}'`);
  }

  if (options?.mimeTypeFilter) {
    if (options.mimeTypeFilter === 'images') {
      queryParts.push("mimeType contains 'image/'");
    } else if (options.mimeTypeFilter === 'videos') {
      queryParts.push("mimeType contains 'video/'");
    } else if (options.mimeTypeFilter === 'folders') {
      queryParts.push("mimeType = 'application/vnd.google-apps.folder'");
    } else if (options.mimeTypeFilter === 'documents') {
      queryParts.push("(mimeType contains 'pdf' or mimeType contains 'document' or mimeType contains 'sheet')");
    }
  }

  const q = encodeURIComponent(queryParts.join(' and '));
  const fields = encodeURIComponent(
    'files(id,name,mimeType,size,createdTime,modifiedTime,thumbnailLink,webViewLink,webContentLink,iconLink,parents)'
  );

  const url = `https://www.googleapis.com/drive/v3/files?pageSize=60&orderBy=folder,modifiedTime desc&q=${q}&fields=${fields}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to retrieve files from Google Drive.');
  }

  const data = await res.json();
  return data.files || [];
}

// Create a new folder
export async function createDriveFolder(
  token: string,
  name: string,
  parentFolderId?: string
): Promise<DriveFile> {
  const metadata: { name: string; mimeType: string; parents?: string[] } = {
    name: name.trim(),
    mimeType: 'application/vnd.google-apps.folder',
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const res = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to create folder in Google Drive.');
  }

  return await res.json();
}

// Upload file to Google Drive (multipart upload)
export async function uploadFileToDrive(
  token: string,
  file: File,
  parentFolderId?: string
): Promise<DriveFile> {
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata: { name: string; mimeType: string; parents?: string[] } = {
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const reader = new FileReader();
  const fileDataPromise = new Promise<ArrayBuffer>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });

  const fileBytes = await fileDataPromise;

  const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(
    metadata
  )}`;
  const mediaHeaderPart = `${delimiter}Content-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`;

  // Combine into single payload
  const enc = new TextEncoder();
  const part1 = enc.encode(metadataPart);
  const part2 = enc.encode(mediaHeaderPart);
  const part3 = new Uint8Array(fileBytes);
  const part4 = enc.encode(closeDelimiter);

  const totalLength = part1.length + part2.length + part3.length + part4.length;
  const combined = new Uint8Array(totalLength);
  let offset = 0;

  combined.set(part1, offset);
  offset += part1.length;
  combined.set(part2, offset);
  offset += part2.length;
  combined.set(part3, offset);
  offset += part3.length;
  combined.set(part4, offset);

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink,thumbnailLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: combined,
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to upload file to Google Drive.');
  }

  return await res.json();
}

// Delete file with explicit token
export async function deleteDriveFile(token: string, fileId: string): Promise<void> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to delete file from Google Drive.');
  }
}
