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
  const rawProjectCount = useSelector((state) => state.projects.rawProjects.length);

  // getProjects has no condition guard, so the "already fetched / in flight"
  // check has to live here to avoid duplicate requests.
  useEffect(() => {
    if (rawProjectCount === 0 && !loading && !error) {
      dispatch(getProjects());
    }
  }, [dispatch, rawProjectCount, loading, error]);

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
          videoUrl: video.url || '',
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
