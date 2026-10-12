import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects, selectPublishedProjects } from '../../store/slices/projectsSlice';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';
import { useTranslation } from '../../i18n/hooks/useTranslation';
import { getProxiedCoverUrl } from '../../utils/imageProxy';

export const getStoryInitials = (title) => {
  const words = String(title || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].slice(0, 3);
  return words
    .map((word) => word[0])
    .join('')
    .slice(0, 3);
};

const VIDEO_URL_RE = /\.(mp4|webm|ogg|mov|m4v|avi|mkv)(\?|#|$)/i;

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

// Video files fed to the image proxy render as a black card, so anything that
// isn't a real image URL must be skipped.
const isRenderableImage = (url) =>
  typeof url === 'string' && url.trim() !== '' && !VIDEO_URL_RE.test(url.trim());

const proxyThumbnail = (url) => getProxiedCoverUrl(url, { width: 400, quality: 40 });

const getFirstPhotoUrl = (project) => {
  const photo = project?.photos?.[0];
  return photo?.thumbnail || photo?.url || '';
};

// coverImage is already weserv-proxied by projectsSlice, so it is used as-is.
const resolveProjectImage = (project) => {
  if (isRenderableImage(project?.mainCover)) return proxyThumbnail(project.mainCover);
  if (isRenderableImage(getFirstPhotoUrl(project))) return proxyThumbnail(getFirstPhotoUrl(project));
  if (typeof project?.coverImage === 'string' && project.coverImage.trim()) return project.coverImage;
  return '';
};

// 32px circle: tiny proxy request, cover cropped to the circle by object-cover.
const resolveAvatarImage = (project) => {
  if (isRenderableImage(project?.mainCover)) {
    return getProxiedCoverUrl(project.mainCover, { width: 96, quality: 60 });
  }
  const photoUrl = getFirstPhotoUrl(project);
  if (isRenderableImage(photoUrl)) return getProxiedCoverUrl(photoUrl, { width: 96, quality: 60 });
  if (typeof project?.coverImage === 'string' && project.coverImage.trim()) return project.coverImage;
  return '';
};

const resolveThumbnail = (video, project) => {
  if (isRenderableImage(video?.thumbnail)) return proxyThumbnail(video.thumbnail);
  return resolveProjectImage(project);
};

export const useProjectStories = () => {
  const dispatch = useDispatch();
  const { isArabic } = useTranslation();
  const copy = useHomeCopy();
  const projects = useSelector(selectPublishedProjects);
  const loading = useSelector((state) => state.projects.loading);
  const error = useSelector((state) => state.projects.error);

  // Cached data renders instantly; getProjects' thunk condition refetches at
  // most once per page load and dedupes against useHomeProjects.
  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  const stories = useMemo(() => {
    const fallbackCategory = copy.whatWeDo.services['service-media-production'].title;

    const sortedProjects = [...projects].sort((a, b) => {
      const orderA = Number.isFinite(Number(a?.order)) ? Number(a.order) : Infinity;
      const orderB = Number.isFinite(Number(b?.order)) ? Number(b.order) : Infinity;
      return orderA - orderB;
    });

    return sortedProjects.flatMap((project, projectIndex) => {
      const videos = project.videos || [];
      if (videos.length === 0) return [];

      const title = isArabic
        ? project.titleAr || project.titleEn
        : project.titleEn || project.titleAr;
      const projectDescription = isArabic
        ? project.descriptionAr || project.descriptionEn
        : project.descriptionEn || project.descriptionAr;
      const services = isArabic ? project.servicesAr : project.services;
      const projectId = project.id || project.slug || `project-${projectIndex}`;

      const materials = videos.map((video, index) => {
        const caption = isArabic
          ? video.captionAr || video.caption
          : video.caption || video.captionAr;

        return {
          id: `${projectId}-${index}`,
          // videoUrl stays the ORIGINAL: ProjectDetail, sharing and any other
          // full-quality consumer rely on it — only the story surfaces below
          // ask for the rendition.
          videoUrl: video.url || '',
          storyVideoUrl: storyRenditionUrl(video.url || ''),
          thumbnail: resolveThumbnail(video, project),
          fallbackThumbnail: resolveProjectImage(project),
          description: caption || projectDescription || '',
        };
      });

      const firstMaterial = materials[0];

      return [
        {
          id: projectId,
          videoUrl: firstMaterial.videoUrl,
          // Root mirrors the first material for consumers that read the story
          // object directly instead of reaching into materials.
          storyVideoUrl: firstMaterial.storyVideoUrl,
          thumbnail: firstMaterial.thumbnail,
          fallbackThumbnail: firstMaterial.fallbackThumbnail,
          avatarImage: resolveAvatarImage(project),
          title: title || '',
          subtitle: firstMaterial.description,
          description: firstMaterial.description,
          category: (services && services[0]) || fallbackCategory,
          projectSlug: project.slug,
          materials,
        },
      ];
    });
  }, [projects, isArabic, copy]);

  return { stories, loading, error };
};
