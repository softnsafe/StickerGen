import React from 'react';
import { Wand2 } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="text-center py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="flex justify-center mb-4">
        <div className="bg-brand-100 p-3 rounded-full">
          <Wand2 className="w-10 h-10 text-brand-600" />
        </div>
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
        Sticker<span className="text-brand-600">Genie</span>
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Turn your ideas into custom die-cut stickers instantly with AI. 
        Just describe it, pick a style, and download your creation.
      </p>
    </div>
  );
};