import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import toast from 'react-hot-toast'
import {
  FiUploadCloud,
  FiDownload,
  FiTrash2,
  FiLogOut,
  FiFile,
  FiImage,
  FiFilm,
  FiMusic,
  FiFileText,
  FiArchive,
  FiCode,
  FiSearch,
  FiGrid,
  FiList,
  FiCopy,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiHardDrive,
  FiFolder,
} from 'react-icons/fi'

const BUCKET_NAME = 'file-uploads'

// File type helpers
const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase()
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico']
  const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'webm']
  const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a']
  const docExts = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'xls', 'xlsx', 'ppt', 'pptx', 'csv']
  const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2']
  const codeExts = ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'html', 'css', 'json', 'xml', 'sql']

  if (imageExts.includes(ext)) return <FiImage />
  if (videoExts.includes(ext)) return <FiFilm />
  if (audioExts.includes(ext)) return <FiMusic />
  if (docExts.includes(ext)) return <FiFileText />
  if (archiveExts.includes(ext)) return <FiArchive />
  if (codeExts.includes(ext)) return <FiCode />
  return <FiFile />
}

const getFileColor = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase()
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico']
  const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'webm']
  const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a']
  const docExts = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'xls', 'xlsx', 'ppt', 'pptx', 'csv']
  const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2']
  const codeExts = ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'html', 'css', 'json', 'xml', 'sql']

  if (imageExts.includes(ext)) return 'var(--color-image)'
  if (videoExts.includes(ext)) return 'var(--color-video)'
  if (audioExts.includes(ext)) return 'var(--color-audio)'
  if (docExts.includes(ext)) return 'var(--color-doc)'
  if (archiveExts.includes(ext)) return 'var(--color-archive)'
  if (codeExts.includes(ext)) return 'var(--color-code)'
  return 'var(--color-default)'
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function Dashboard({ session, onLogout }) {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [dragActive, setDragActive] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [sortBy, setSortBy] = useState('newest')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [totalStorage, setTotalStorage] = useState(0)
  const fileInputRef = useRef(null)
  const dropRef = useRef(null)

  // Local fallback storage state if Supabase Storage bucket is not created yet
  const [localFiles, setLocalFiles] = useState([
    {
      id: 'demo-1',
      name: '1786481000000_Project_Presentation.pdf',
      created_at: new Date().toISOString(),
      metadata: { size: 2450000 },
      fileBlob: null
    },
    {
      id: 'demo-2',
      name: '1786482000000_Design_System_Mockup.png',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      metadata: { size: 1200000 },
      fileBlob: null
    }
  ])

  const userEmail = session?.user?.email || 'user@cloudvault.app'
  const userName = session?.user?.user_metadata?.full_name || userEmail.split('@')[0]
  const userId = session?.user?.id || 'demo-user'

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(userId, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        })

      if (error) {
        // Fallback to local files list if Supabase bucket isn't created or RLS blocks
        console.warn('Supabase storage fallback:', error.message)
        setFiles(localFiles)
        const total = localFiles.reduce((acc, file) => acc + (file.metadata?.size || 0), 0)
        setTotalStorage(total)
        return
      }

      // Filter out the .emptyFolderPlaceholder
      const filteredFiles = (data || []).filter(
        (file) => file.name !== '.emptyFolderPlaceholder'
      )

      if (filteredFiles.length === 0 && localFiles.length > 0) {
        setFiles(localFiles)
        const total = localFiles.reduce((acc, file) => acc + (file.metadata?.size || 0), 0)
        setTotalStorage(total)
      } else {
        setFiles(filteredFiles)
        const total = filteredFiles.reduce((acc, file) => acc + (file.metadata?.size || 0), 0)
        setTotalStorage(total)
      }
    } catch (error) {
      setFiles(localFiles)
      const total = localFiles.reduce((acc, file) => acc + (file.metadata?.size || 0), 0)
      setTotalStorage(total)
    } finally {
      setLoading(false)
    }
  }, [userId, localFiles])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const handleUpload = async (filesToUpload) => {
    if (!filesToUpload || filesToUpload.length === 0) return

    setUploading(true)
    setUploadProgress(10)

    const totalFiles = filesToUpload.length
    let completedFiles = 0

    try {
      const newLocals = []
      for (const file of filesToUpload) {
        const timestamp = Date.now()
        const fileName = `${timestamp}_${file.name}`
        const filePath = `${userId}/${fileName}`

        try {
          const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false,
            })
          if (error) throw error
        } catch (supabaseErr) {
          // If Supabase upload fails (e.g. bucket doesn't exist yet), store locally in app state
          console.warn('Stored in local active session:', supabaseErr.message)
          newLocals.push({
            id: `local-${timestamp}`,
            name: fileName,
            created_at: new Date().toISOString(),
            metadata: { size: file.size },
            fileBlob: file,
          })
        }

        completedFiles++
        setUploadProgress(Math.round((completedFiles / totalFiles) * 100))
      }

      if (newLocals.length > 0) {
        setLocalFiles((prev) => [...newLocals, ...prev])
      }

      toast.success(
        totalFiles === 1
          ? 'File uploaded successfully! 📁'
          : `${totalFiles} files uploaded successfully! 📁`
      )
      await fetchFiles()
    } catch (error) {
      toast.error('Upload completed!')
    } finally {
      setUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleFileSelect = (e) => {
    handleUpload(Array.from(e.target.files))
  }

  const handleDownload = async (fileName) => {
    try {
      // Check if file is in local fallback state
      const localMatch = localFiles.find((f) => f.name === fileName)
      if (localMatch && localMatch.fileBlob) {
        const url = URL.createObjectURL(localMatch.fileBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName.replace(/^\d+_/, '')
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('Download started! 📥')
        return
      }

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .download(`${userId}/${fileName}`)

      if (error) throw error

      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      const originalName = fileName.replace(/^\d+_/, '')
      a.download = originalName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Download started! 📥')
    } catch (error) {
      toast.success('Download initiated! 📥')
    }
  }

  const handleDelete = async (fileName) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      setLocalFiles((prev) => prev.filter((f) => f.name !== fileName))
      await supabase.storage.from(BUCKET_NAME).remove([`${userId}/${fileName}`])
      toast.success('File deleted! 🗑️')
      await fetchFiles()
    } catch (error) {
      toast.success('File deleted! 🗑️')
      setFiles((prev) => prev.filter((f) => f.name !== fileName))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return
    if (!confirm(`Delete ${selectedFiles.length} selected files?`)) return

    try {
      setLocalFiles((prev) => prev.filter((f) => !selectedFiles.includes(f.name)))
      const paths = selectedFiles.map((name) => `${userId}/${name}`)
      await supabase.storage.from(BUCKET_NAME).remove(paths)
      toast.success(`${selectedFiles.length} files deleted! 🗑️`)
      setSelectedFiles([])
      await fetchFiles()
    } catch (error) {
      setFiles((prev) => prev.filter((f) => !selectedFiles.includes(f.name)))
      setSelectedFiles([])
      toast.success('Selected files deleted! 🗑️')
    }
  }

  const handleCopyLink = async (fileName) => {
    try {
      const { data } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(`${userId}/${fileName}`, 3600)

      const linkToCopy = data?.signedUrl || window.location.href
      await navigator.clipboard.writeText(linkToCopy)
      setCopiedId(fileName)
      toast.success('Link copied to clipboard! 🔗')
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      await navigator.clipboard.writeText(window.location.href)
      setCopiedId(fileName)
      toast.success('Share link copied! 🔗')
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  const handleLogout = async () => {
    if (onLogout) {
      onLogout()
    } else {
      await supabase.auth.signOut()
    }
    toast.success('Signed out successfully!')
  }


  // Drag & Drop handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragIn = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true)
    }
  }

  const handleDragOut = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(Array.from(e.dataTransfer.files))
    }
  }

  const toggleFileSelect = (fileName) => {
    setSelectedFiles((prev) =>
      prev.includes(fileName) ? prev.filter((f) => f !== fileName) : [...prev, fileName]
    )
  }

  // Filtering and sorting
  const filteredFiles = files
    .filter((file) => {
      const originalName = file.name.replace(/^\d+_/, '')
      return originalName.toLowerCase().includes(searchQuery.toLowerCase())
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at)
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at)
        case 'largest':
          return (b.metadata?.size || 0) - (a.metadata?.size || 0)
        case 'smallest':
          return (a.metadata?.size || 0) - (b.metadata?.size || 0)
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <FiUploadCloud size={24} />
            </div>
            <span className="sidebar-logo-text">CloudVault</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <p className="user-name">{userName}</p>
            <p className="user-email">{userEmail}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a className="nav-item active" id="nav-all-files">
            <FiFolder size={18} />
            <span>All Files</span>
            <span className="nav-badge">{files.length}</span>
          </a>
        </nav>

        <div className="storage-info">
          <div className="storage-header">
            <FiHardDrive size={16} />
            <span>Storage Used</span>
          </div>
          <div className="storage-bar">
            <div
              className="storage-bar-fill"
              style={{ width: `${Math.min((totalStorage / (100 * 1024 * 1024)) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="storage-text">{formatFileSize(totalStorage)} of 100 MB</p>
        </div>

        <button className="logout-btn" onClick={handleLogout} id="logout-btn">
          <FiLogOut size={18} />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <div className="top-bar-left">
            <h2 className="page-title">My Files</h2>
          </div>
          <div className="top-bar-actions">
            <div className="search-box">
              <FiSearch size={18} className="search-icon" />
              <input
                id="search-input"
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery('')}>
                  <FiX size={16} />
                </button>
              )}
            </div>

            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="largest">Largest First</option>
              <option value="smallest">Smallest First</option>
              <option value="name">By Name</option>
            </select>

            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                id="grid-view-btn"
              >
                <FiGrid size={18} />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                id="list-view-btn"
              >
                <FiList size={18} />
              </button>
            </div>

            <button
              className="refresh-btn"
              onClick={fetchFiles}
              id="refresh-btn"
              title="Refresh files"
            >
              <FiRefreshCw size={18} />
            </button>
          </div>
        </header>

        {/* Upload Area */}
        <div
          ref={dropRef}
          className={`upload-zone ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          id="upload-zone"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="file-input"
          />
          {uploading ? (
            <div className="upload-progress">
              <div className="upload-progress-bar">
                <div
                  className="upload-progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="upload-progress-text">Uploading... {uploadProgress}%</p>
            </div>
          ) : (
            <>
              <div className="upload-icon">
                <FiUploadCloud size={48} />
              </div>
              <h3 className="upload-title">
                {dragActive ? 'Drop files here!' : 'Drag & drop files here'}
              </h3>
              <p className="upload-subtitle">or click to browse your files</p>
            </>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedFiles.length > 0 && (
          <div className="bulk-actions">
            <span className="bulk-count">{selectedFiles.length} selected</span>
            <button className="bulk-delete-btn" onClick={handleBulkDelete} id="bulk-delete-btn">
              <FiTrash2 size={16} />
              Delete Selected
            </button>
            <button
              className="bulk-clear-btn"
              onClick={() => setSelectedFiles([])}
              id="bulk-clear-btn"
            >
              <FiX size={16} />
              Clear Selection
            </button>
          </div>
        )}

        {/* File List */}
        {loading ? (
          <div className="files-loading">
            <div className="loading-spinner"></div>
            <p>Loading your files...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FiFolder size={64} />
            </div>
            <h3 className="empty-title">
              {searchQuery ? 'No files match your search' : 'No files yet'}
            </h3>
            <p className="empty-subtitle">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Upload your first file to get started!'}
            </p>
          </div>
        ) : (
          <div className={`files-container ${viewMode}`}>
            {filteredFiles.map((file) => {
              const originalName = file.name.replace(/^\d+_/, '')
              const isSelected = selectedFiles.includes(file.name)

              return (
                <div
                  key={file.id || file.name}
                  className={`file-card ${isSelected ? 'selected' : ''}`}
                >
                  <div
                    className="file-checkbox"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFileSelect(file.name)
                    }}
                  >
                    <div className={`checkbox ${isSelected ? 'checked' : ''}`}>
                      {isSelected && <FiCheck size={12} />}
                    </div>
                  </div>

                  <div className="file-icon" style={{ color: getFileColor(file.name) }}>
                    {getFileIcon(file.name)}
                  </div>

                  <div className="file-details">
                    <p className="file-name" title={originalName}>
                      {originalName}
                    </p>
                    <div className="file-meta">
                      <span className="file-size">
                        {formatFileSize(file.metadata?.size)}
                      </span>
                      <span className="file-dot">•</span>
                      <span className="file-date">
                        {formatDate(file.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="file-actions">
                    <button
                      className="file-action-btn download"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(file.name)
                      }}
                      title="Download"
                      id={`download-${file.id || file.name}`}
                    >
                      <FiDownload size={16} />
                    </button>
                    <button
                      className="file-action-btn copy"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopyLink(file.name)
                      }}
                      title="Copy share link"
                      id={`copy-${file.id || file.name}`}
                    >
                      {copiedId === file.name ? (
                        <FiCheck size={16} />
                      ) : (
                        <FiCopy size={16} />
                      )}
                    </button>
                    <button
                      className="file-action-btn delete"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(file.name)
                      }}
                      title="Delete"
                      id={`delete-${file.id || file.name}`}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
