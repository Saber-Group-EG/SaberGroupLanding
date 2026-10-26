// Layout 1 — Cinema. The project plays like a film: every scroll lands on a full-screen scene
// (opening title, synopsis, a title card per chapter, then the frames over a blurred copy of the
// photo). On wide screens portrait photos are grouped two or three to a scene. The crew rolls
// as closing credits.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './Layout1.css';

const WHATSAPP = '201080099757';
const PHONE = '01080099757';
const pad = (n) => String(n).padStart(2, '0');
const isVideo = (m) => m.type === 'video' || /\.(mp4|webm|ogg)$/i.test(m.url || '');
const isPortrait = (r) => r < 0.95;

// Lead line + paragraphs: editors separate paragraphs with blank lines.
const splitText = (text) => {
  const parts = String(text || '').split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
  let lead = '';
  if (parts.length > 1 && parts[0].length <= 70 && !/[.!؟?]$/.test(parts[0])) lead = parts.shift();
  return { lead, paras: parts };
};

const useWide = () => {
  const query = '(min-aspect-ratio: 5/4)';
  const [wide, setWide] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
};

// Natural width/height ratio of every photo, so portraits can be grouped.
const useRatios = (urls) => {
  const [ratios, setRatios] = useState({});
  useEffect(() => {
    let alive = true;
    urls.forEach((url) => {
      const img = new Image();
      img.onload = () => alive && setRatios((r) => ({ ...r, [url]: img.naturalWidth / img.naturalHeight }));
      img.src = url;
    });
    return () => { alive = false; };
  }, [urls]);
  return ratios;
};

const groupFrames = (photos, ratios, wide) => {
  const groups = [];
  let i = 0;
  while (i < photos.length) {
    const r = (p) => ratios[p.url] || 0.8;
    if (!wide || !isPortrait(r(photos[i]))) { groups.push([photos[i]]); i++; continue; }
    let run = 0;
    while (i + run < photos.length && isPortrait(r(photos[i + run])) && run < 3) run++;
    // Prefer threes, but never leave a single portrait stranded at the end.
    const take = photos.length - i === 4 ? 2 : Math.min(run, 3);
    groups.push(photos.slice(i, i + take));
    i += take;
  }
  return groups;
};

const Scene = ({ className, bg, chapter, children }) => (
  <section className={`cn-scene ${className}`} data-chapter={chapter}>
    {bg ? <div className="cn-ambient" style={{ backgroundImage: `url("${bg}")` }} /> : null}
    {children}
  </section>
);

const Video = ({ item, label }) => {
  const ref = useRef(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => {
      if (live) return;
      if (e.isIntersecting && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.45 });
    io.observe(v);
    return () => io.disconnect();
  }, [live]);
  const play = () => {
    const v = ref.current;
    setLive(true);
    v.muted = false;
    v.controls = true;
    v.currentTime = 0;
    v.play();
  };
  return (
    <div className={`cn-video${live ? ' is-live' : ''}`}>
      <video ref={ref} src={item.thumbnail ? item.url : `${item.url}#t=0.1`} poster={item.thumbnail || undefined}
        muted loop playsInline preload="metadata" />
      <button type="button" className="cn-play" onClick={play}>{label}</button>
    </div>
  );
};

const Lightbox = ({ photos, index, onClose, onGo, isArabic }) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onGo(isArabic ? -1 : 1);
      else if (e.key === 'ArrowLeft') onGo(isArabic ? 1 : -1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onGo, isArabic]);
  const touchX = useRef(null);
  const photo = photos[index];
  return (
    <div className="cn-lb" role="dialog" aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - (touchX.current ?? e.changedTouches[0].clientX);
        if (Math.abs(dx) > 50) onGo(dx < 0 ? 1 : -1);
      }}>
      <img src={photo.url} alt={photo.caption || ''} />
      <p className="cn-lb-count" dir="ltr">{index + 1} / {photos.length}</p>
      <button type="button" className="cn-lb-btn cn-lb-close" onClick={onClose} aria-label="Close">✕</button>
      <button type="button" className="cn-lb-btn cn-lb-prev" onClick={() => onGo(-1)} aria-label="Previous">←</button>
      <button type="button" className="cn-lb-btn cn-lb-next" onClick={() => onGo(1)} aria-label="Next">→</button>
    </div>
  );
};

const Layout1 = ({ project, isArabic }) => {
  const t = (en, ar) => (isArabic ? ar : en);
  const wide = useWide();

  const title = (isArabic ? project.titleAr : project.titleEn) || project.titleEn || project.titleAr;
  const text = splitText((isArabic ? project.descriptionAr : project.descriptionEn) || project.descriptionEn);
  const client = project.hideClientName ? '' : (isArabic ? project.clientNameAr : project.clientName);
  const location = isArabic ? project.locationAr : project.locationEn;
  const services = (isArabic ? project.servicesAr : project.services) || [];
  const cover = project.fullMainCover?.url || project.mainCover || project.coverImage;

  const chapters = useMemo(() => (project.mediaGroups || []).map((g) => ({
    name: (isArabic ? g.titleAr : g.title) || '',
    photos: (g.items || []).filter((m) => !isVideo(m)),
    videos: (g.items || []).filter(isVideo),
  })).filter((c) => c.photos.length || c.videos.length), [project, isArabic]);

  const allPhotos = useMemo(() => chapters.flatMap((c) => c.photos), [chapters]);
  const photoUrls = useMemo(() => allPhotos.map((p) => p.url), [allPhotos]);
  const ratios = useRatios(photoUrls);
  const [lightbox, setLightbox] = useState(null);

  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t(
    `Hi Saber Group, I saw "${title}" and want a similar shoot.`,
    `أهلاً صابر جروب، شفت مشروع "${title}" وعايز شوت شبهه.`,
  ))}`;

  // Build the scene list once per render; each entry is [chapter label, element].
  const scenes = [];
  scenes.push([t('Opening', 'البداية'), (key, label) => (
    <Scene key={key} chapter={label} className="cn-open" bg={cover}>
      <div className="cn-card">
        <p className="cn-pre">{t('Saber Group Studios presents', 'استديوهات صابر جروب تقدّم')}</p>
        <h1 className="cn-title">{title}</h1>
        {client ? <p className="cn-for">{t('for ', 'لـ ')}{client}</p> : null}
        <p className="cn-hint" aria-hidden="true">{t('Scroll', 'مرّر')}</p>
      </div>
    </Scene>
  )]);

  if (text.lead || text.paras.length) {
    scenes.push([t('Synopsis', 'الفكرة'), (key, label) => (
      <Scene key={key} chapter={label} className="cn-text">
        <div className="cn-card cn-card--text">
          {text.lead ? <p className="cn-lead">{text.lead}</p> : null}
          {text.paras.slice(0, 2).map((p) => <p key={p} className="cn-sub">{p}</p>)}
          <p className="cn-meta">{[location, services.slice(0, 4).join(' · ')].filter(Boolean).join('  —  ')}</p>
        </div>
      </Scene>
    )]);
  }

  chapters.forEach((ch, ci) => {
    const name = ch.name || t('Scene ', 'مشهد ') + (ci + 1);
    scenes.push([name, (key, label) => (
      <Scene key={key} chapter={label} className="cn-inter" bg={ch.photos[0]?.url}>
        <div className="cn-card">
          <p className="cn-pre">{t('Chapter ', 'الفصل ')}{pad(ci + 1)}</p>
          <h2 className="cn-h">{name}</h2>
        </div>
      </Scene>
    )]);
    groupFrames(ch.photos, ratios, wide).forEach((group) => {
      scenes.push([name, (key, label) => (
        <Scene key={key} chapter={label} className={`cn-frames cn-frames--${group.length}`}
          bg={group[Math.floor(group.length / 2)].url}>
          <div className="cn-row" style={{ '--n': group.length }}>
            {group.map((m) => (
              <div key={m.url} className="cn-frame" style={{ '--r': ratios[m.url] || 0.8 }}>
                <img src={m.url} alt={m.caption || title} loading="lazy" decoding="async" draggable="false"
                  onClick={() => setLightbox(allPhotos.indexOf(m))} />
              </div>
            ))}
          </div>
        </Scene>
      )]);
    });
    ch.videos.forEach((v) => {
      scenes.push([name, (key, label) => (
        <Scene key={key} chapter={label} className="cn-film" bg={v.thumbnail}>
          <Video item={v} label={t('Play with sound', 'تشغيل بالصوت')} />
        </Scene>
      )]);
    });
  });

  if (project.cast?.length) {
    scenes.push([t('Credits', 'فريق العمل'), (key, label) => (
      <Scene key={key} chapter={label} className="cn-credits">
        <div className="cn-roll">
          <div className="cn-roll-inner">
            <p className="cn-pre">{t('Credits', 'فريق العمل')}</p>
            {project.cast.map((c) => (
              <p key={c.name + c.roleEn} className="cn-credit">
                <span>{isArabic ? c.roleAr : c.roleEn}</span><strong>{c.name}</strong>
              </p>
            ))}
            <p className="cn-credit"><span>{t('Produced at', 'إنتاج')}</span><strong>Saber Group Studios</strong></p>
          </div>
        </div>
      </Scene>
    )]);
  }

  scenes.push([t('The end', 'النهاية'), (key, label) => (
    <Scene key={key} chapter={label} className="cn-end" bg={cover}>
      <div className="cn-card">
        <h2 className="cn-h">{t('Your brand, next.', 'البراند بتاعك، المرة الجاية.')}</h2>
        <p className="cn-sub">{t("Tell us what you sell. We'll plan the shoot around it.", 'قولنا بتبيع إيه، وإحنا نخطط الشوت على مقاسه.')}</p>
        <p className="cn-actions">
          <a className="cn-btn" href={waLink} target="_blank" rel="noopener noreferrer">{t('Message us on WhatsApp', 'كلمنا على واتساب')}</a>
          <span className="cn-num" dir="ltr">{PHONE}</span>
        </p>
      </div>
    </Scene>
  )]);

  // HUD: which chapter is on screen and how far through the film we are.
  const rootRef = useRef(null);
  const [hud, setHud] = useState({ i: 0, label: scenes[0][0] });
  const sceneCount = scenes.length;
  useEffect(() => {
    const els = [...rootRef.current.querySelectorAll('.cn-scene')];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        e.target.classList.toggle('is-on', e.isIntersecting);
        if (e.isIntersecting) setHud({ i: els.indexOf(e.target), label: e.target.dataset.chapter });
      });
    }, { threshold: 0.55 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sceneCount, wide, ratios]);

  useEffect(() => {
    document.documentElement.classList.add('cn-snap');
    return () => document.documentElement.classList.remove('cn-snap');
  }, []);

  return (
    <div ref={rootRef} className="cn-layout" dir={isArabic ? 'rtl' : 'ltr'}>
      <Helmet>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=Manrope:wght@300;400;500&family=Cairo:wght@400;600;700&display=swap" />
      </Helmet>
      {scenes.map(([label, render], i) => render(i, label))}
      <div className="cn-hud" aria-hidden="true">
        <span className="cn-hud-ch">{hud.label}</span>
        <span className="cn-hud-n" dir="ltr">{pad(hud.i + 1)} / {pad(sceneCount)}</span>
        <span className="cn-hud-bar" style={{ '--p': (hud.i + 1) / sceneCount }} />
      </div>
      {lightbox !== null && allPhotos.length ? (
        <Lightbox photos={allPhotos} index={lightbox} isArabic={isArabic} onClose={() => setLightbox(null)}
          onGo={(d) => setLightbox((i) => (i + d + allPhotos.length) % allPhotos.length)} />
      ) : null}
    </div>
  );
};

export default Layout1;
