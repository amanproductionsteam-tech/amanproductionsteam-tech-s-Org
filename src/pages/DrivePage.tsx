import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  HardDrive, 
  Folder, 
  Film, 
  Image as ImageIcon, 
  FileText, 
  Upload, 
  ExternalLink, 
  RefreshCw, 
  Search, 
  FolderPlus, 
  AlertCircle, 
  CheckCircle2, 
  LogOut, 
  X,
  File
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import { 
  initAuth, 
  googleSignIn, 
  googleSignOut, 
  getAccessToken,
  type User 
} from '../lib/googleAuth';
import { 
  listDriveFiles, 
  uploadFileToDrive, 
  createDriveFolder, 
  getDriveAbout,
  type DriveFile, 
  type DriveStorageQuota, 
  type DriveUserInfo 
} from '../lib/googleDrive';

export default function DrivePage() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Drive state
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [userInfo, setUserInfo] = useState<DriveUserInfo | null>(null);
  const [quota, setQuota] = useState<DriveStorageQuota | null>(null);

  // Filters & navigation
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'images' | 'videos' | 'folders' | 'documents'>('all');
  const [folderHistory, setFolderHistory] = useState<{ id: string; name: string }[]>([
    { id: 'root', name: 'My Drive' }
  ]);

  // Modals & operations
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentFolder = folderHistory[folderHistory.length - 1];

  // Initialize Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch Drive Data when token changes
  const loadDriveData = async () => {
    if (!token) return;
    setLoadingFiles(true);
    setAuthError(null);

    try {
      const folderId = currentFolder.id === 'root' ? undefined : currentFolder.id;
      const [fetchedFiles, about] = await Promise.all([
        listDriveFiles(token, {
          folderId,
          mimeTypeFilter: activeFilter,
          searchTerm,
        }),
        getDriveAbout(token).catch(() => ({ user: {} as DriveUserInfo, quota: {} as DriveStorageQuota })),
      ]);

      setFiles(fetchedFiles);
      if (about.user?.displayName) {
        setUserInfo(about.user);
      }
      if (about.quota?.usage) {
        setQuota(about.quota);
      }
    } catch (err: any) {
      console.error('Error loading drive files:', err);
      setAuthError(err.message || 'Failed to load files from Google Drive.');
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadDriveData();
    }
  }, [token, currentFolder.id, activeFilter]);

  // Handle Search submit
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (token) {
      loadDriveData();
    }
  };

  // Login handler
  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setAuthError(err.message || 'Google authentication failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    await googleSignOut();
    setUser(null);
    setToken(null);
    setFiles([]);
    setUserInfo(null);
    setQuota(null);
  };

  // Upload handler
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0 || !token) return;

    setIsUploading(true);
    setUploadSuccess(null);
    setAuthError(null);

    try {
      const fileToUpload = selectedFiles[0];
      const parentId = currentFolder.id === 'root' ? undefined : currentFolder.id;
      const uploaded = await uploadFileToDrive(token, fileToUpload, parentId);
      
      setUploadSuccess(`"${uploaded.name}" uploaded successfully.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      loadDriveData();
    } catch (err: any) {
      console.error('Upload failed:', err);
      setAuthError(err.message || 'Failed to upload file to Google Drive.');
    } finally {
      setIsUploading(false);
    }
  };

  // Create folder handler
  const handleCreateFolder = async (e: FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim() || !token) return;

    setIsCreatingFolder(true);
    setAuthError(null);

    try {
      const parentId = currentFolder.id === 'root' ? undefined : currentFolder.id;
      await createDriveFolder(token, newFolderName.trim(), parentId);
      setNewFolderName('');
      setShowFolderModal(false);
      loadDriveData();
    } catch (err: any) {
      console.error('Folder creation failed:', err);
      setAuthError(err.message || 'Failed to create folder.');
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const formatBytes = (bytesStr?: string) => {
    if (!bytesStr) return '';
    const bytes = parseInt(bytesStr, 10);
    if (isNaN(bytes)) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white flex flex-col selection:bg-white selection:text-black">
      {/* Top Navigation */}
      <header className="border-b border-white/10 bg-[#0c0c0c] sticky top-0 z-30">
        <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Breadcrumbs variant="inline" />
            <div className="h-4 w-[1px] bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="Aman Visual Logo"
                className="h-7 w-7 object-contain rounded-full border border-white/15"
              />
              <HardDrive size={18} className="text-emerald-400" />
              <h1 className="text-lg font-display uppercase font-bold tracking-wider">
                Google Drive <span className="text-white/40 text-sm font-normal">| Studio Assets</span>
              </h1>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5 text-xs">
                {userInfo?.photoLink ? (
                  <img 
                    src={userInfo.photoLink} 
                    alt={user.displayName || 'Google User'} 
                    className="w-7 h-7 rounded-full border border-white/20"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <div className="font-medium text-white text-[11px] leading-tight">
                    {userInfo?.displayName || user.displayName || 'Aman Visual'}
                  </div>
                  <div className="text-[10px] text-white/40 leading-tight">
                    {user.email}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 border border-white/15 hover:border-white text-[11px] uppercase tracking-wider text-white/60 hover:text-white transition-colors inline-flex items-center gap-1.5"
                title="Sign out of Google"
              >
                <LogOut size={12} />
                Disconnect
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-8 flex-1">
        {/* Not Authenticated State */}
        {!token ? (
          <div className="max-w-2xl mx-auto py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <HardDrive size={32} className="text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tight mb-4">
              Connect Google Drive
            </h2>
            <p className="text-white/60 text-sm md:text-base leading-relaxed mb-8 max-w-lg mx-auto font-light">
              Connect your Google Drive account to view project footage, client deliverables, 
              FPV drone flythroughs, and commercial production assets right from your portfolio workspace.
            </p>

            {authError && (
              <div className="mb-6 p-4 bg-red-950/40 border border-red-500/30 text-red-200 text-xs text-left flex items-start gap-2.5 max-w-md mx-auto">
                <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Official Google Sign-In Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="gsi-material-button bg-white text-[#1f1f1f] hover:bg-white/95 px-6 py-3.5 border border-transparent flex items-center gap-3 transition-all cursor-pointer shadow-xl disabled:opacity-50"
              >
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
                <span className="font-medium text-xs tracking-wider uppercase">
                  {isLoggingIn ? 'Connecting...' : 'Sign in with Google'}
                </span>
              </button>
            </div>

            <div className="mt-8 text-white/30 text-xs">
              Direct and secure connection using Google Drive API v3.
            </div>
          </div>
        ) : (
          <div>
            {/* Storage Quota & Toolbar Bar */}
            <div className="bg-[#121212] border border-white/10 p-5 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">
                  Connected Drive Account
                </span>
                <div className="text-sm font-medium text-white flex items-center gap-2">
                  <span>{userInfo?.displayName || user.displayName || 'Google Account'}</span>
                  <span className="text-white/40 text-xs font-mono">({user.email})</span>
                </div>
                {quota?.usage && (
                  <p className="text-[11px] text-white/50 mt-1">
                    Storage used: <strong className="text-white">{formatBytes(quota.usage)}</strong>
                    {quota.limit ? ` of ${formatBytes(quota.limit)}` : ''}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2.5 bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-white/90 transition-colors inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Upload size={14} className={isUploading ? 'animate-bounce' : ''} />
                  {isUploading ? 'Uploading...' : 'Upload File'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowFolderModal(true)}
                  className="px-4 py-2.5 border border-white/20 hover:border-white text-white text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                >
                  <FolderPlus size={14} />
                  New Folder
                </button>

                <button
                  type="button"
                  onClick={loadDriveData}
                  disabled={loadingFiles}
                  className="p-2.5 border border-white/15 hover:border-white text-white/60 hover:text-white transition-colors"
                  title="Refresh files"
                >
                  <RefreshCw size={14} className={loadingFiles ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* Status alerts */}
            {uploadSuccess && (
              <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{uploadSuccess}</span>
                </div>
                <button onClick={() => setUploadSuccess(null)} className="text-emerald-400 hover:text-white">
                  <X size={14} />
                </button>
              </div>
            )}

            {authError && (
              <div className="mb-6 p-4 bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{authError}</span>
                </div>
                <button onClick={() => setAuthError(null)} className="text-red-400 hover:text-white">
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Breadcrumb Navigation & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-xs overflow-x-auto py-1">
                {folderHistory.map((folder, index) => (
                  <div key={folder.id} className="flex items-center gap-2 shrink-0">
                    {index > 0 && <span className="text-white/30">/</span>}
                    <button
                      onClick={() => {
                        setFolderHistory((prev) => prev.slice(0, index + 1));
                      }}
                      className={`hover:text-white transition-colors ${
                        index === folderHistory.length - 1
                          ? 'text-white font-semibold underline underline-offset-4'
                          : 'text-white/50'
                      }`}
                    >
                      {folder.name}
                    </button>
                  </div>
                ))}
              </div>

              {/* Search form */}
              <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
                <Search size={14} className="absolute left-3 top-2.5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search in Drive..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 pl-9 pr-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors"
                />
              </form>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 border-b border-white/5">
              {(['all', 'videos', 'images', 'folders', 'documents'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setActiveFilter(filterKey)}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors shrink-0 ${
                    activeFilter === filterKey
                      ? 'bg-white text-black font-semibold'
                      : 'bg-[#121212] border border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  {filterKey}
                </button>
              ))}
            </div>

            {/* Files & Folders Grid */}
            {loadingFiles ? (
              <div className="p-20 text-center text-white/40 text-xs">
                <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-white/60" />
                Loading Google Drive files...
              </div>
            ) : files.length === 0 ? (
              <div className="bg-[#121212] border border-white/5 p-16 text-center">
                <Folder size={36} className="mx-auto text-white/20 mb-3" />
                <h3 className="text-base font-display uppercase text-white mb-1">No Files Found</h3>
                <p className="text-xs text-white/40">
                  {searchTerm ? 'No items match your search term.' : 'This folder is currently empty.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {files.map((file) => {
                  const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
                  const isImage = file.mimeType.startsWith('image/');
                  const isVideo = file.mimeType.startsWith('video/');

                  return (
                    <div
                      key={file.id}
                      className="bg-[#121212] border border-white/10 hover:border-white/30 p-4 transition-all flex flex-col justify-between group"
                    >
                      {/* Top icon and title */}
                      <div className="flex items-center gap-2 mb-3 overflow-hidden">
                        <div
                          className="flex items-center gap-2 cursor-pointer flex-1 overflow-hidden"
                          onClick={() => {
                            if (isFolder) {
                              setFolderHistory((prev) => [...prev, { id: file.id, name: file.name }]);
                            }
                          }}
                        >
                          {isFolder ? (
                            <Folder size={20} className="text-amber-400 shrink-0" />
                          ) : isImage ? (
                            <ImageIcon size={20} className="text-emerald-400 shrink-0" />
                          ) : isVideo ? (
                            <Film size={20} className="text-sky-400 shrink-0" />
                          ) : (
                            <FileText size={20} className="text-white/60 shrink-0" />
                          )}

                          <span 
                            className="text-xs font-medium text-white truncate group-hover:text-white"
                            title={file.name}
                          >
                            {file.name}
                          </span>
                        </div>
                      </div>

                      {/* Thumbnail Preview if available */}
                      {file.thumbnailLink && (
                        <div 
                          className="h-28 w-full bg-black/50 overflow-hidden mb-3 border border-white/5 flex items-center justify-center cursor-pointer"
                          onClick={() => {
                            if (file.webViewLink) window.open(file.webViewLink, '_blank');
                          }}
                        >
                          <img
                            src={file.thumbnailLink}
                            alt={file.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="text-[11px] text-white/40 pt-2 border-t border-white/5 flex items-center justify-between">
                        <span>{formatBytes(file.size) || (isFolder ? 'Folder' : 'File')}</span>
                        
                        <div className="flex items-center gap-2">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-white transition-colors inline-flex items-center gap-1 text-[10px] uppercase tracking-wider"
                              title="Open in Google Drive"
                            >
                              Open <ExternalLink size={11} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* New Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#121212] border border-white/20 p-6 shadow-2xl">
            <h3 className="text-base font-display uppercase font-bold text-white mb-4">
              Create New Folder
            </h3>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <input
                type="text"
                placeholder="e.g. Worli Drone Shoot 2025"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
                required
                className="w-full bg-black/60 border border-white/20 px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="px-4 py-2 border border-white/10 text-white/60 hover:text-white text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingFolder}
                  className="px-4 py-2 bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-white/90 disabled:opacity-50"
                >
                  {isCreatingFolder ? 'Creating...' : 'Create Folder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
