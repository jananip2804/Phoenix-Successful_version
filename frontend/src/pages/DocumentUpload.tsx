import React, { useState, useCallback } from 'react';
import { UploadCloud, File as FileIcon, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, get, update, set } from 'firebase/database';
import { rtdb } from '../services/firebase';

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
      setStatus('idle');
      setProgress(0);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    
    // Fake progress interval while uploading
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + 10, 90)); // Cap at 90% until done
    }, 200);

    try {
      const newDocId = `doc_${Date.now()}`;
      // Extract keywords from filename
      let newKeywords = file.name.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(' ').filter(w => w.length > 3).slice(0, 3);
      if (newKeywords.length === 0) newKeywords.push('upload');
      
      const newDoc = {
        filename: file.name,
        title: file.name.split('.')[0].replace(/[-_]/g, ' '),
        fileType: file.type || 'unknown',
        fileSize: file.size,
        uploadTimestamp: Date.now(),
        processingStatus: 'completed',
        documentInsights: {
          reading_time_minutes: Math.max(1, Math.floor(file.size / 50000)),
          sentiment: 'neutral',
          key_entities: newKeywords.map(k => k.charAt(0).toUpperCase() + k.slice(1))
        },
        keywords: newKeywords
      };

      // 1. Save document
      await set(ref(rtdb, `documents/${newDocId}`), newDoc);

      // 2. Update Graph
      const graphRef = ref(rtdb, 'graph/main');
      const graphSnap = await get(graphRef);
      let nodes = [];
      let edges = [];
      if (graphSnap.exists()) {
        const gData = graphSnap.val();
        nodes = gData.nodes || [];
        edges = gData.edges || [];
      }

      nodes.push({ id: newDocId, label: newDoc.title, type: 'document' });
      
      newKeywords.forEach(kw => {
        const kwId = `kw_${kw}`;
        if (!nodes.find((n: any) => n.id === kwId)) {
          nodes.push({ id: kwId, label: kw.charAt(0).toUpperCase() + kw.slice(1), type: 'keyword' });
        }
        edges.push({ id: `e_${newDocId}_${kwId}`, source: newDocId, target: kwId });
      });
      
      await set(graphRef, { nodes, edges });

      // 3. Update Analytics
      const analyticsRef = ref(rtdb, 'analytics/main');
      const analyticsSnap = await get(analyticsRef);
      const data = analyticsSnap.exists() ? analyticsSnap.val() : {};
      await update(analyticsRef, {
          totalUploads: (data.totalUploads || 0) + 1,
          processedDocuments: (data.processedDocuments || 0) + 1,
          keywordsExtracted: (data.keywordsExtracted || 0) + newKeywords.length,
          knowledgeConnections: (data.knowledgeConnections || 0) + newKeywords.length
      });

      clearInterval(progressInterval);
      setProgress(100);
      setStatus('success');
      
      setTimeout(() => {
        setFile(null);
        setStatus('idle');
        setProgress(0);
      }, 3000);
    } catch (err) {
      console.error("Upload failed", err);
      clearInterval(progressInterval);
      setStatus('error');
    }
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
            <input type="file" className="hidden" onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
                setStatus('idle');
                setProgress(0);
              }
            }} />
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
                <button onClick={handleUpload} className="btn-premium px-4 py-2 bg-primary text-white font-medium rounded-lg">
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
            
            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-3 py-1.5 rounded-lg">
                <X size={18} />
                <span className="text-sm font-medium">Failed</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
