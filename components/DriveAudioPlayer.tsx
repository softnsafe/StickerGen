import React, { useState, useRef } from 'react';
import { Play, Music, AlertCircle, Link as LinkIcon, ExternalLink, RefreshCw, HardDrive, Sparkles } from 'lucide-react';

export const DriveAudioPlayer: React.FC = () => {
  const [url, setUrl] = useState('');
  const [audioSrc, setAudioSrc] = useState('');
  const [error, setError] = useState('');
  const [playbackError, setPlaybackError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = (overrideUrl?: string) => {
    const targetUrl = overrideUrl || url;
    
    setError('');
    setPlaybackError(false);
    setAudioSrc('');
    
    const trimmedUrl = targetUrl.trim();
    if (!trimmedUrl) {
        setError('Please enter a URL.');
        return;
    }

    // Check if it is a Google Drive link
    const isDriveLink = trimmedUrl.includes('drive.google.com') || trimmedUrl.includes('docs.google.com');

    if (isDriveLink) {
        // Google Drive Logic
        const idMatch = trimmedUrl.match(/(?:file\/d\/|id=)([a-zA-Z0-9_-]+)/);
        
        if (idMatch && idMatch[1]) {
            const id = idMatch[1];
            // Using docs.google.com with confirm=t attempts to bypass virus scan interstitials
            const directLink = `https://docs.google.com/uc?export=download&id=${id}&confirm=t`;
            setAudioSrc(directLink);
        } else {
            setError('Invalid Google Drive URL. Could not find File ID.');
            return;
        }
    } else {
        // Standard URL or Local Path Logic
        setAudioSrc(trimmedUrl);
    }
    
    // If we used an override (like the sample button), update the input to match
    if (overrideUrl) {
        setUrl(overrideUrl);
    }

    // Reset audio element to ensure it picks up the new source
    // We use a small timeout to allow the state to propagate
    setTimeout(() => {
        if (audioRef.current) {
            audioRef.current.load();
        }
    }, 100);
  };

  const handleLoadSample = () => {
      // Use a reliable public audio sample for testing
      // This is a short, reliable OGG file from Google's sound library
      const sample = "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg";
      handlePlay(sample);
  };

  const handleAudioError = () => {
      setPlaybackError(true);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white rounded-3xl shadow-xl border border-brand-100 overflow-hidden">
            <div className="p-6 sm:p-8 bg-gradient-to-br from-white to-brand-50/30">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-brand-100 p-3 rounded-xl text-brand-600">
                        <Music size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Audio Player</h2>
                        <p className="text-sm text-gray-500">Play from Google Drive or local files</p>
                    </div>
                </div>
            
                <div className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LinkIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input 
                        type="text" 
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value);
                            if (error) setError('');
                            if (playbackError) setPlaybackError(false);
                        }}
                        placeholder="e.g. /audio/mysong.mp3 OR https://drive.google.com/..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all bg-white"
                        onKeyDown={(e) => e.key === 'Enter' && handlePlay()}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={() => handlePlay()}
                            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
                        >
                            {audioSrc && !playbackError ? <RefreshCw size={18} /> : <Play size={18} fill="currentColor" />}
                            {audioSrc ? 'Reload' : 'Load Audio'}
                        </button>
                        
                        <button
                             onClick={handleLoadSample}
                             className="px-4 py-3 bg-white border border-brand-200 text-brand-600 hover:bg-brand-50 font-medium rounded-xl transition-all shadow-sm flex items-center gap-2"
                             title="Load a sample audio file to test the player"
                        >
                            <Sparkles size={18} />
                            <span className="hidden sm:inline">Test Sample</span>
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center gap-2 text-sm">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}
            </div>

            {/* Helper Section for Local Files */}
            {!audioSrc && (
                 <div className="px-6 pb-6 sm:px-8 sm:pb-8">
                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 text-sm text-blue-800">
                        <h4 className="font-bold flex items-center gap-2 mb-3 text-base">
                            <HardDrive size={18} />
                            How to set up local files (Recommended)
                        </h4>
                        <div className="space-y-3 pl-1">
                            <div className="flex gap-3">
                                <span className="bg-blue-200 text-blue-800 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold shrink-0 mt-0.5">1</span>
                                <p>Create a folder named <code>audio</code> inside your project's <code>public</code> folder.</p>
                            </div>
                            <div className="flex gap-3">
                                <span className="bg-blue-200 text-blue-800 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold shrink-0 mt-0.5">2</span>
                                <p>Upload your MP3 file there (e.g. <code>mysong.mp3</code>).</p>
                            </div>
                            <div className="flex gap-3">
                                <span className="bg-blue-200 text-blue-800 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold shrink-0 mt-0.5">3</span>
                                <p>Type <code>/audio/mysong.mp3</code> in the box above and click Load.</p>
                            </div>
                        </div>
                    </div>
                 </div>
            )}

            {audioSrc && (
                <div className="border-t border-brand-100 bg-gray-50 p-6 sm:p-8">
                    <div className={`bg-white p-4 rounded-2xl shadow-sm border ${playbackError ? 'border-red-200 bg-red-50/30' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Now Playing</p>
                            {playbackError && (
                                <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                                    <AlertCircle size={12} /> Playback Failed
                                </span>
                            )}
                        </div>
                        
                        <audio 
                            ref={audioRef}
                            controls 
                            src={audioSrc} 
                            className="w-full focus:outline-none accent-brand-600" 
                            autoPlay
                            onError={handleAudioError}
                        >
                            Your browser does not support the audio element.
                        </audio>

                        {playbackError && (
                            <div className="mt-3 p-3 bg-white rounded-xl border border-red-100 text-sm text-gray-600 shadow-sm animate-in fade-in slide-in-from-top-2">
                                <p className="mb-2 font-medium text-red-600">Unable to stream audio source.</p>
                                {audioSrc.includes('google') ? (
                                    <>
                                        <p className="mb-3 text-xs">Google Drive is blocking the stream. Try the "Local Files" method described above.</p>
                                        <a 
                                            href={audioSrc} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors font-semibold text-xs"
                                        >
                                            <ExternalLink size={14} />
                                            Open Audio in New Tab
                                        </a>
                                    </>
                                ) : (
                                    <p className="text-xs">File not found. Check if the path <code>{audioSrc}</code> exists in your <code>public</code> folder.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
