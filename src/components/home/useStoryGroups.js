import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getStoryGroups,
  selectAllStoryGroups,
  selectStoryGroupsLoading,
  selectStoryGroupsError,
} from '../../store/slices/storyGroupsSlice';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';
import { useTranslation } from '../../i18n/hooks/useTranslation';

export const useStoryGroups = () => {
  const dispatch = useDispatch();
  const { isArabic } = useTranslation();
  const copy = useHomeCopy();
  const groups = useSelector(selectAllStoryGroups);
  const loading = useSelector(selectStoryGroupsLoading);
  const error = useSelector(selectStoryGroupsError);

  // Mount-time fetch; repeat mounts (route returns) reuse the slice cache
  // instead of re-downloading the group metadata.
  useEffect(() => {
    dispatch(getStoryGroups());
  }, [dispatch]);

  const localizedGroups = useMemo(() => {
    const reelLabel = copy.storyGroups.reelLabel;

    return groups.map((group) => {
      const title = isArabic ? group.titleAr || group.titleEn : group.titleEn || group.titleAr;
      const subtitle = isArabic
        ? group.subtitleAr || group.subtitleEn
        : group.subtitleEn || group.subtitleAr;
      const firstMaterial = group.materials && group.materials[0];

      return {
        id: group.id,
        title: title || '',
        subtitle: subtitle || '',
        // The viewer caption line: story groups carry no long description, so
        // the subtitle doubles as the text under the spotlight label.
        description: subtitle || '',
        category: subtitle || reelLabel,
        avatarImage: group.avatarImage || '',
        thumbnail: (firstMaterial && firstMaterial.thumbnail) || group.coverImage || '',
        fallbackThumbnail: group.coverImage || '',
        videosCount: group.videosCount,
        materials: (group.materials || []).map((material) => ({
          id: material.id,
          videoUrl: material.videoUrl || '',
          storyVideoUrl: material.storyVideoUrl || material.videoUrl || '',
          thumbnail: material.thumbnail || '',
          fallbackThumbnail: material.fallbackThumbnail || group.coverImage || '',
          description:
            (isArabic
              ? material.captionAr || material.caption
              : material.caption || material.captionAr) || '',
        })),
      };
    });
  }, [groups, isArabic, copy]);

  return { groups: localizedGroups, loading, error };
};
