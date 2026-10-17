// The story viewer plays a phone-first 720p rendition instead of the 30-80 MB
// original. Videos on our CDN zone are resized on the fly by Cloudflare Media
// Transformations (`/cdn-cgi/media/<options>/<source path>`), which also puts
// the metadata first so playback starts while the rest still downloads. The
// result is cached at the edge, so nothing has to be re-uploaded. Any URL that
// is not on our zone, or not a plain video file, is returned untouched, and
// the viewer still falls back to the original if the rendition errors.
const STORY_RENDITION_RE = /\.(mp4|webm|mov|m4v)$/i;
const STORY_CDN_ORIGIN = 'https://upload.ats.sabergroup-eg.com';
const STORY_TRANSFORM_OPTIONS = 'mode=video,width=720,fit=scale-down';

export const storyRenditionUrl = (url) => {
  if (typeof url !== 'string') return url;
  const trimmed = url.trim();
  if (!trimmed.startsWith(`${STORY_CDN_ORIGIN}/`)) return url;
  // Keep any query/fragment out of the path test, but pass the URL through
  // intact so signed or versioned links still resolve.
  const cut = trimmed.search(/[?#]/);
  const path = cut === -1 ? trimmed : trimmed.slice(0, cut);
  if (!STORY_RENDITION_RE.test(path)) return url;
  if (trimmed.startsWith(`${STORY_CDN_ORIGIN}/cdn-cgi/`)) return url;
  return `${STORY_CDN_ORIGIN}/cdn-cgi/media/${STORY_TRANSFORM_OPTIONS}/${trimmed.slice(STORY_CDN_ORIGIN.length + 1)}`;
};
