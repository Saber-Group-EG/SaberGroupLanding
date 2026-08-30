import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../i18n/hooks/useTranslation';
import {
  getProjects,
  selectAllProjects,
  selectProjectsLoading,
  selectProjectBySlug,
  selectRelatedProjects,
} from '../store/slices/projectsSlice';
import { getAbsoluteImageUrl, SITE_URL } from '../utils/ogMeta';
import {
  Camera,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  X,
  Play,
  Building2,
  Maximize2,
  Users,
  Send,
  MessageSquare,
  Check,
  MapPin,
} from 'lucide-react';

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t: tFn, isArabic } = useTranslation();
  const dir = isArabic ? 'rtl' : 'ltr';
  const isRtl = dir === 'rtl';

  const t = (key, fallback) => {
    const translated = tFn(`portfolio:${key}`);
    return translated !== `portfolio:${key}` ? translated : fallback;
  };

  const loading = useSelector(selectProjectsLoading);
  const project = useSelector((state) => selectProjectBySlug(state, slug));
  const relatedProjects = useSelector((state) => selectRelatedProjects(state, slug));
  const allProjects = useSelector(selectAllProjects);

  const categoryName = project?.sectorId || '';

  const mediaGroups = project?.mediaGroups || [];
  const renderableGroups = mediaGroups.filter((g) => g.type === 'bulk' || g.type === 'photo' || g.type === 'before_after');
  const videoGroups = mediaGroups.filter((g) => g.type === 'video');

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  const [openSectors, setOpenSectors] = useState({});
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [lightboxSectionItems, setLightboxSectionItems] = useState([]);
  const [lightboxGroupIndex, setLightboxGroupIndex] = useState(0);
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', brand: '', notes: '' });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, zoomX: 0, zoomY: 0 });
  const lastTouchDistRef = useRef(0);
  const lightboxImgRef = useRef(null);

  const toggleSector = (key) => setOpenSectors((prev) => ({ ...prev, [key]: !prev[key] }));

  const sectionRefs = useRef([]);

  const getAllPhotos = () => {
    return renderableGroups
      .filter((group) => group.type !== 'before_after')
      .map((group) => {
        return (group.items || []).filter((item) => !(item.type === 'video' || item.url?.match(/\.(mp4|webm|ogg)$/i)));
      });
  };

  const resetZoom = () => { setZoomLevel(1); setZoomPosition({ x: 0, y: 0 }); };

  const handleWheelZoom = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setZoomLevel((prev) => {
      const next = Math.max(1, Math.min(4, prev + delta));
      if (next === 1) setZoomPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (zoomLevel > 1) {
      resetZoom();
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * -100;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -100;
      setZoomLevel(2.5);
      setZoomPosition({ x, y });
    }
  };

  const handleZoomMouseDown = (e) => {
    if (zoomLevel <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, zoomX: zoomPosition.x, zoomY: zoomPosition.y };
    const onMove = (ev) => {
      const dx = ev.clientX - dragStartRef.current.x;
      const dy = ev.clientY - dragStartRef.current.y;
      const newX = Math.max(-100, Math.min(100, dragStartRef.current.zoomX + (dx / window.innerWidth) * 100));
      const newY = Math.max(-100, Math.min(100, dragStartRef.current.zoomY + (dy / window.innerHeight) * 100));
      setZoomPosition({ x: newX, y: newY });
    };
    const onUp = () => { setIsDragging(false); window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDistRef.current = Math.sqrt(dx * dx + dy * dy);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const scale = dist / lastTouchDistRef.current;
      lastTouchDistRef.current = dist;
      setZoomLevel((prev) => Math.max(1, Math.min(4, prev * scale)));
    }
  };

  const totalLightboxPhotos = lightboxPhoto?.totalPhotos || lightboxSectionItems.length;
  const currentFlatIndex = (lightboxPhoto?.flatIndex ?? lightboxPhoto?.index ?? 0) + 1;

  useEffect(() => {
    sectionRefs.current = sectionRefs.current.slice(0, renderableGroups.length);
  }, [renderableGroups.length]);

  useEffect(() => {
    if (renderableGroups.length === 0) return;
    setOpenSectors((prev) => {
      const next = { ...prev };
      renderableGroups.forEach((_, i) => {
        const key = `group_${i}`;
        if (!(key in next)) next[key] = true;
      });
      return next;
    });
    setLightboxPhoto(null);
    setActiveVideoUrl(null);
    setFormSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, renderableGroups.length]);

  useEffect(() => {
    if (!lightboxPhoto) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') { isRtl ? handlePrevLightbox() : handleNextLightbox(); }
      else if (e.key === 'ArrowLeft') { isRtl ? handleNextLightbox() : handlePrevLightbox(); }
      else if (e.key === 'Escape') { setLightboxPhoto(null); resetZoom(); }
      else if (e.key === '+' || e.key === '=') { setZoomLevel((prev) => Math.min(4, prev + 0.25)); }
      else if (e.key === '-') { setZoomLevel((prev) => { const next = Math.max(1, prev - 0.25); if (next === 1) resetZoom(); return next; }); }
      else if (e.key === '0') { resetZoom(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxPhoto, isRtl]);

  useEffect(() => {
    const img = lightboxImgRef.current;
    if (!img || !lightboxPhoto) return;
    const onWheel = (e) => { e.preventDefault(); handleWheelZoom(e); };
    img.addEventListener('wheel', onWheel, { passive: false });
    return () => img.removeEventListener('wheel', onWheel);
  }, [lightboxPhoto]);

  if (loading && !project) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center font-sans pt-24">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin mx-auto" />
          <h2 className="text-lg font-bold text-neutral-800">{t('loadingProject', 'Loading project...')}</h2>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center font-sans pt-24">
        <div className="text-center space-y-4">
          <Camera className="w-12 h-12 text-neutral-300 mx-auto" />
          <h2 className="text-lg font-bold text-neutral-800">{t('projectNotFound', 'Project not found')}</h2>
          <button onClick={() => navigate('/portfolio')} className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-[3px] cursor-pointer hover:bg-red-700">
            {t('backToPortfolio', 'Back to Portfolio')}
          </button>
        </div>
      </div>
    );
  }



  let sectionCounter = 0;
  const nextSectionNum = () => { sectionCounter += 1; return String(sectionCounter).padStart(2, '0'); };

  const creditsList = (project.cast?.length > 0 ? project.cast : []).filter((c) => c.name);

  const scrollToSection = (index) => {
    if (sectionRefs.current[index]) {
      const element = sectionRefs.current[index];
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  const handleNextLightbox = (e) => {
    e?.stopPropagation();
    resetZoom();
    const allGroups = getAllPhotos();
    if (allGroups.length === 0) return;
    let groupIdx = lightboxGroupIndex;
    let photoIdx = lightboxPhoto.index;
    const currentGroup = allGroups[groupIdx];
    if (photoIdx < currentGroup.length - 1) {
      photoIdx += 1;
    } else {
      groupIdx = (groupIdx + 1) % allGroups.length;
      photoIdx = 0;
    }
    const item = allGroups[groupIdx][photoIdx];
    const totalPhotos = allGroups.reduce((sum, g) => sum + g.length, 0);
    let flatIndex = 0;
    for (let i = 0; i < groupIdx; i++) flatIndex += allGroups[i].length;
    flatIndex += photoIdx;
    setLightboxGroupIndex(groupIdx);
    setLightboxSectionItems(allGroups[groupIdx]);
    setLightboxPhoto({ url: item.url, title: isArabic ? item.caption || `لقطة #${flatIndex + 1}` : item.caption || `Photo #${flatIndex + 1}`, index: photoIdx, flatIndex, totalPhotos });
  };

  const handlePrevLightbox = (e) => {
    e?.stopPropagation();
    resetZoom();
    const allGroups = getAllPhotos();
    if (allGroups.length === 0) return;
    let groupIdx = lightboxGroupIndex;
    let photoIdx = lightboxPhoto.index;
    if (photoIdx > 0) {
      photoIdx -= 1;
    } else {
      groupIdx = (groupIdx - 1 + allGroups.length) % allGroups.length;
      photoIdx = allGroups[groupIdx].length - 1;
    }
    const item = allGroups[groupIdx][photoIdx];
    const totalPhotos = allGroups.reduce((sum, g) => sum + g.length, 0);
    let flatIndex = 0;
    for (let i = 0; i < groupIdx; i++) flatIndex += allGroups[i].length;
    flatIndex += photoIdx;
    setLightboxGroupIndex(groupIdx);
    setLightboxSectionItems(allGroups[groupIdx]);
    setLightboxPhoto({ url: item.url, title: isArabic ? item.caption || `لقطة #${flatIndex + 1}` : item.caption || `Photo #${flatIndex + 1}`, index: photoIdx, flatIndex, totalPhotos });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const projectName = isArabic ? project.titleAr : project.titleEn;
  const projectDesc = isArabic ? project.descriptionAr : project.descriptionEn;
  const coverUrl = getAbsoluteImageUrl(project.fullMainCover?.url || project.coverImage);
  const pageUrl = `${SITE_URL}/portfolio/${slug}`;

  return (
    <div className="w-full bg-white text-neutral-900 animate-fade-in pb-20 font-sans">
      <Helmet>
        <title>{projectName} | Saber Group</title>
        <meta name="description" content={projectDesc || projectName} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${projectName} | Saber Group`} />
        <meta property="og:description" content={projectDesc || projectName} />
        <meta property="og:image" content={coverUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="Saber Group" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${projectName} | Saber Group`} />
        <meta name="twitter:description" content={projectDesc || projectName} />
        <meta name="twitter:image" content={coverUrl} />
      </Helmet>
      {/* BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-4">
        <div className="flex items-center gap-4 text-xs sm:text-sm font-medium">
          <button onClick={() => navigate('/portfolio')} className="flex items-center gap-2 font-bold text-neutral-950 hover:text-red-600 transition-colors cursor-pointer group">
            {isRtl ? <ArrowRight className="w-4 h-4 text-red-600 transition-transform group-hover:translate-x-1" /> : <ArrowLeft className="w-4 h-4 text-red-600 transition-transform group-hover:-translate-x-1" />}
            <span>{t('backToPortfolio', 'Back to Portfolio')}</span>
          </button>
          <span className="w-[1px] h-4 bg-neutral-300" />
          <div className="flex items-center gap-2 text-neutral-400 overflow-hidden">
            <span className="hover:text-neutral-700 cursor-pointer" onClick={() => navigate('/portfolio')}>{t('portfolioLabel', 'Portfolio')}</span>
            <span>/</span>
            <span className="text-neutral-950 font-bold truncate max-w-xs sm:max-w-md">{isArabic ? project.titleAr : project.titleEn}</span>
          </div>
        </div>
      </div>

      {/* HERO SHOWCASE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-5 flex">
            <div onClick={() => { setLightboxSectionItems([{ url: project.fullMainCover?.url || project.coverImage, caption: isArabic ? project.titleAr : project.titleEn }]); setLightboxPhoto({ url: project.fullMainCover?.url || project.coverImage, title: isArabic ? project.titleAr : project.titleEn, index: 0 }); }} className="relative w-full aspect-[4/5] sm:aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-[3px] bg-neutral-950 border border-neutral-200 cursor-pointer group shadow-2xs">
              <img src={project.coverImage} alt={isArabic ? project.titleAr : project.titleEn} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700" />
              <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <span className="bg-neutral-950/80 backdrop-blur-xs text-xs font-bold px-3 py-1.5 rounded-[2px] border border-white/20 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-red-500" />
                  <span>{t('viewFullSize', 'View Full Screen')}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between space-y-5 sm:space-y-6">
            <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 inline-block shrink-0" />
                <span className="text-[10.5px] sm:text-xs font-black tracking-wider uppercase text-neutral-950 font-sans-en truncate">
                  {project.sectorId || t('foodStylingCommercial', 'FOOD STYLING / COMMERCIAL CAMPAIGN')}
                </span>
              </div>
              {/* <div className="text-[9.5px] sm:text-[11px] font-bold tracking-widest uppercase text-neutral-700 px-2 py-0.5 border border-neutral-300 rounded-[2px] font-sans-en shrink-0">{t('productionArchive', 'PRODUCTION ARCHIVE / 2026')}</div> */}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-black uppercase text-neutral-950 tracking-tight leading-[1.18] font-sans-en">
                {isArabic ? project.titleAr : project.titleEn}
              </h1>
              <div className="w-12 sm:w-14 h-[3px] bg-red-600 mt-3 mb-3" />
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-2xl font-normal">
                {isArabic ? project.descriptionAr : project.descriptionEn}
              </p>
              {(project.services || []).length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {project.services.map((service, i) => (
                    <React.Fragment key={i}>
                      <span className="text-[11px] sm:text-xs font-bold text-neutral-700">{service}</span>
                      {i < project.services.length - 1 && <span className="text-neutral-300">|</span>}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-4 sm:pt-5 border-t border-neutral-200">
              <div className="space-y-0.5 sm:space-y-1">
                <span className="text-[9.5px] sm:text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 font-sans-en block">{t('client', 'CLIENT')}</span>
                <div className="text-xs sm:text-[13px] font-extrabold text-neutral-950 leading-snug">{project.clientName || 'La Chocolatier Group'}</div>
                <div className="flex items-center gap-1 text-[10.5px] sm:text-[11px] text-neutral-500 font-medium">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span>{isArabic ? project.locationAr : project.locationEn}</span>
                </div>
              </div>
              {project.shootedAt && (
                <div className="space-y-0.5 sm:space-y-1">
                  <span className="text-[9.5px] sm:text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 font-sans-en block">{t('date', 'DATE')}</span>
                  <div className="text-xs sm:text-[13px] font-extrabold text-neutral-950 leading-snug">
                    {new Date(project.shootedAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              )}
              <div className="space-y-0.5 sm:space-y-1">
                <span className="text-[9.5px] sm:text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 font-sans-en block">{t('sector', 'SECTOR')}</span>
                <div className="text-xs sm:text-[13px] font-extrabold text-neutral-950 leading-snug">
                  {categoryName || t('restaurants', 'Restaurants & Culinary')}
                </div>
              </div>
              {/* SUB SECTORS */}
              {(project.subcategories || []).length > 0 && (
                <div className="space-y-0.5 sm:space-y-1">
                  <span className="text-[9.5px] sm:text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 font-sans-en block">{t('subSectors', 'SUB SECTORS')}</span>
                  <div className="space-y-0.5 text-xs sm:text-[13px] font-extrabold text-neutral-950 leading-snug">
                    {project.subcategories.map((sub, i) => {
                      const name = typeof sub === 'string'
                        ? (allProjects.find((p) => p.id === sub) ? (isArabic ? allProjects.find((p) => p.id === sub).titleAr : allProjects.find((p) => p.id === sub).titleEn) : sub)
                        : (isArabic ? sub.name?.ar : sub.name?.en) || sub.name?.en || sub.name?.ar || sub._id || '';
                      return <div key={i}>{name}</div>;
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 pt-4 sm:pt-6 border-t border-neutral-200">
              {project.photosCount > 0 && (
                <div className="text-center sm:text-left pr-2 sm:pr-4">
                  <div className="text-xl sm:text-3xl lg:text-4xl font-black text-neutral-950 tracking-tight">{project.photosCount}</div>
                  <div className="text-[9.5px] sm:text-[11px] font-extrabold uppercase tracking-wider text-neutral-500 font-sans-en mt-0.5 sm:mt-1">{t('photosCount', 'PHOTOS')}</div>
                </div>
              )}
              {project.videosCount > 0 && (
                <div className="text-center sm:text-left px-2 sm:px-4 border-x border-neutral-200">
                  <div className="text-xl sm:text-3xl lg:text-4xl font-black text-neutral-950 tracking-tight">{String(project.videosCount).padStart(2, '0')}</div>
                  <div className="text-[9.5px] sm:text-[11px] font-extrabold uppercase tracking-wider text-neutral-500 font-sans-en mt-0.5 sm:mt-1">{t('videosCount', 'VIDEOS')}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MEDIA SECTORS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-200 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            {/* Dynamic Photo/Video Groups */}
            {renderableGroups.map((group, groupIdx) => {
              const num = nextSectionNum();
              const isBeforeAfter = group.type === 'before_after';
              const items = isBeforeAfter ? (group.items || []) : (group.items || []);
              const allVideos = !isBeforeAfter && items.every((item) => item.type === 'video' || item.url?.match(/\.(mp4|webm|ogg)$/i));
              const filteredGroups = renderableGroups;
              const totalSections = filteredGroups.length;
              return (
                <div key={groupIdx} ref={(el) => { sectionRefs.current[groupIdx] = el; }}>
                  <SectorAccordion number={num} title={isArabic ? group.title || `المجموعة ${groupIdx + 1}` : group.title || `Group ${groupIdx + 1}`} description={isArabic ? group.descriptionAr : group.descriptionEn} count={isBeforeAfter ? 2 : items.length} countLabel={isBeforeAfter ? t('photosLabel', 'PHOTOS') : allVideos ? t('reelsLabel', 'VIDEOS') : t('photosLabel', 'PHOTOS')} currentSection={groupIdx + 1} totalSections={totalSections} onPrev={() => scrollToSection(groupIdx - 1)} onNext={() => scrollToSection(groupIdx + 1)} hasPrev={groupIdx > 0} hasNext={groupIdx < totalSections - 1} isOpen={!!openSectors[`group_${groupIdx}`]} onToggle={() => setOpenSectors((prev) => ({ ...prev, [`group_${groupIdx}`]: !prev[`group_${groupIdx}`] }))}>
                  {isBeforeAfter ? (
                    <BeforeAfterSlider
                      beforeImage={group.before?.url}
                      afterImage={group.after?.url}
                      beforeLabel={group.before?.caption}
                      afterLabel={group.after?.caption}
                      isArabic={isArabic}
                    />
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
                      {items.map((item, idx) => {
                        const isVideo = item.type === 'video' || item.url?.match(/\.(mp4|webm|ogg)$/i);
                        return (
                          <div key={idx} onClick={() => isVideo ? setActiveVideoUrl(item.url) : (() => { const photoItems = items.filter(i => !(i.type === 'video' || i.url?.match(/\.(mp4|webm|ogg)$/i))); const photoIdx = photoItems.indexOf(item); setLightboxGroupIndex(groupIdx); setLightboxSectionItems(photoItems); const totalPhotos = getAllPhotos().reduce((sum, g) => sum + g.length, 0); let flatIndex = 0; for (let i = 0; i < groupIdx; i++) flatIndex += getAllPhotos()[i].length; flatIndex += (photoIdx >= 0 ? photoIdx : 0); setLightboxPhoto({ url: item.url, title: isArabic ? item.caption || `لقطة #${flatIndex + 1}` : item.caption || `Photo #${flatIndex + 1}`, index: photoIdx >= 0 ? photoIdx : 0, flatIndex, totalPhotos }); })()} className="group relative bg-neutral-950 rounded-[2px] overflow-hidden border border-neutral-200 hover:border-red-500 transition-all cursor-pointer aspect-4/5 shadow-2xs">
                            {isVideo ? (
                              <>
                                <video src={item.url} muted loop playsInline poster={item.thumbnail} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                                    <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5" fill="white" />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <img src={item.thumbnail || item.url} alt={item.caption || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                            )}
                            <div className="absolute inset-0 bg-neutral-950/80 opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-end text-white text-right">
                              <span className="text-[11px] font-bold leading-tight line-clamp-2">{isArabic ? item.caption : item.caption}</span>
                              <span className="text-[9px] text-red-400 font-bold mt-1 flex items-center gap-1">
                                {isVideo ? <><Play className="w-2.5 h-2.5" />{t('playVideo', 'Play video')}</> : <><Maximize2 className="w-2.5 h-2.5" />{t('viewFullSize', 'View full size')}</>}
                              </span>
                            </div>
                            <div className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-[2px]">#{idx + 1}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </SectorAccordion>
                </div>
              );
            })}

            {/* META TAGS */}
            {(project.tags || []).length > 0 && (
              <div className="bg-white rounded-[3px] border border-neutral-200 p-4 sm:p-5 shadow-2xs">
                <h3 className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-neutral-400 font-sans-en mb-3">Meta tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <a
                      key={i}
                      href={`/portfolio/${slug}`}
                      className="inline-flex items-center px-3 py-1.5 bg-neutral-100 hover:bg-red-50 hover:border-red-300 border border-neutral-200 rounded-full text-[11px] sm:text-xs font-bold text-neutral-700 hover:text-red-600 transition-all"
                    >
                      {tag}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            {/* Inquiry Form */}
            <div className="bg-white rounded-[3px] border border-neutral-200 p-5 space-y-4 shadow-2xs">
              <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                <div className="w-8 h-8 rounded-[2px] bg-red-600 text-white flex items-center justify-center font-bold shrink-0"><MessageSquare className="w-4 h-4" /></div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950">{t('requestSimilarShoot', 'Request a Similar Shoot')}</h3>
                  <p className="text-[10.5px] text-neutral-500 font-medium">{t('requestDescription', 'Enter details to get an instant tailored quote')}</p>
                </div>
              </div>
              {formSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-[2px] p-4 text-center space-y-2 animate-fade-in">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-xs"><Check className="w-4 h-4" /></div>
                  <h4 className="text-xs font-extrabold text-emerald-900">{t('requestSuccess', 'Request Received Successfully!')}</h4>
                  <p className="text-[11px] text-emerald-700">{t('requestSuccessDesc', 'Our production team will contact you shortly.')}</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">{t('nameBrand', 'Name / Brand Name *')}</label>
                    <input type="text" required placeholder={t('namePlaceholder', 'e.g. My Restaurant Brand')} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-neutral-50 border border-neutral-200 rounded-[2px] px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">{t('phone', 'Phone / WhatsApp *')}</label>
                    <input type="tel" required placeholder="010xxxxxxx" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-neutral-50 border border-neutral-200 rounded-[2px] px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">{t('notes', 'Shooting Notes / Preferences')}</label>
                    <textarea rows={2} placeholder={t('notesPlaceholder', 'Number of photos, reels needed...')} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full bg-neutral-50 border border-neutral-200 rounded-[2px] px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white resize-none" />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold text-xs rounded-[2px] transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer">
                    <Send className="w-3.5 h-3.5" />
                    <span>{t('submitRequest', 'Submit Shooting Request')}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Credits */}
            <div className="bg-white rounded-[3px] border border-neutral-200 p-4 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                <Users className="w-3.5 h-3.5 text-red-600" />
                <h3 className="text-xs font-extrabold text-neutral-950">{t('projectCredits', 'Project Credits & Crew')}</h3>
              </div>
              <div className="space-y-2">
                {creditsList.map((cred, idx) => (
                    <div key={idx} className="bg-neutral-50 px-2.5 py-2 rounded-[2px] border border-neutral-100 flex items-center justify-between gap-3 hover:bg-neutral-100/70 transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {cred.avatar ? (
                          <img src={cred.avatar} alt={cred.name} className="w-7 h-7 rounded-full object-cover shrink-0 border border-neutral-200 shadow-2xs" loading="lazy" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                            {cred.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <span className="text-[9.5px] font-bold text-neutral-500 block truncate">{isArabic ? cred.roleAr : cred.roleEn}</span>
                          <span className="text-xs font-bold text-neutral-950 block truncate">{cred.name}</span>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <div className="bg-white rounded-[3px] border border-neutral-200 p-4 space-y-3 shadow-2xs">
                <h4 className="text-xs font-extrabold text-neutral-950 flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-red-600" /><span>{t('moreInSector', 'More in this Sector')}</span></h4>
                <div className="space-y-2">
                  {relatedProjects.slice(0, 3).map((rel) => (
                    <div key={rel.id} onClick={() => navigate(`/portfolio/${rel.slug}`)} className="p-2 rounded-[2px] hover:bg-neutral-50 border border-transparent hover:border-neutral-200 transition-all cursor-pointer flex items-center gap-3">
                      <img src={rel.coverImage} alt="" className="w-11 h-11 rounded-[2px] object-cover shrink-0" />
                      <div className="overflow-hidden">
                        <h5 className="text-xs font-bold text-neutral-950 truncate">{isArabic ? rel.titleAr : rel.titleEn}</h5>
                        <p className="text-[10px] text-neutral-500 truncate mt-0.5">{rel.clientName || rel.tags?.slice(0, 2).join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxPhoto && (
        <div onClick={() => { setLightboxPhoto(null); resetZoom(); }} className="fixed inset-0 z-60 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 select-none">
          <button onClick={() => { setLightboxPhoto(null); resetZoom(); }} className="absolute top-5 right-5 z-70 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"><X className="w-6 h-6" /></button>
          <div className="absolute top-6 left-6 z-70 bg-neutral-900/90 text-white text-xs font-extrabold px-4 py-2 rounded-2xl backdrop-blur-md border border-neutral-700 flex items-center gap-3">
            <span>{`Photo ${currentFlatIndex} of ${totalLightboxPhotos}`}</span>
            <span className="text-neutral-500">|</span>
            <span className="text-neutral-300 max-w-xs truncate">{lightboxPhoto.title}</span>
            {zoomLevel > 1 && <span className="text-red-400">{Math.round(zoomLevel * 100)}%</span>}
          </div>
          <button onClick={handlePrevLightbox} className="absolute left-4 top-1/2 -translate-y-1/2 z-70 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer">
            {isRtl ? <ArrowRight className="w-6 h-6" /> : <ArrowLeft className="w-6 h-6" />}
          </button>
          <div onClick={(e) => e.stopPropagation()} className="relative max-w-6xl max-h-[88vh] flex items-center justify-center overflow-hidden">
            <img
              ref={lightboxImgRef}
              src={lightboxPhoto.url}
              alt={lightboxPhoto.title}
              className="max-w-full max-h-[88vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              style={{
                transform: `scale(${zoomLevel}) translate(${zoomPosition.x}%, ${zoomPosition.y}%)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
              }}
              onWheel={handleWheelZoom}
              onDoubleClick={handleDoubleClick}
              onMouseDown={handleZoomMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              draggable={false}
            />
          </div>
          <button onClick={handleNextLightbox} className="absolute right-4 top-1/2 -translate-y-1/2 z-70 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer">
            {isRtl ? <ArrowLeft className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
          </button>
          {zoomLevel > 1 && (
            <button onClick={(e) => { e.stopPropagation(); resetZoom(); }} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-70 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer backdrop-blur-md border border-white/10">
              Reset Zoom
            </button>
          )}
        </div>
      )}

      {/* VIDEO MODAL */}
      {activeVideoUrl && (
        <div onClick={() => setActiveVideoUrl(null)} className="fixed inset-0 z-60 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <button onClick={() => setActiveVideoUrl(null)} className="absolute top-5 right-5 z-70 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"><X className="w-6 h-6" /></button>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm aspect-9/16 max-h-[85vh] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            {activeVideoUrl.match(/\.(mp4|webm|ogg)$/i) ? (
              <video src={activeVideoUrl} controls autoPlay className="w-full h-full object-contain" />
            ) : (
              <iframe src={activeVideoUrl} title="Full Screen Video 9:16" className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* Before / After Comparison Slider */
const BeforeAfterSlider = ({ beforeImage, afterImage, beforeLabel, afterLabel, isArabic }) => {
  const containerRef = useRef(null);
  const beforeClipRef = useRef(null);
  const sliderLineRef = useRef(null);
  const posRef = useRef(50);

  const lblBefore = beforeLabel || (isArabic ? 'قبل' : 'Before');
  const lblAfter = afterLabel || (isArabic ? 'بعد' : 'After');

  const setPosition = (pct) => {
    const clamped = Math.max(0, Math.min(100, pct));
    posRef.current = clamped;
    if (beforeClipRef.current) beforeClipRef.current.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
    if (sliderLineRef.current) sliderLineRef.current.style.left = `${clamped}%`;
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setPosition(((e.clientX - rect.left) / rect.width) * 100);

    const onMove = (ev) => {
      ev.preventDefault();
      const r = container.getBoundingClientRect();
      setPosition(((ev.clientX - r.left) / r.width) * 100);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-[3px] bg-neutral-950 border border-neutral-200 cursor-ew-resize select-none shadow-2xs"
      onPointerDown={handlePointerDown}
    >
      {/* Spacer image - defines correct container height */}
      {afterImage && (
        <img src={afterImage} alt="" className="w-full h-auto block pointer-events-none" style={{ visibility: 'hidden' }} draggable={false} loading="lazy" />
      )}

      {/* After image */}
      {afterImage && (
        <img src={afterImage} alt={lblAfter} className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ objectFit: 'cover', objectPosition: 'center' }} draggable={false} loading="lazy" />
      )}

      {/* Before image (clipped via clip-path) */}
      {beforeImage && (
        <img ref={beforeClipRef} src={beforeImage} alt={lblBefore} className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ objectFit: 'cover', objectPosition: 'center', clipPath: 'inset(0 50% 0 0)' }} draggable={false} loading="lazy" />
      )}

      {/* Slider line */}
      <div ref={sliderLineRef} className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10 pointer-events-none" style={{ left: '50%', transform: 'translateX(-50%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-neutral-200">
          <div className="flex items-center gap-0">
            <ArrowLeft className="w-3.5 h-3.5 text-neutral-600" />
            <ArrowRight className="w-3.5 h-3.5 text-neutral-600" />
          </div>
        </div>
      </div>

      {/* Labels */}
      {beforeImage && (
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-[2px] z-10 pointer-events-none">
          {lblBefore}
        </div>
      )}
      {afterImage && (
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-[2px] z-10 pointer-events-none">
          {lblAfter}
        </div>
      )}
    </div>
  );
};

/* Sector Accordion Wrapper */
const SectorAccordion = ({ number, title, description, count, countLabel, currentSection, totalSections, onPrev, onNext, hasPrev, hasNext, isOpen, onToggle, children }) => (
  <div className="bg-white rounded-[3px] border border-neutral-200 shadow-2xs overflow-hidden">
    <div role="button" tabIndex={0} onClick={onToggle} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(); }} className="w-full p-4 sm:p-5 bg-white hover:bg-neutral-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 cursor-pointer border-b border-neutral-200 text-left">
      <div className="flex items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex items-baseline shrink-0">
          <span className="text-2xl sm:text-3xl font-black text-neutral-950 font-sans-en tracking-tight border-b-2 border-red-600 pb-0.5 leading-none">{number}</span>
          <span className="text-xl sm:text-2xl font-light text-red-600 ml-1.5 sm:ml-2">/</span>
        </div>
        <div className="space-y-0.5">
          <div className="text-[10px] sm:text-[11px] font-black tracking-wider text-red-600 uppercase font-sans-en leading-none">{title}</div>
          {description && <p className="text-[10px] sm:text-[11px] text-neutral-500 leading-relaxed max-w-xl">{description}</p>}
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-center sm:flex-col sm:items-end gap-2.5 w-full sm:w-auto pt-2.5 sm:pt-0 border-t border-neutral-100 sm:border-t-0 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[9.5px] sm:text-[11px] font-extrabold tracking-wider text-neutral-500 uppercase font-sans-en">{count} {countLabel}</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button onClick={(e) => { e.stopPropagation(); if (hasPrev) onPrev(); }} className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-[2px] border transition-colors cursor-pointer ${hasPrev ? 'border-neutral-300 bg-white text-neutral-950 hover:bg-neutral-50' : 'border-neutral-200 text-neutral-300 cursor-not-allowed'}`}><ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" /></button>
          <div className="text-[11px] sm:text-xs font-sans-en px-1">
            <span className="font-black text-neutral-950">{String(currentSection).padStart(2, '0')}</span>
            <span className="text-neutral-400 font-medium ml-0.5">/ {String(totalSections).padStart(2, '0')}</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); if (hasNext) onNext(); }} className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-[3px] border transition-colors cursor-pointer ${hasNext ? 'border-neutral-300 bg-white shadow-2xs text-neutral-950 hover:bg-neutral-50' : 'border-neutral-200 text-neutral-300 cursor-not-allowed'}`}><ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" /></button>
        </div>
      </div>
    </div>
    {isOpen && <div className="p-3 sm:p-5 bg-white animate-fade-in">{children}</div>}
  </div>
);

export default ProjectDetail;