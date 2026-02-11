import { Sticker } from '../types';

/**
 * GALLERY CONFIGURATION
 * 
 * To add images to the gallery:
 * 1. Create a folder named 'public' in your project root (or just 'images' in root if not using Vite/build tools).
 * 2. Inside that, ensure you have an 'images' folder.
 * 3. Upload your sticker images to that folder (e.g. 'public/images/').
 * 4. Add an entry to the GALLERY_IMAGES array below for each image.
 * 
 * Example:
 * {
 *   id: 'my-cool-sticker',
 *   url: '/images/cool-sticker.png',
 *   prompt: 'A cool sticker',
 *   createdAt: Date.now(),
 * }
 */

export const GALLERY_IMAGES: Sticker[] = [
  // Example entry (Uncomment and edit to display your first uploaded image)
  /*
  {
    id: 'gallery-1',
    url: '/images/sample_sticker.png',
    prompt: 'Sample Gallery Sticker',
    createdAt: Date.now(),
  },
  */
];