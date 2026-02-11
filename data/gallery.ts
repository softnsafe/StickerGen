import { Sticker } from '../types';

/**
 * GALLERY CONFIGURATION
 * 
 * To add images to the gallery using GitHub and Vercel:
 * 
 * 1. FOLDER SETUP:
 *    In your GitHub repository root, ensure you have a 'public' folder.
 *    Inside 'public', create a folder named 'images'.
 *    (Path: /public/images/)
 * 
 * 2. UPLOAD & COMMIT:
 *    Upload your sticker image files (PNG/JPG) to that 'public/images/' folder.
 *    IMPORTANT: You must COMMIT and PUSH these image files to your GitHub repository
 *    for them to appear on Vercel.
 * 
 * 3. CONFIGURE:
 *    Add an entry to the array below. The 'url' should be absolute from the web root.
 *    Since Vercel serves the 'public' folder at the root, your URL will be:
 *    '/images/your-filename.png'
 */

export const GALLERY_IMAGES: Sticker[] = [
  // -------------------------------------------------------------------------
  // PASTE YOUR NEW ENTRIES BELOW THIS LINE
  // -------------------------------------------------------------------------
  
  // Example Entry (Ensure you have a file at public/images/example.png to see this)
  {
    id: 'example-sticker',
    url: '/images/example.png', // <--- Change this to your filename
    prompt: 'A cute example sticker',
    createdAt: Date.now(),
  },

];
