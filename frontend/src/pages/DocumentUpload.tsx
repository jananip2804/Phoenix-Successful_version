import React, { useState, useCallback } from 'react';
import { UploadCloud, File as FileIcon, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DocumentUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleUpload = () => {
    if (!file) return;
    setStatus('uploading');
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('success');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="max-w-3xl mx-auto mt-12">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Upload Knowledge</h2>
        <p className="text-muted-foreground">Supported formats: PDF, CSV, Excel, TXT, JSON, ZIP</p>
      </div>

      <div 
        className={`glass-panel border-2 border-dashed rounded-3xl p-12 transition-all duration-300 ${
          isDragging ? 'border-primary bg-primary/5 scale-105' : 'border-card-border hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 bg-white/5 rounded-full text-primary mb-4">
            <UploadCloud size={48} />
          </div>
          <h3 className="text-xl font-semibold">Drag & Drop files here</h3>
          <p className="text-muted-foreground">or</p>
          <label className="cursor-pointer px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-gray-200 transition-colors">
            Browse Files
            <input type="file" className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
          </label>
        </div>
      </div>

      <AnimatePresence>
        {file && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 glass-panel p-4 rounded-2xl flex items-center gap-4"
          >
            <div className="p-3 bg-white/5 rounded-xl text-primary">
              <FileIcon size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{file.name}</p>
              <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            
            {status === 'idle' && (
              <div className="flex items-center gap-2">
                <button onClick={() => setFile(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-white">
                  <X size={20} />
                </button>
                <button onClick={handleUpload} className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">
                  Upload
                </button>
              </div>
            )}

            {status === 'uploading' && (
              <div className="w-32 flex items-center gap-3">
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
            )}

            {status === 'success' && (
              <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-3 py-1.5 rounded-lg">
                <CheckCircle size={18} />
                <span className="text-sm font-medium">Complete</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
