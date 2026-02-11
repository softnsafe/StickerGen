import React, { useState, useEffect } from 'react';
import { Copy, Check, X, Info, Globe, HardDrive, Eye, AlertTriangle, ImageIcon } from 'lucide-react';
import { Sticker } from '../types';

export interface GalleryConfigHelperComponentProps {
  onClose: () => void;
  initialPrompt?: string;
  onAddPreview: (sticker: Sticker) => void;
}

export const GalleryConfigHelper = ({ 
  onClose, 
  initialPrompt = '', 
  onAddPreview 
}: GalleryConfigHelperComponentProps) => {
  const [mode, setMode] = useState<'local' | 'external'>('local');
  const [filename, setFilename] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [prompt, setPrompt] = useState(initialPrompt);
  const [copied, setCopied] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const getDirectUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return '';
    
    // Regex to find the File ID from various Google Drive URL formats:
    // 1. https://drive.google.com/file/d/ID/view...
    // 2. https://drive.google.com/open?id=ID
    // 3. https://drive.google.com/uc?id=ID&...
    const driveRegex = /(?:file\/d\/|id=)([a-zA-Z0-9_-]+)/;
    const match = trimmed.match(driveRegex);
    
    if (match && match[1]) {
      // Use lh3.googleusercontent.com/d/ID which is more reliable for embedding than drive.google.com/uc
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
    
    return trimmed;
  };

  const currentUrl = mode === 'local' 
    ? (filename ? `/images/${filename.trim().replace(/^[\/\\]?images[\/\\]?/, '').replace(/^\/+/, '')}` : '/images/your-file.png')
    : getDirectUrl(externalUrl);

  const snippet = `{
  id: 'sticker-${Date.now()}',
  url: '${currentUrl}',
  prompt: '${prompt.replace(/'/g, "\\'") || 'Your prompt here'}',
  createdAt: ${Date.now()},
},`;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToPreview = () => {
    const newSticker: Sticker = {
        id: `preview-${Date.now()}`,
        url: currentUrl,
        prompt: prompt || 'Preview Sticker',
        createdAt: Date.now(),
    };
    onAddPreview(newSticker);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            Gallery Editor
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => { setMode('local'); setPreviewError(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${mode === 'local' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <HardDrive size={16} />
              GitHub Repo File
            </button>
            <button
              onClick={() => { setMode('external'); setPreviewError(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${mode === 'external' ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Globe size={16} />
              Google Drive / URL
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              {mode === 'local' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filename in <code>/public/images/</code></label>
                  <input 
                    type="text" 
                    value={filename}
                    onChange={e => { setFilename(e.target.value); setPreviewError(false); }}
                    placeholder="my-sticker.png"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">File must be committed to GitHub.</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Google Drive supported)</label>
                  <input 
                    type="text" 
                    value={externalUrl}
                    onChange={e => { setExternalUrl(e.target.value); setPreviewError(false); }}
                    placeholder="Paste your Drive link here..."
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">Drive link must be "Anyone with the link".</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prompt / Description</label>
                <input 
                  type="text" 
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="e.g. A retro robot drinking coffee"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 flex flex-col items-center justify-center min-h-[200px]">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Live Preview</h4>
                {currentUrl && !previewError ? (
                    <div className="relative w-32 h-32 md:w-40 md:h-40">
                        <img 
                            src={currentUrl} 
                            alt="Preview" 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain drop-shadow-md"
                            onError={() => setPreviewError(true)}
                        />
                    </div>
                ) : (
                    <div className="text-center text-gray-400">
                        {previewError ? (
                            <>
                                <AlertTriangle size={32} className="mx-auto mb-2 text-red-400" />
                                <span className="text-xs text-red-400">Image failed to load</span>
                            </>
                        ) : (
                            <>
                                <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                                <span className="text-xs">Enter a valid path/URL</span>
                            </>
                        )}
                    </div>
                )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-3 mb-6">
            <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
            <p className="text-xs sm:text-sm text-blue-700">
              <strong>Tip:</strong> Click "Test in Gallery" to see how it looks instantly. To make it permanent, copy the code and paste it into <code>data/gallery.ts</code>.
            </p>
          </div>

          <div className="relative pt-2">
            <div className="flex justify-between items-end mb-2">
               <label className="block text-sm font-medium text-gray-700">Generated Code</label>
               <span className="text-xs text-gray-400">For data/gallery.ts</span>
            </div>
            
            <div className="relative group">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs sm:text-sm overflow-x-auto font-mono border border-slate-700 shadow-inner">
                {snippet}
              </pre>
              <button 
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Copy to clipboard"
              >
                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors shadow-sm"
          >
            Close
          </button>
          <button 
            onClick={handleAddToPreview}
            disabled={!currentUrl || previewError}
            className={`px-5 py-2.5 rounded-xl text-white font-medium transition-colors shadow-lg flex items-center gap-2 ${
                !currentUrl || previewError ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700'
            }`}
          >
            <Eye size={18} />
            Test in Gallery
          </button>
        </div>
      </div>
    </div>
  );
};
