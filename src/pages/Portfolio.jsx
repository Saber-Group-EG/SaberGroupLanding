import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '../i18n/hooks/useTranslation';
import { getProjects, selectAllProjects, selectProjectsLoading } from '../store/slices/projectsSlice';
import {
  Camera,
  Film,
  Eye,
  Layers,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  ArrowUpLeft,
  BadgeCheck,
  ChevronDown,
} from 'lucide-react';
import DynamicIcon, { iconNames } from 'lucide-react/dist/esm/DynamicIcon.mjs';

const toLucideKey = (value) =>
  String(value).trim().replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const Portfolio = () => {
  const { t: tFn, isArabic } = useTranslation();
  const dir = isArabic ? 'rtl' : 'ltr';
  const isRtl = dir === 'rtl';
  const dispatch = useDispatch();
  const allProjects = useSelector(selectAllProjects);
  const loading = useSelector(selectProjectsLoading);

  const t = (key, fallback) => {
    const translated = tFn(`portfolio:${key}`);
    return translated !== `portfolio:${key}` ? translated : fallback;
  };

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  const publishedProjects = allProjects.filter((p) => p.published === true);

  const allCategoryIds = Array.from(
    new Set(publishedProjects.map((p) => p.sectorId?.trim().toLowerCase()).filter(Boolean))
  );

  const categoryNames = allCategoryIds.reduce((acc, id) => {
    const sample = publishedProjects.find((p) => p.sectorId?.trim().toLowerCase() === id);
    if (sample) {
      acc[id] = {
        en: sample.categoryNameEn || sample.sectorId || id,
        ar: sample.categoryNameAr || sample.sectorId || id,
      };
    }
    return acc;
  }, {});

  // Portfolio list state
  const [selectedSectorId, setSelectedSectorId] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [categoryOverflow, setCategoryOverflow] = useState(false);
  const [tagOverflow, setTagOverflow] = useState(false);

  const categoryScrollRef = useRef(null);
  const tagScrollRef = useRef(null);

  const sectorProjects = selectedSectorId === 'all'
    ? publishedProjects
    : publishedProjects.filter((p) => p.sectorId?.trim().toLowerCase() === selectedSectorId);

  const allTagsRaw = Array.from(
    new Set(sectorProjects.flatMap((p) => (p.subcategories || []).map((sub) => (typeof sub === 'string' ? sub : sub.name?.en || sub.name?.ar || '')).filter(Boolean)))
  );

  const allTagNames = allTagsRaw.reduce((acc, key) => {
    const sample = sectorProjects.flatMap((p) => (p.subcategories || [])).find((sub) => {
      const k = typeof sub === 'string' ? sub : sub.name?.en || sub.name?.ar || '';
      return k === key;
    });
    const nameObj = typeof sample === 'object' && sample !== null ? sample.name : null;
    acc[key] = isArabic ? (nameObj?.ar || nameObj?.en || key) : (nameObj?.en || nameObj?.ar || key);
    return acc;
  }, {});

  useEffect(() => {
    const checkOverflow = () => {
      if (categoryScrollRef.current) {
        setCategoryOverflow(categoryScrollRef.current.scrollWidth > categoryScrollRef.current.clientWidth);
      }
      if (tagScrollRef.current) {
        setTagOverflow(tagScrollRef.current.scrollWidth > tagScrollRef.current.clientWidth);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [allCategoryIds.length, allTagsRaw.length]);

  const handleSectorChange = (sector) => {
    if (sector === selectedSectorId) {
      setSelectedSectorId('all');
    } else {
      setSelectedSectorId(sector);
    }
    setSelectedTags([]);
  };

  const handleTagChange = (tag) => {
    const isSelected = selectedTags.includes(tag);
    let newTags;

    if (isSelected) {
      newTags = selectedTags.filter((t) => t !== tag);
    } else {
      newTags = [...selectedTags, tag];
    }

    setSelectedTags(newTags);

    if (newTags.length > 0 && !isSelected) {
      const matchingProject = publishedProjects.find((p) => {
        const subs = (p.subcategories || []).map((sub) =>
          typeof sub === 'string' ? sub : sub.name?.en || sub.name?.ar || ''
        );
        return subs.some((name) => name.toLowerCase() === tag.toLowerCase());
      });
      if (matchingProject?.sectorId) {
        setSelectedSectorId(matchingProject.sectorId.trim().toLowerCase());
      }
    }
  };

  const scrollContainer = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({ left: direction * 200, behavior: 'smooth' });
    }
  };

  const filteredProjects = publishedProjects.filter((proj) => {
    if (selectedSectorId !== 'all' && proj.sectorId?.trim().toLowerCase() !== selectedSectorId) return false;
    if (selectedTags.length > 0) {
      const matchSubcategory = (proj.subcategories || []).some((sub) => {
        const name = typeof sub === 'string' ? sub : sub.name?.en || sub.name?.ar || '';
        return selectedTags.some((t) => t.toLowerCase() === name.toLowerCase());
      });
      if (!matchSubcategory) return false;
    }
    return true;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    if (sortBy === 'photos') return (b.photosCount || 10) - (a.photosCount || 10);
    if (sortBy === 'reels') return (b.videosCount || 0) - (a.videosCount || 0);
    return (a.order != null ? a.order : 999) - (b.order != null ? b.order : 999);
  });

  const featuredMasterProject = publishedProjects.length > 0
    ? publishedProjects.find((p) => p.featured) || publishedProjects[0]
    : null;

  const renderProjectIcon = (proj) => {
    const rawIcon = (proj.icon || '').trim();
    const isUrlIcon = /^(https?:\/\/|\/|data:)/i.test(rawIcon);
    const iconKey = isUrlIcon ? '' : toLucideKey(rawIcon);
    const hasLucideIcon = iconKey && iconNames.includes(iconKey);
    return (
      <div className={`absolute top-3.5 sm:top-5 z-10 ${isRtl ? 'right-3.5 sm:right-5' : 'left-3.5 sm:left-5'}`}>
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-sm">
          {proj.isFeatured || (!isUrlIcon && !hasLucideIcon) ? (
            <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
          ) : isUrlIcon ? (
            <img src={rawIcon} alt="" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
          ) : (
            <DynamicIcon
              name={iconKey}
              className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]"
            />
          )}
        </div>
      </div>
    );
  };

  const renderCounts = (proj, stagger) => {
    const photosCount = proj.photosCount || 0;
    const videosCount = proj.videosCount || 0;
    const viewsCount = proj.viewsCount || 0;
    return (
      <div className={`flex items-center gap-2.5 sm:gap-3 min-w-0 text-[9.5px] sm:text-[10.5px] uppercase tracking-wide text-white/80 ${stagger ? 'transition-all duration-300 ease-out opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-5 lg:delay-300 lg:group-hover:opacity-100 lg:group-hover:translate-y-0' : ''}`}>
        {photosCount > 0 && (
          <span className="flex items-center gap-1.5 font-medium whitespace-nowrap">
            <Camera className="w-3.5 h-3.5 shrink-0 text-white/90" />
            <span><span className="font-bold text-white">{photosCount}</span></span>
          </span>
        )}
        {photosCount > 0 && videosCount > 0 && (
          <span className="w-px h-3 bg-white/30 shrink-0" />
        )}
        {videosCount > 0 && (
          <span className="flex items-center gap-1.5 font-medium whitespace-nowrap">
            <Film className="w-3.5 h-3.5 shrink-0 text-white/90" />
            <span><span className="font-bold text-white">{videosCount}</span></span>
          </span>
        )}
        {viewsCount > 0 && (photosCount > 0 || videosCount > 0) && (
          <span className="w-px h-3 bg-white/30 shrink-0" />
        )}
        {viewsCount > 0 && (
          <span className="flex items-center gap-1.5 font-medium whitespace-nowrap">
            <Eye className="w-3.5 h-3.5 shrink-0 text-white/90" />
            <span><span className="font-bold text-white">{viewsCount}</span></span>
          </span>
        )}
      </div>
    );
  };

  const renderViewButton = () => (
    <span className="shrink-0 relative inline-flex items-center gap-0 cursor-pointer whitespace-nowrap transition-all duration-300 group group-hover:-translate-y-0.5">
      <span className="relative py-0.5 text-[8.5px] sm:text-[9px] font-medium text-white transition-all duration-300 group-hover:bg-white group-hover:text-neutral-950 group-hover:border-white rounded-s-full border-y-[0.5px] border-s-[0.5px] border-white/40 ps-1 sm:ps-1.5 pe-1.5">
        {t('viewFullProject', 'View Full Project')}
      </span>
      <span className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full border-[0.5px] border-white/60 overflow-hidden flex items-center justify-center text-white transition-all duration-300 group-hover:bg-white group-hover:border-white group-hover:text-neutral-950 shrink-0 -ms-1">
        {isRtl ? (
          <ArrowUpLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 group-hover:rotate-180" />
        ) : (
          <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 group-hover:rotate-180" />
        )}
      </span>
    </span>
  );

  // Portfolio list
  return (
    <div className="bg-white min-h-screen pb-20 text-neutral-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 space-y-10 sm:space-y-12">

        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] sm:text-xs font-black tracking-[0.18em] text-red-600 uppercase font-sans-en">
                {t('portfolio', 'PORTFOLIO')}
              </span>
              <span className="w-8 h-[2px] bg-red-600 rounded-full inline-block" />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black text-neutral-950 tracking-tight leading-[1.12]">
              {t('title', 'Commercial Photography & Creative Campaigns')}
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-xl font-normal">
              {t('description', 'We create visual stories that help brands announce, connect, and grow.')}
            </p>

            <div>
              <button
                onClick={() => document.getElementById('projects-grid-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs sm:text-sm px-5 sm:px-6 py-3 rounded-[3px] inline-flex items-center gap-2.5 transition-all shadow-xs cursor-pointer"
              >
                <span>{t('exploreProjects', 'Explore Projects')}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

            <div className="pt-4 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-8 lg:gap-10 border-t border-neutral-100">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700 stroke-[1.5]" />
                <div>
                  <div className="text-base sm:text-lg font-bold text-neutral-950 tracking-tight leading-none">{publishedProjects.length}</div>
                  <div className="text-[9px] sm:text-[10px] text-neutral-500 font-medium mt-0.5 uppercase tracking-wider">{t('projects', 'Projects')}</div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1.5 text-center">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700 stroke-[1.5]" />
                <div>
                  <div className="text-base sm:text-lg font-bold text-neutral-950 tracking-tight leading-none">{publishedProjects.reduce((sum, p) => sum + (p.photosCount || 0), 0)}+</div>
                  <div className="text-[9px] sm:text-[10px] text-neutral-500 font-medium mt-0.5 uppercase tracking-wider">{t('photos', 'Photos')}</div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1.5 text-center">
                <Film className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700 stroke-[1.5]" />
                <div>
                  <div className="text-base sm:text-lg font-bold text-neutral-950 tracking-tight leading-none">{publishedProjects.reduce((sum, p) => sum + (p.videosCount || 0), 0)}+</div>
                  <div className="text-[9px] sm:text-[10px] text-neutral-500 font-medium mt-0.5 uppercase tracking-wider">{t('videos', 'Reels')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="lg:col-span-5">
            {featuredMasterProject ? (
              <Link to={`/portfolio/${featuredMasterProject.slug}`} className="group cursor-pointer block">
                {/* Mobile: Horizontal card */}
                <div className="lg:hidden bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition-all">
                  <div className="flex flex-row">
                    <div className="relative w-32 h-28 overflow-hidden shrink-0">
                      <img src={featuredMasterProject.coverImage} alt="Featured Project" className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700" />
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
                        {t('featured', 'FEATURED')}
                      </div>
                    </div>
                    <div className="p-2.5 flex flex-col justify-center gap-1 flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-neutral-950 group-hover:text-red-600 transition-colors leading-snug line-clamp-2">{isArabic ? featuredMasterProject.titleAr : featuredMasterProject.titleEn}</h3>
                      <p className="text-[9px] text-neutral-500 line-clamp-2">{isArabic ? featuredMasterProject.subtitleAr : featuredMasterProject.subtitleEn}</p>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-950 group-hover:text-red-600 transition-colors mt-0.5">
                        <span>{t('viewProject', 'View Project')}</span>
                        <ArrowRight className="w-3 h-3 text-red-600 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Desktop: Vertical card */}
                <div className="hidden lg:block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-neutral-900 border border-neutral-200/90 shadow-xs">
                    <img src={featuredMasterProject.coverImage} alt="Featured Project" className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700" />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black tracking-widest text-red-600 uppercase font-sans-en">{t('featuredProject', 'FEATURED PROJECT')}</span>
                      <h3 className="text-base sm:text-lg font-black text-neutral-950 group-hover:text-red-600 transition-colors leading-snug">{isArabic ? featuredMasterProject.titleAr : featuredMasterProject.titleEn}</h3>
                      <p className="text-xs text-neutral-500">{isArabic ? featuredMasterProject.descriptionAr?.slice(0, 60) : featuredMasterProject.descriptionEn?.slice(0, 60)}...</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-neutral-950 group-hover:text-red-600 transition-colors">
                      <span>{t('viewProject', 'View Project')}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-red-600 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="aspect-[4/5] rounded-[4px] bg-neutral-100 border border-neutral-200 animate-pulse" />
            )}
          </div>
        </section>

        {/* SECTOR FILTER */}
        <section className="pt-6 sm:pt-8 border-t border-neutral-200/80 space-y-3">
          <div className="text-[11px] sm:text-xs font-black tracking-wider uppercase text-neutral-950 font-sans-en">{t('sector', 'EXPLORE BY SECTOR')}</div>
          <div className="flex items-center justify-start gap-2">
            {categoryOverflow && (
              <button onClick={() => scrollContainer(categoryScrollRef, -1)} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-[2px] border border-neutral-300 bg-white text-neutral-500 hover:bg-neutral-50 transition-colors cursor-pointer shrink-0">
                <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            )}
            <div ref={categoryScrollRef} className="flex items-center gap-4 sm:gap-6 lg:gap-8 py-2 overflow-x-auto scrollbar-hide">
              <button onClick={() => handleSectorChange('all')} className={`whitespace-nowrap text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative pb-2.5 ${selectedSectorId === 'all' ? 'text-red-600 font-black' : 'text-neutral-800 hover:text-red-600'}`}>
                <span>{t('all', 'ALL')}</span>
                {selectedSectorId === 'all' && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-600 rounded-full" />}
              </button>
              {allCategoryIds.map((cat) => {
                const isActive = selectedSectorId === cat;
                return (
                  <button key={cat} onClick={() => handleSectorChange(cat)} className={`whitespace-nowrap text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative pb-2.5 ${isActive ? 'text-red-600 font-black' : 'text-neutral-800 hover:text-red-600'}`}>
                    <span>{categoryNames[cat]?.[isArabic ? 'ar' : 'en'] || cat}</span>
                    {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-600 rounded-full" />}
                  </button>
                );
              })}
            </div>
            {categoryOverflow && (
              <button onClick={() => scrollContainer(categoryScrollRef, 1)} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-[3px] border border-neutral-300 bg-white shadow-2xs text-neutral-950 hover:bg-neutral-50 transition-colors cursor-pointer shrink-0">
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            )}
          </div>
        </section>

        {/* SUBCATEGORY FILTER */}
        <section className="space-y-3">
          <div className="text-[11px] sm:text-xs font-black tracking-wider uppercase text-neutral-950 font-sans-en">{t('filterByTag', 'FILTER BY TYPE')}</div>
          <div className="flex items-center justify-start gap-2">
            {tagOverflow && (
              <button onClick={() => scrollContainer(tagScrollRef, -1)} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-[2px] border border-neutral-300 bg-white text-neutral-500 hover:bg-neutral-50 transition-colors cursor-pointer shrink-0">
                <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            )}
            <div ref={tagScrollRef} className="flex items-center gap-2 sm:gap-2.5 py-1 overflow-x-auto scrollbar-hide">
              {allTagsRaw.map((tag) => {
                const isActive = selectedTags.includes(tag);
                return (
                  <button key={tag} onClick={() => handleTagChange(tag)} className={`whitespace-nowrap px-3 sm:px-3.5 py-1.5 text-xs font-medium rounded-[3px] border transition-all cursor-pointer ${isActive ? 'bg-neutral-950 text-white border-neutral-950 font-bold' : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'}`}>
                    {allTagNames[tag] || tag}
                  </button>
                );
              })}
            </div>
            {tagOverflow && (
              <button onClick={() => scrollContainer(tagScrollRef, 1)} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-[3px] border border-neutral-300 bg-white shadow-2xs text-neutral-950 hover:bg-neutral-50 transition-colors cursor-pointer shrink-0">
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            )}
          </div>
        </section>

        {/* PROJECTS GRID */}
        <section id="projects-grid-section" className="space-y-6 pt-4">
          <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-3">
            <div className="text-base sm:text-lg font-black text-neutral-950 tracking-tight">
              {loading && allProjects.length === 0 ? '...' : `${filteredProjects.length} ${t('projectDisplayed', 'Projects')}`}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-500">{t('sort', 'Sort by:')}</span>
              <div className="relative">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none bg-transparent pl-2 pr-6 py-1 text-xs font-bold text-neutral-950 cursor-pointer focus:outline-none border-b border-neutral-400">
                  <option value="newest">{t('sortNewest', 'Newest')}</option>
                  <option value="featured">{t('sortFeatured', 'Featured')}</option>
                  <option value="photos">{t('sortPhotos', 'Most Photos')}</option>
                  <option value="reels">{t('sortReels', 'Most Reels')}</option>
                </select>
                <ChevronDown className="w-3 h-3 text-neutral-600 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {loading && allProjects.length === 0 ? (
            <div className="bg-neutral-50 p-12 text-center rounded-[4px] border border-neutral-200 space-y-3">
              <div className="w-10 h-10 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin mx-auto" />
              <h3 className="text-base font-bold text-neutral-800">{t('loading', 'Loading projects...')}</h3>
            </div>
          ) : sortedProjects.length === 0 ? (
            <div className="bg-neutral-50 p-12 text-center rounded-[4px] border border-neutral-200 space-y-3">
              <Camera className="w-10 h-10 text-neutral-400 mx-auto stroke-1" />
              <h3 className="text-base font-bold text-neutral-800">{t('noProjects', 'No projects match your selected filter')}</h3>
              <button onClick={() => { setSelectedSectorId('all'); setSelectedTags([]); }} className="px-4 py-2 bg-neutral-950 text-white text-xs font-bold rounded-[3px] mt-2 cursor-pointer hover:bg-neutral-800">
                {t('viewAllProjects', 'View All Projects')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {sortedProjects.map((proj) => {
                const fullTitle = ((isArabic ? proj.titleAr : proj.titleEn) || '').trim();
                const titleParts = fullTitle.split(/\s+/).filter(Boolean);
                const firstWord = titleParts[0] || '';
                const restTitle = titleParts.slice(1).join(' ');
                const description = isArabic ? proj.descriptionAr : proj.descriptionEn;

                if (proj.isHero) {
                  return (
                    <Link
                      to={`/portfolio/${proj.slug}`}
                      key={proj.id}
                      className="group relative block sm:col-span-2 lg:col-span-3 aspect-[19/6] overflow-hidden rounded-[4px] border border-neutral-200 bg-neutral-900 hover:border-neutral-300 hover:shadow-xs transition-all cursor-pointer"
                    >
                      <img
                        src={proj.coverImage}
                        alt={fullTitle}
                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className={`absolute inset-0 ${isRtl ? 'bg-gradient-to-l from-black/90 via-black/45 to-black/10' : 'bg-gradient-to-r from-black/90 via-black/45 to-black/10'}`} />
                      {renderProjectIcon(proj)}
                      <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5 lg:p-7">
                        <div className="h-8 sm:h-10 shrink-0" />
                        <div className={`flex flex-col my-auto ${isArabic ? 'text-right' : 'text-left'}`}>
                          <h3 className={`text-xl sm:text-2xl lg:text-[40px] font-black uppercase text-white leading-none tracking-tight line-clamp-2 drop-shadow-sm ${!isArabic ? 'font-sans-en' : ''}`}>
                            {fullTitle}
                          </h3>
                          <span className="block w-7 sm:w-8 h-[2px] bg-red-800 rounded-full my-1.5 sm:my-2" />
                          {description && (
                            <p className="text-[9.5px] sm:text-[11px] lg:text-xs text-white/75 leading-snug line-clamp-2 max-w-[85%] sm:max-w-md">
                              {description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2 shrink-0">
                          {renderCounts(proj, false)}
                          {renderViewButton()}
                        </div>
                      </div>
                    </Link>
                  );
                }

                return (
                  <Link
                    to={`/portfolio/${proj.slug}`}
                    key={proj.id}
                    className="group relative block aspect-[4/5] overflow-hidden rounded-[4px] border border-neutral-200 bg-neutral-900 hover:border-neutral-300 hover:shadow-xs transition-all cursor-pointer"
                  >
                    <img
                      src={proj.coverImage}
                      alt={fullTitle}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                    {renderProjectIcon(proj)}

                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6">
                      <div className={isArabic ? 'text-right' : 'text-left'}>
                        <h3 className={`text-xl sm:text-2xl lg:text-[30px] font-black uppercase text-white leading-none tracking-tight line-clamp-1 drop-shadow-sm transition-all duration-300 ease-out opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-5 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 ${!isArabic ? 'font-sans-en' : ''}`}>
                          {firstWord}
                        </h3>
                        {restTitle && (
                          <p className={`mt-1 text-[8.5px] sm:text-[9.5px] font-medium uppercase tracking-[0.14em] text-white/70 line-clamp-1 transition-all duration-300 ease-out opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-5 lg:delay-75 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 ${!isArabic ? 'font-sans-en' : ''}`}>
                            {restTitle}
                          </p>
                        )}
                        <span className="block w-7 h-[2px] bg-red-800 rounded-full my-1 transition-all duration-300 ease-out opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-5 lg:delay-150 lg:group-hover:opacity-100 lg:group-hover:translate-y-0" />
                        {description && (
                          <p className="text-[9.5px] sm:text-[10px] text-white/75 leading-snug line-clamp-3 max-w-[55%] transition-all duration-300 ease-out opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-5 lg:delay-225 lg:group-hover:opacity-100 lg:group-hover:translate-y-0">
                            {description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-0.5 sm:mt-1">
                        {renderCounts(proj, true)}
                        {renderViewButton()}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Portfolio;
