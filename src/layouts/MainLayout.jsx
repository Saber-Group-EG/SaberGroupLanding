import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';
import { getJobPositions } from '../store/slices/jobPositionsSlice';
import { getFullUrl, getDefaultOgImage, SITE_NAME } from '../utils/ogMeta';

// ─── Centralized per-route SEO config ────────────────────────────────────────
// Add or edit routes here. All other layout concerns (Navbar, Footer) are
// handled once below — pages themselves contain zero <Helmet> or layout tags.
const routeMeta = {
  '/': {
    title: `${SITE_NAME} — Home`,
    description: 'Saber Group — Premium creative marketing agency in Egypt.',
  },
  '/services': {
    title: `Our Services — ${SITE_NAME}`,
    description:
      'Explore our ATS and CRM software platforms built for Egyptian and Arab businesses.',
  },
  '/about': {
    title: `About Us — ${SITE_NAME}`,
    description:
      'Learn about Saber Group, our story, vision, and the values that drive us.',
  },
  '/contact': {
    title: `Contact Us — ${SITE_NAME}`,
    description: `Get in touch with ${SITE_NAME}'s team to discuss your marketing and software needs.`,
  },
  '/address': {
    title: `Our Address — ${SITE_NAME}`,
    description: 'Find Saber Group offices in Tanta and Cairo, Egypt.',
  },
  '/policies': {
    title: `Policies — ${SITE_NAME}`,
    description:
      'Privacy policy, refund policy, and service duration policy for Saber Group software platforms.',
  },
  '/terms': {
    title: `Terms & Conditions — ${SITE_NAME}`,
    description:
      'Terms of service governing your use of Saber Group software platforms.',
  },
  '/join-us': {
    title: `Join Us — ${SITE_NAME}`,
    description: 'Explore open positions and join the Saber Group team.',
  },
  '/coming-soon': {
    title: `Coming Soon — ${SITE_NAME}`,
    description: 'Something new is on its way from Saber Group.',
  },
};

const defaultMeta = {
  title: SITE_NAME,
  description:
    'Saber Group — Premium marketing and software solutions in Egypt.',
};
// ─────────────────────────────────────────────────────────────────────────────

const MainLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const positions = useSelector((state) => state.jobPositions.positions);

  // Prefetch job positions once so JoinUs and JobApplicationForm pages
  // don't each need to trigger this independently.
  useEffect(() => {
    if (positions.length === 0) {
      dispatch(getJobPositions());
    }
  }, [dispatch, positions.length]);

  // Resolve meta for the current path, falling back to the default.
  // Strip trailing slash so /about/ and /about both match.
  const normalizedPath = location.pathname.replace(/\/$/, '') || '/';
  const meta = routeMeta[normalizedPath] ?? defaultMeta;
  const ogImage = getDefaultOgImage();
  const pageUrl = getFullUrl(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Global SEO / Open Graph ── */}
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        {ogImage && (
          <>
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:url" content={ogImage} />
            <meta property="og:image:secure_url" content={ogImage} />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={meta.title} />
          </>
        )}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
      </Helmet>

      {/* ── Chrome font for Arabic pages ── */}
      <Helmet>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap"
        />
      </Helmet>

      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
