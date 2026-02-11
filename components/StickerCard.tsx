import React from 'react';
import { Sticker } from '../types';
import { Download, Trash2 } from 'lucide-react';

interface StickerCardProps {
  sticker: Sticker;
  onDelete?: (id: string) => void;
  readOnly?: boolean;
}

export const StickerCard: React.FC<StickerCardProps> = ({ sticker, onDelete, readOnly = false }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = sticker.url;
    // Extract filename from URL if possible, otherwise use ID
    const filename = sticker.url.startsWith('data:') 
      ? `sticker-genie-${sticker.id}.png`
      : sticker.url.split('/').pop() || `sticker-${sticker.id}.png`;
      
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-brand-100 p-4 flex flex-col items-center">
      <div className="relative w-full aspect-square flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden mb-3">
        {/* Checkered pattern for transparency visualization */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
               backgroundSize: '20px 20px',
               backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' 
             }} 
        />
        <img 
          src={sticker.url} 
          alt={sticker.prompt} 
          className="relative z-10 w-full h-full object-contain hover:scale-105 transition-transform duration-500" 
        />
      </div>
      
      <div className="w-full">
        <p className="text-xs text-gray-500 font-medium truncate mb-3" title={sticker.prompt}>
          {sticker.prompt}
        </p>
        
        <div className="flex gap-2 justify-between">
          <button 
            onClick={handleDownload}
            className={`flex items-center justify-center gap-1 bg-brand-500 hover:bg-brand-600 text-white text-sm py-2 px-3 rounded-lg transition-colors font-medium shadow-sm active:scale-95 ${readOnly ? 'w-full' : 'flex-1'}`}
          >
            <Download size={16} />
            <span className="hidden sm:inline">Save</span>
          </button>
          
          {!readOnly && onDelete && (
            <button 
              onClick={() => onDelete(sticker.id)}
              className="flex items-center justify-center gap-1 bg-white border border-red-200 text-red-500 hover:bg-red-50 text-sm py-2 px-3 rounded-lg transition-colors shadow-sm active:scale-95"
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