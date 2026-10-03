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

const MIME_BY_EXTENSION = {
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
};

// Some Android pickers return an empty `file.type`; fall back to the extension.
export function getFileContentType(file) {
  if (file.type) return file.type;
  const name = file.name || '';
  const ext = name.substring(name.lastIndexOf('.')).toLowerCase();
  return MIME_BY_EXTENSION[ext] || 'application/octet-stream';
}

// Copy the picked file into memory right away. On mobile (especially Android
// with Google Drive / WhatsApp / content:// files) the browser can lose access
// to the original file before submit, which makes the upload request fail with
// status 0. An in-memory copy can always be sent.
export async function readFileIntoMemory(file) {
  const buffer = await file.arrayBuffer();
  return new File([buffer], file.name, {
    type: getFileContentType(file),
    lastModified: file.lastModified,
  });
}
