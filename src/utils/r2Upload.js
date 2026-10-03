import axios from 'axios';
import { getFileContentType } from './uploadValidation';

const BACKEND_URL =
  import.meta.env.VITE_FORM_URL || 'https://application-maker.onrender.com/api';

// Some networks (mobile carriers, DNS filters, extensions) block
// *.r2.cloudflarestorage.com. When the direct PUT never gets a response we
// retry through a same-origin path that Vercel rewrites to the bucket
// (see vercel.json), so the browser only talks to our own domain.
const R2_BUCKET_HOST =
  'sabergroup-ats.b74c21ec244e1035b5dd855bc75cb920.r2.cloudflarestorage.com';
const R2_PROXY_PREFIX = '/r2-upload';

function toProxyUrl(presignedUrl) {
  const url = new URL(presignedUrl);
  if (url.host !== R2_BUCKET_HOST) return null;
  return `${window.location.origin}${R2_PROXY_PREFIX}${url.pathname}${url.search}`;
}

class NetworkBlockedError extends Error {}

function putFile(url, body, contentType, fileSize) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.timeout = 180000;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        console.log(`${Math.round((e.loaded / e.total) * 100)}%`);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(
          new Error(
            `R2 rejected upload — status ${xhr.status} ${xhr.statusText}: ${xhr.responseText || '(empty body)'}`
          )
        );
      }
    };

    xhr.onerror = () => {
      reject(
        new NetworkBlockedError(
          `Browser blocked or dropped the request before any response (readyState ${xhr.readyState}, status ${xhr.status}). ` +
            `Common causes: ad blocker/extension, corporate/school network filtering, offline connection, or DNS failure resolving the R2 endpoint.`
        )
      );
    };
    xhr.ontimeout = () =>
      reject(
        new Error(
          `Upload timed out after 180s (file size: ${(fileSize / 1e6).toFixed(1)}MB) — likely a slow or unstable connection.`
        )
      );
    xhr.send(body);
  });
}

export async function uploadToR2(file, folder = 'JobApplications') {
  const maxRetries = 3;
  let attempt = 0;
  let lastError;
  const contentType = getFileContentType(file);

  // Send an in-memory copy so a file the OS revoked access to (Android cloud
  // files) doesn't silently fail as a network error.
  let body;
  try {
    body = new Blob([await file.arrayBuffer()], { type: contentType });
  } catch (err) {
    throw new Error(
      `Could not read the selected file (${err.message}). Please select the file again.`
    );
  }

  while (attempt < maxRetries) {
    try {
      let presignData;
      try {
        const { data } = await axios.post(
          `${BACKEND_URL.replace(/\/$/, '')}/upload/presign`,
          { name: file.name, type: contentType, folder },
          { timeout: 30000 }
        );
        presignData = data;
      } catch (err) {
        // Surface exactly what happened at the presign step
        const detail = err.response
          ? `Server responded ${err.response.status}: ${JSON.stringify(err.response.data)}`
          : err.request
            ? `No response received from server (${err.code || 'unknown'}): ${err.message}`
            : err.message;
        throw new Error(`Presign step failed — ${detail}`);
      }

      const { presignedUrl, publicUrl } = presignData;

      if (!presignedUrl || !presignedUrl.startsWith('https://')) {
        throw new Error(`Invalid presigned URL received: ${presignedUrl}`);
      }

      try {
        await putFile(presignedUrl, body, contentType, file.size);
      } catch (err) {
        const proxyUrl = err instanceof NetworkBlockedError && toProxyUrl(presignedUrl);
        if (!proxyUrl) throw err;
        console.warn('Direct R2 upload blocked, retrying via proxy', err);
        await putFile(proxyUrl, body, contentType, file.size);
      }

      return publicUrl;
    } catch (error) {
      lastError = error;
      attempt++;
      if (attempt >= maxRetries) {
        // This is what you show the user
        throw new Error(
          `Upload failed after ${maxRetries} attempts. Last error: ${lastError.message}`
        );
      }
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt - 1)));
    }
  }
}
