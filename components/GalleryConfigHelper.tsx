import React, { useState } from 'react';
import { Copy, Check, X, Info } from 'lucide-react';

interface GalleryConfigHelperProps {
  onClose: () => void;
}

export const GalleryConfigHelper: React.FC<GalleryConfigHelperProps> = ({ onClose }) => {
  const [filename, setFilename] = useState('');
  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  // Normalize filename to ensure it points to /images/
  const cleanFilename = filename.trim().replace(/^[\/\\]?images[\/\\]?/, '').replace(/^\/+/, '');
  const url = cleanFilename ? `/images/${cleanFilename}` : '/images/your-image.png';
  
  const snippet = `{
  id: 'sticker-${Date.now()}',
  url: '${url}',
  prompt: '${prompt.replace(/'/g, "\\'") || 'Your prompt here'}',
  createdAt: ${Date.now()},
},`;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            Gallery Config Generator
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-5 overflow-y-auto">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-3">
            <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-blue-700">
              Since this is a static site, you cannot edit <code>gallery.ts</code> directly from the browser. 
              Use this tool to generate the code, then paste it into your file manually.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image Filename</label>
            <div className="relative group">
              <span className="absolute left-3 top-3 text-gray-400 text-sm font-mono group-focus-within:text-brand-500">/images/</span>
              <input 
                type="text" 
                value={filename}
                onChange={e => setFilename(e.target.value)}
                placeholder="my-cool-sticker.png"
                className="w-full pl-[4.5rem] pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none transition-all font-mono text-sm"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1.5 ml-1">
              Make sure this file exists in your repo at <code>public/images/</code>
            </p>
          </div>

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

          <div className="relative pt-2">
            <div className="flex justify-between items-end mb-2">
               <label className="block text-sm font-medium text-gray-700">Generated Code</label>
               <span className="text-xs text-gray-400">Copy and paste into data/gallery.ts</span>
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

        <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};