export interface Sticker {
  id: string;
  url: string; // Base64 data URL
  prompt: string;
  createdAt: number;
}

export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
}

export type StickerStyle = 'Cute' | 'Cool' | 'Retro' | 'Cyberpunk' | 'Sketch' | '3D Render';