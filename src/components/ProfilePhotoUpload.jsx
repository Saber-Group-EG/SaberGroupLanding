import { useRef } from 'react';
import Swal from 'sweetalert2';
import {
  ALLOWED_PHOTO_TYPES,
  ALLOWED_PHOTO_EXTENSIONS,
  MAX_PHOTO_SIZE,
  isAllowedFileType,
  isFileWithinSizeLimit,
} from '../utils/uploadValidation';

export default function ProfilePhotoUpload({ value, onChange, error, touched, label, t }) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAllowedFileType(file, ALLOWED_PHOTO_TYPES, ALLOWED_PHOTO_EXTENSIONS)) {
      e.target.value = '';
      Swal.fire({
        icon: 'warning',
        title: label || 'Profile Photo',
        text: (t && t('joinUs:invalidPhotoType')) || 'Only JPG, JPEG, and PNG files are allowed',
        confirmButtonText: (t && t('common:ok')) || 'OK',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }

    if (!isFileWithinSizeLimit(file, MAX_PHOTO_SIZE)) {
      e.target.value = '';
      Swal.fire({
        icon: 'warning',
        title: label || 'Profile Photo',
        text: (t && t('joinUs:photoTooLarge')) || 'Photo file size must be 5 MB or less',
        confirmButtonText: (t && t('common:ok')) || 'OK',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }

    onChange(file);
  };

  return (
    <div className="flex justify-center mb-8">
      <input
        ref={inputRef}
        type="file"
        id="profile-photo-upload"
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        hidden
        onChange={handleChange}
      />
      <label
        htmlFor="profile-photo-upload"
        className="cursor-pointer group"
      >
        <div className="relative w-28 h-28">
          {value ? (
            <div className="w-28 h-28 rounded-full overflow-hidden shadow-xl group-hover:shadow-2xl transition-all">
              <img
                src={URL.createObjectURL(value)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-28 h-28 rounded-full bg-primary-50 border-4 border-dashed border-primary-400 flex items-center justify-center group-hover:border-primary-600 group-hover:shadow-xl transition-all">
              <div className="text-center">
                <svg
                  className="w-12 h-12 text-primary-600 mx-auto group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
        <p className="text-sm text-center mt-3 text-light-700 dark:text-light-300 group-hover:text-primary-600 font-semibold transition-colors">
          {value
            ? (t && t('joinUs:changePhoto')) || 'Change Photo'
            : (t && t('joinUs:uploadPhoto')) || 'Upload Photo'}
        </p>
        {error && touched && (
          <p className="mt-2 text-sm text-red-500 text-center">
            {error}
          </p>
        )}
      </label>
    </div>
  );
}
