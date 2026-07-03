export const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png'];
export const ALLOWED_PHOTO_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
export const ALLOWED_CV_TYPES = ['application/pdf'];
export const ALLOWED_CV_EXTENSIONS = ['.pdf'];

export const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
export const MAX_CV_SIZE = 10 * 1024 * 1024;

export function hasAllowedExtension(filename, allowedExtensions) {
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  return allowedExtensions.includes(ext);
}

export function isAllowedFileType(file, allowedTypes, allowedExtensions) {
  return allowedTypes.includes(file.type) || hasAllowedExtension(file.name, allowedExtensions);
}

export function isFileWithinSizeLimit(file, maxSize) {
  return file.size <= maxSize;
}
