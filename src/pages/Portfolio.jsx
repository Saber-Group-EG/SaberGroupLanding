import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '../i18n/hooks/useTranslation';
import { getProjects, selectAllProjects, selectProjectsLoading } from '../store/slices/projectsSlice';
import {
  Camera,
  Film,
  Layers,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';

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

  const allCategories = Array.from(
    new Set(publishedProjects.map((p) => p.sectorId?.trim().toLowerCase()).filter(Boolean))
  );

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

  const allTags = Array.from(
    new Set(sectorProjects.flatMap((p) => (p.subcategories || []).map((sub) => (typeof sub === 'string' ? sub : sub.name?.en || sub.name?.ar || '')).filter(Boolean)))
  );

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
  }, [allCategories.length, allTags.length]);

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
              <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-center sm:text-left">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[4px] border border-red-500/30 bg-red-50/50 flex items-center justify-center text-red-600 shrink-0">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-black text-neutral-950 tracking-tight leading-none sm:leading-tight">{publishedProjects.length}</div>
                  <div className="text-[10px] sm:text-xs text-neutral-500 font-medium mt-0.5 sm:mt-0">{t('projects', 'Projects')}</div>
                </div>
              </div>

              <div className="hidden sm:block w-[1px] h-10 bg-neutral-200/80" />

              <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-center sm:text-left border-x border-neutral-100 sm:border-x-0 px-1 sm:px-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[4px] border border-red-500/30 bg-red-50/50 flex items-center justify-center text-red-600 shrink-0">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-black text-neutral-950 tracking-tight leading-none sm:leading-tight">{publishedProjects.reduce((sum, p) => sum + (p.photosCount || 0), 0)}+</div>
                  <div className="text-[10px] sm:text-xs text-neutral-500 font-medium mt-0.5 sm:mt-0">{t('photos', 'Photos')}</div>
                </div>
              </div>

              <div className="hidden sm:block w-[1px] h-10 bg-neutral-200/80" />

              <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-center sm:text-left">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[4px] border border-red-500/30 bg-red-50/50 flex items-center justify-center text-red-600 shrink-0">
                  <Film className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-black text-neutral-950 tracking-tight leading-none sm:leading-tight">{publishedProjects.reduce((sum, p) => sum + (p.videosCount || 0), 0)}+</div>
                  <div className="text-[10px] sm:text-xs text-neutral-500 font-medium mt-0.5 sm:mt-0">{t('videos', 'Videos')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="lg:col-span-5">
            {featuredMasterProject ? (
              <Link to={`/portfolio/${featuredMasterProject.slug}`} className="group cursor-pointer block">
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
              {allCategories.map((cat) => {
                const isActive = selectedSectorId === cat;
                return (
                  <button key={cat} onClick={() => handleSectorChange(cat)} className={`whitespace-nowrap text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative pb-2.5 ${isActive ? 'text-red-600 font-black' : 'text-neutral-800 hover:text-red-600'}`}>
                    <span>{cat}</span>
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
              {allTags.map((tag) => {
                const isActive = selectedTags.includes(tag);
                return (
                  <button key={tag} onClick={() => handleTagChange(tag)} className={`whitespace-nowrap px-3 sm:px-3.5 py-1.5 text-xs font-medium rounded-[3px] border transition-all cursor-pointer ${isActive ? 'bg-neutral-950 text-white border-neutral-950 font-bold' : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'}`}>
                    {tag}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProjects.map((proj) => {
                const photosCount = proj.photosCount || 0;
                const videosCount = proj.videosCount || 0;
                return (
                  <Link to={`/portfolio/${proj.slug}`} key={proj.id} className="group bg-white border border-neutral-200 rounded-[4px] overflow-hidden grid grid-cols-1 sm:grid-cols-[48%_1fr] hover:border-neutral-300 hover:shadow-xs transition-all cursor-pointer">
                    <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
                      <img src={proj.coverImage} alt={isArabic ? proj.titleAr : proj.titleEn} className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500" loading="lazy" />
                    </div>
                    <div className="relative sm:h-full sm:overflow-hidden">
                      <div className="p-4 h-full flex flex-col justify-between sm:justify-end gap-3 sm:gap-0">
                        <div className="sm:overflow-hidden">
                          <h3 className="text-lg sm:text-xl font-black uppercase text-neutral-950 group-hover:text-red-600 transition-colors leading-tight line-clamp-2 tracking-tight font-sans-en">
                            {isArabic ? proj.titleAr : proj.titleEn}
                          </h3>
                          <div className="h-[1px] bg-neutral-200/70 my-2.5 sm:my-2 w-full" />
                          <p className="text-[11px] sm:text-[10.5px] font-semibold text-neutral-500">{isArabic ? proj.clientNameAr : proj.clientName || ''}</p>
                          <p className="text-[11px] sm:text-[11px] text-neutral-600 sm:text-neutral-500 leading-relaxed line-clamp-2 sm:line-clamp-2 mt-1.5 font-normal">
                            {isArabic ? proj.descriptionAr : proj.descriptionEn}
                          </p>
                        </div>
                        <div className="space-y-3 sm:space-y-2.5 pt-2 border-t border-neutral-100 sm:border-t-0 shrink-0">
                          <div className="flex items-center justify-around bg-neutral-50 border border-neutral-100 rounded-xs px-3 py-1.5 text-neutral-700">
                            {photosCount > 0 && (
                              <div className="flex items-center gap-1 text-[11px]">
                                <Camera className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                                <span className="font-bold text-neutral-950">{photosCount}</span>
                                <span className="text-[10.5px] text-neutral-500">{t('photosLabel', 'Photos')}</span>
                              </div>
                            )}
                            {photosCount > 0 && videosCount > 0 && (
                              <span className="text-neutral-200">|</span>
                            )}
                            {videosCount > 0 && (
                              <div className="flex items-center gap-1 text-[11px]">
                                <Film className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                                <span className="font-bold text-neutral-950">{videosCount}</span>
                                <span className="text-[10.5px] text-neutral-500">{t('videosLabel', 'Videos')}</span>
                              </div>
                            )}
                          </div>
                          <span className={`w-full py-2.5 sm:py-2 px-3 text-xs font-bold rounded-[2px] flex items-center justify-center gap-1.5 transition-colors bg-red-600 hover:bg-red-700 text-white`}>
                            <span>{t('viewProject', 'View Project')}</span>
                            {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                          </span>
                        </div>
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