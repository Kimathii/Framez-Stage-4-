// cloudinary.config.ts
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@env';

export const CLOUDINARY_CONFIG = {
  cloudName: CLOUDINARY_CLOUD_NAME,
  uploadPreset: CLOUDINARY_UPLOAD_PRESET,
  uploadUrl: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
};
// export const CLOUDINARY_CONFIG = {
//   cloudName: 'dxhlisu6b',
//   uploadPreset: 'framez_posts', 
//   uploadUrl: 'https://api.cloudinary.com/v1_1/dxhlisu6b/image/upload'
// };