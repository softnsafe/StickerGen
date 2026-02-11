import React, { useState, useCallback } from 'react';
import { Hero } from './components/Hero';
import { StickerCard } from './components/StickerCard';
import { GalleryConfigHelper } from './components/GalleryConfigHelper';
import { generateStickerImage } from './services/geminiService';
import { Sticker, StickerStyle } from './types';
import { GALLERY_IMAGES } from './data/gallery';
import { Loader2, Plus, AlertCircle, Sparkles, Image as ImageIcon, PenTool, GitBranch, Upload, FileJson, FileCode } from 'lucide-react';

const STYLES: StickerStyle[] = ['Cute', 'Cool', 'Retro', 'Cyberpunk', 'Sketch', '3D Render'];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'gallery'>('create');
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StickerStyle>('Cute');
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Gallery Helper State
  const [showConfigHelper, setShowConfigHelper] = useState(false);
  const [helperInitialPrompt, setHelperInitialPrompt] = useState('');
  
  // Temporary preview stickers for the gallery (cleared on refresh)
  const [previewStickers, setPreviewStickers] = useState<Sticker[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const imageUrl = await generateStickerImage(prompt, selectedStyle);
      
      const newSticker: Sticker = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: `${selectedStyle} sticker of ${prompt}`,
        createdAt: Date.now(),
      };

      setStickers(prev => [newSticker, ...prev]);
      setPrompt(''); // Optional: clear prompt after success
    } catch (err: any) {
      setError(err.message || 'Something went wrong while generating the sticker.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = useCallback((id: string) => {
    setStickers(prev => prev.filter(s => s.id !== id));
  }, []);

  // Handler for opening editor with a specific sticker (from sticker card)
  const handleConfigureSticker = (sticker: Sticker) => {
    setHelperInitialPrompt(sticker.prompt);
    setShowConfigHelper(true);
  };

  // Handler for opening editor from scratch (from button)
  const handleOpenEditor = () => {
    setHelperInitialPrompt('');
    setShowConfigHelper(true);
  };
  
  const handleAddPreview = (sticker: Sticker) => {
    setPreviewStickers(prev => [sticker, ...prev]);
    setShowConfigHelper(false);
    setActiveTab('gallery');
  };

  const combinedGallery = [...previewStickers, ...GALLERY_IMAGES];

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col">
      <main className="flex-grow container mx-auto px-4 pb-20">
        <Hero />

        {/* Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-xl shadow-sm border border-brand-100 inline-flex gap-1">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'create'
                  ? 'bg-brand-100 text-brand-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <PenTool size={16} />
              Create
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'gallery'
                  ? 'bg-brand-100 text-brand-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ImageIcon size={16} />
              Gallery
            </button>
          </div>
        </div>

        {activeTab === 'create' ? (
          <>
            {/* Input Section */}
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-12 border border-brand-100 transform transition-all hover:shadow-2xl">
              <form onSubmit={handleGenerate} className="space-y-6">
                <div>
                  <label htmlFor="prompt" className="block text-sm font-semibold text-gray-700 mb-2">
                    What do you want to create?
                  </label>
                  <div className="relative">
                    <input
                      id="prompt"
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., A happy corgi eating pizza"
                      className="w-full pl-5 pr-4 py-4 rounded-xl border-2 border-brand-100 focus:border-brand-500 focus:ring focus:ring-brand-200 focus:ring-opacity-50 transition-all text-lg placeholder-gray-400 outline-none"
                      disabled={isGenerating}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Choose a Style
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {STYLES.map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setSelectedStyle(style)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                          selectedStyle === style
                            ? 'bg-brand-100 border-brand-500 text-brand-800 scale-105 shadow-sm'
                            : 'bg-white border-gray-100 text-gray-600 hover:border-brand-200 hover:bg-gray-50'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 flex items-center gap-2 text-sm animate-pulse">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isGenerating || !prompt.trim()}
                  className={`w-full py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-lg font-bold text-white transition-all transform ${
                    isGenerating || !prompt.trim()
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-brand-500 to-orange-600 hover:from-brand-600 hover:to-orange-700 hover:scale-[1.02] shadow-lg shadow-brand-200'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Creating Magic...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Sticker
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Results Section */}
            {stickers.length > 0 && (
              <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Your Collection</h2>
                  <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                    {stickers.length} {stickers.length === 1 ? 'sticker' : 'stickers'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {stickers.map((sticker) => (
                    <StickerCard 
                      key={sticker.id} 
                      sticker={sticker} 
                      onDelete={handleDelete}
                      onShowConfig={handleConfigureSticker}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {stickers.length === 0 && !isGenerating && (
              <div className="text-center py-20 opacity-50">
                <div className="inline-block p-6 rounded-full bg-brand-100 mb-4">
                   <Plus className="w-12 h-12 text-brand-400" />
                </div>
                <p className="text-lg text-gray-500 font-medium">No stickers yet. Create your first one!</p>
              </div>
            )}
          </>
        ) : (
          /* Gallery Tab Content */
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Community Gallery</h2>
                <p className="text-gray-600 max-w-lg mx-auto">
                  Explore stickers created by the community. Add yours by submitting a Pull Request!
                </p>
                
                <button 
                  onClick={handleOpenEditor}
                  className="mt-6 inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium bg-white px-5 py-2.5 rounded-full border border-brand-200 shadow-sm hover:bg-brand-50 transition-colors"
                >
                  <FileCode size={16} />
                  Gallery Editor
                </button>
             </div>

            {combinedGallery.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {combinedGallery.map((sticker) => (
                  <StickerCard 
                    key={sticker.id} 
                    sticker={sticker} 
                    readOnly={true}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-dashed border-brand-200 p-8 sm:p-12 text-center max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-gray-800 mb-6">How to add stickers to the Gallery</h3>
                
                <div className="space-y-6 text-left max-w-lg mx-auto">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <GitBranch size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">1. Setup Folders or Use Drive</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Upload to <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">public/images</code> in your repo, or use a Google Drive link.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Upload size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">2. Generate Code</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Use the <strong>"Gallery Editor"</strong> button above to test your image and generate the config code.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <FileJson size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">3. Update Config</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Paste the generated code into <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">data/gallery.ts</code> and deploy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Config Helper Modal */}
      {showConfigHelper && (
        <GalleryConfigHelper 
          onClose={() => setShowConfigHelper(false)} 
          initialPrompt={helperInitialPrompt}
          onAddPreview={handleAddPreview}
        />
      )}

      {/* Simple Footer */}
      <footer className="py-8 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} StickerGenie. Powered by Gemini Nano Banana.</p>
      </footer>
    </div>
  );
};

export default App;