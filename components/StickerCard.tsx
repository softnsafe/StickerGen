import React, { useState } from 'react';
import { Sticker } from '../types';
import { Download, Trash2, Code, ImageOff } from 'lucide-react';

export interface StickerCardProps {
  sticker: Sticker;
  onDelete?: (id: string) => void;
  onShowConfig?: (sticker: Sticker) => void;
  readOnly?: boolean;
}

export const StickerCard: React.FC<StickerCardProps> = ({ 
  sticker, 
  onDelete, 
  onShowConfig, 
  readOnly = false 
}) => {
  const [imgError, setImgError] = useState(false);

  // Helper to convert Google Drive links to embed-friendly URLs
  const getDisplayUrl = (url: string) => {
    if (!url) return '';
    
    // Check for common Google Drive URL patterns
    if (url.includes('drive.google.com')) {
      // Regex to capture the ID from:
      // - https://drive.google.com/file/d/ID/view
      // - https://drive.google.com/uc?id=ID
      // - https://drive.google.com/open?id=ID
      const idMatch = url.match(/(?:file\/d\/|id=)([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        // Use the thumbnail API which is more permissive for public files
        // sz=s4096 requests a large version (up to 4096px)
        return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=s4096`;
      }
    }
    return url;
  };

  const displayUrl = getDisplayUrl(sticker.url);
  const isExternalUrl = displayUrl.startsWith('http');

  const handleDownload = () => {
    const link = document.createElement('a');
    // For download, if it's a Drive link, we might prefer the direct download link
    // but the thumbnail link is safer for avoiding CORS/Auth issues in the browser.
    link.href = displayUrl; 
    link.target = "_blank"; 
    
    let filename = `sticker-${sticker.id}.png`;

    if (sticker.url.startsWith('data:')) {
      const safePrompt = sticker.prompt
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 60);
      
      if (safePrompt) {
        filename = `${safePrompt}.png`;
      }
      link.download = filename;
    } else {
      // For external/local URLs
      const parts = sticker.url.split('/');
      const lastPart = parts.pop();
      if (lastPart && !lastPart.includes('=')) { 
        filename = lastPart.split('?')[0]; 
      }
      link.download = filename;
    }
      
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 p-4 flex flex-col items-center">
      <div className="relative w-full aspect-square flex items-center justify-center bg-slate-50/50 rounded-xl overflow-hidden mb-3 border border-slate-100/50">
        {/* Lighter, more subtle checkerboard pattern */}
        <div className="absolute inset-0 opacity-30" 
             style={{ 
               backgroundImage: 'linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)',
               backgroundSize: '20px 20px',
               backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' 
             }} 
        />
        
        {!imgError ? (
          <img 
            src={displayUrl} 
            alt={sticker.prompt} 
            onError={() => setImgError(true)}
            // Important: no-referrer is often needed for Drive images to load
            referrerPolicy="no-referrer"
            // added drop-shadow to make white borders pop against light backgrounds
            className="relative z-10 w-full h-full object-contain hover:scale-110 transition-transform duration-500 drop-shadow-lg filter" 
          />
        ) : (
          <div className="relative z-10 flex flex-col items-center justify-center text-gray-400 h-full w-full p-4 text-center">
            <div className="bg-gray-100 p-3 rounded-full mb-2">
              <ImageOff size={24} className="text-gray-400" />
            </div>
            <span className="text-xs font-semibold text-gray-500">Image Not Found</span>
            <span className="text-[10px] text-gray-400 mt-1 break-all line-clamp-2 px-2">
              {sticker.url}
            </span>
            <p className="text-[9px] text-red-400 mt-2 leading-tight">
              {isExternalUrl 
                ? "Check URL permissions (e.g. 'Anyone with link')" 
                : "Check if file exists in /public/images/"}
            </p>
          </div>
        )}
      </div>
      
      <div className="w-full">
        <p className="text-xs text-slate-500 font-medium truncate mb-3 text-center" title={sticker.prompt}>
          {sticker.prompt}
        </p>
        
        <div className="flex gap-2 justify-between opacity-90 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleDownload}
            disabled={imgError}
            className={`flex items-center justify-center gap-1 bg-brand-400 hover:bg-brand-500 text-white text-sm py-2 px-3 rounded-xl transition-all font-medium shadow-sm hover:shadow-md active:scale-95 flex-1 ${imgError ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Download size={16} />
            <span className="hidden sm:inline">Save</span>
          </button>
          
          {!readOnly && onShowConfig && (
            <button 
              onClick={() => onShowConfig(sticker)}
              className="flex items-center justify-center gap-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-brand-500 text-sm py-2 px-3 rounded-xl transition-colors shadow-sm active:scale-95"
              title="Get Gallery Code"
            >
              <Code size={16} />
            </button>
          )}

          {!readOnly && onDelete && (
            <button 
              onClick={() => onDelete(sticker.id)}
              className="flex items-center justify-center gap-1 bg-white border border-red-100 text-red-400 hover:bg-red-50 text-sm py-2 px-3 rounded-xl transition-colors shadow-sm active:scale-95"
              title="Delete Sticker"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};