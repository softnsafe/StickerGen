import { Sticker } from '../types';

/**
 * GALLERY CONFIGURATION
 * 
 * To add images to the gallery using GitHub and Vercel:
 * 
 * 1. FOLDER SETUP:
 *    In your GitHub repository root, create a folder named 'public'.
 *    Inside 'public', create a folder named 'images'.
 *    (Path: /public/images/)
 * 
 * 2. UPLOAD:
 *    Upload your sticker image files (PNG/JPG) to that 'public/images/' folder.
 * 
 * 3. CONFIGURE:
 *    Add an entry to the array below. The 'url' should be absolute from the web root.
 *    Since Vercel serves the 'public' folder at the root, your URL will be:
 *    '/images/your-filename.png'
 */

export const GALLERY_IMAGES: Sticker[] = [
  // Example entry (Uncomment after uploading 'corgi-sticker.png' to public/images/)
    {
  id: 'sticker-1770836115905',
  url: '/images/無敵鉄金剛.png',
  prompt: '無敵鉄金剛',
  createdAt: 1770836115905,
},
  {
  id: 'sticker-1770836245290',
  url: '/images/power_ranger.png',
  prompt: 'power ranger',
  createdAt: 1770836245290,
},
];
