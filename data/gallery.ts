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
  
  {
    id: 'sample-sticker-1',
    // Using a reliable sample image (Cute Robot) with transparency to show off the drop-shadow
    url: 'https://cdn.pixabay.com/photo/2022/01/11/21/53/robot-6931728_1280.png',
    prompt: 'Cute retro robot sticker',
    createdAt: 1770836249227,
  },
  {
    id: 'sample-sticker-2', 
    // Using a Base64 placeholder for a "Star" sticker to ensure one always loads instantly
    url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj4KICA8IS0tIFdoaXRlIGJvcmRlciAoaW1pdGF0aW5nIGRpZS1jdXQpIC0tPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iOTAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNlMmU4ZjAiIHN0cm9rZS13aWR0aD0iMSIvPgogIAogIDwhLS0gSW5uZXIgY29sb3JmdWwgcGFydCAtLT4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjgwIiBmaWxsPSIjZmI5MjNjIi8+CiAgPHBhdGggZD0iTTEwMCA1MCBMIDEyMCA5MCBMMTYwIDk1IEwxMzAgMTI1IEwxNDAgMTcwIEwxMDAgMTUwIEw2MCAxNzAgTDcwIDEyNSBMNDAgOTUgTDgwIDkwIFoiIGZpbGw9IiNmZmYiIHN0cm9rZT0iI2VhNTgwYyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==',
    prompt: 'Gold Star Sticker',
    createdAt: 1770836249228,
  }
];