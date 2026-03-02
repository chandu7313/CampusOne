import { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';

const FileUpload = ({ 
  onUpload, 
  maxSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'],
  multiple = true 
}) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (file.size > maxSize) {
      return `File too large: ${file.name} (Max ${maxSize / (1024 * 1024)}MB)`;
    }
    if (!allowedTypes.some(type => {
      if (type.endsWith('/*')) return file.type.startsWith(type.replace('/*', ''));
      return type === file.type;
    })) {
      return `Invalid file type: ${file.name}`;
    }
    return null;
  };

  const handleFiles = (newFiles) => {
    setError(null);
    const validFiles = [];
    let currentError = null;

    Array.from(newFiles).forEach(file => {
      const err = validateFile(file);
      if (err) {
        currentError = err;
      } else {
        const reader = new FileReader();
        const fileObj = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: file.type.startsWith('image/') ? null : 'pdf',
          progress: 0,
          status: 'idle'
        };

        if (file.type.startsWith('image/')) {
          reader.onloadend = () => {
            setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, preview: reader.result } : f));
          };
          reader.readAsDataURL(file);
        }
        validFiles.push(fileObj);
      }
    });

    if (currentError) setError(currentError);
    setFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
    
    // Auto-trigger upload placeholder
    validFiles.forEach(f => simulateUpload(f.id));
  };

  const simulateUpload = (id) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'uploading' } : f));
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: 100, status: 'completed' } : f));
      } else {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, progress } : f));
      }
    }, 500);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full">
      <div 
        className="border-2 border-dashed border-white/10 rounded-xl p-10 text-center transition-all duration-300 bg-white/3 cursor-pointer flex flex-col items-center gap-4 hover:border-primary hover:bg-primary/10"
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center text-primary">
          <Upload size={32} />
        </div>
        <div>
          <p className="font-semibold text-white">Drop files here or click to upload</p>
          <p className="text-sm text-white/40 mt-1">
            Supports: JPG, PNG, PDF (Max 5MB)
          </p>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          hidden 
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          accept={allowedTypes.join(',')}
        />
      </div>

      {error && (
        <div className="text-rose-500 text-sm mt-3 flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4 mt-6">
          {files.map((fileObj) => (
            <div key={fileObj.id} className="relative aspect-square rounded-lg overflow-hidden border border-white/5 bg-white/3">
              {fileObj.preview === 'pdf' ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/40">
                  <FileText size={32} />
                  <span className="text-[0.7rem] uppercase font-bold tracking-wider">PDF File</span>
                </div>
              ) : fileObj.preview ? (
                <img src={fileObj.preview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/40">
                  <ImageIcon size={32} />
                </div>
              )}
              
              <button 
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white border-none flex items-center justify-center cursor-pointer backdrop-blur-md transition-colors hover:bg-rose-500" 
                onClick={(e) => { e.stopPropagation(); removeFile(fileObj.id); }}
              >
                <X size={14} />
              </button>

              {fileObj.status === 'uploading' && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                  <div className="h-full bg-primary transition-[width] duration-300" style={{ width: `${fileObj.progress}%` }}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
