import { useRef } from 'react';
import Swal from 'sweetalert2';
import {
  ALLOWED_CV_TYPES,
  ALLOWED_CV_EXTENSIONS,
  MAX_CV_SIZE,
  isAllowedFileType,
  isFileWithinSizeLimit,
} from '../utils/uploadValidation';

function getDisplayFileName(file, maxLength = 15, previewLength = 12) {
  const rawName = typeof file?.name === 'string' ? file.name.trim() : '';
  if (!rawName) return '';
  return rawName.length > maxLength
    ? `${rawName.substring(0, previewLength)}...`
    : rawName;
}

export default function CvUpload({ value, onChange, error, touched, label, t, required, optionalLabel }) {
  const inputRef = useRef(null);
  const displayName = getDisplayFileName(value);
  const fullFileName = typeof value?.name === 'string' ? value.name.trim() : '';

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAllowedFileType(file, ALLOWED_CV_TYPES, ALLOWED_CV_EXTENSIONS)) {
      e.target.value = '';
      Swal.fire({
        icon: 'warning',
        title: label || 'CV',
        text: (t && t('joinUs:invalidCVType')) || 'Only PDF files are allowed',
        confirmButtonText: (t && t('common:ok')) || 'OK',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }

    if (!isFileWithinSizeLimit(file, MAX_CV_SIZE)) {
      e.target.value = '';
      Swal.fire({
        icon: 'warning',
        title: label || 'CV',
        text: (t && t('joinUs:cvTooLarge')) || 'CV file size must be 10 MB or less',
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
        id="cv-upload"
        accept=".pdf,application/pdf"
        hidden
        onChange={handleChange}
      />
      <label
        htmlFor="cv-upload"
        className="cursor-pointer group"
      >
        <div className="relative w-28 h-28">
          {value ? (
            <div className="w-28 h-28 rounded-full shadow-xl group-hover:shadow-2xl transition-all bg-success-50 flex flex-col items-center justify-center p-2">
              <svg
                className="w-10 h-10 text-success-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd"
                />
              </svg>
              <p
                className="text-xs text-success-700 font-semibold mt-1 text-center wrap-break w-full px-1"
                title={fullFileName || 'CV'}
              >
                {displayName || 'CV'}
              </p>
            </div>
          ) : (
            <div className="w-28 h-28 rounded-full bg-secondary-50 border-4 border-dashed border-secondary-400 flex items-center justify-center group-hover:border-secondary-600 group-hover:shadow-xl transition-all">
              <div className="text-center">
                <svg
                  className="w-12 h-12 text-secondary-600 mx-auto group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-secondary-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
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
        <p className="text-sm text-center mt-3 text-light-700 dark:text-light-300 group-hover:text-secondary-600 font-semibold transition-colors">
          {value
            ? (t && t('joinUs:changeCV')) || 'Change CV'
            : (
              <>
                {(t && t('joinUs:uploadCV')) || 'Upload CV'}
                {required ? (
                  <span className="text-red-500 ml-1">*</span>
                ) : (
                  <span className="text-xs text-light-500 dark:text-light-400">
                    ({optionalLabel || (t && t('joinUs:optional')) || 'Optional'})
                  </span>
                )}
              </>
            )}
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
