// Single source of truth for the facts search engines and AI assistants read
// about Saber Group. Used by scripts/prerender.mjs (build time) and
// middleware.js (request time). Keep every statement here verifiable —
// AI answers quote this almost verbatim.

export const SITE_URL = 'https://sabergroup-eg.com';
export const SITE_NAME = 'Saber Group';
export const LOGO_URL = `${SITE_URL}/S%20ICON.png`;

export const PROJECTS_API =
  'https://marketing-planner-tau.vercel.app/api/v1/projects/public';

export const ORG = {
  name: 'Saber Group',
  alternateName: ['Saber Group Studios', 'صابر جروب'],
  tagline: 'Marketing, creative production and software agency in Tanta, Egypt',
  summary:
    'Saber Group is a marketing and creative agency based in Tanta, Egypt. ' +
    'It offers social media management, video and media production, ' +
    'photography, brand identity design and web development, and builds its ' +
    'own business software (a CRM and an applicant tracking system). ' +
    'Saber Group works with clients across Egypt in real estate, hospitality, ' +
    'restaurants, beauty, healthcare, fashion and retail.',
  summaryAr:
    'صابر جروب وكالة تسويق وإنتاج إبداعي مقرها طنطا، مصر. تقدم إدارة ' +
    'السوشيال ميديا، وإنتاج الفيديو والإعلانات، والتصوير الفوتوغرافي، ' +
    'وتصميم الهوية البصرية، وتطوير المواقع، كما تطور برامج أعمال خاصة بها ' +
    '(نظام CRM ونظام لتتبع المتقدمين للوظائف). تعمل مع عملاء في أنحاء مصر ' +
    'في قطاعات العقارات والفنادق والمطاعم والتجميل والرعاية الصحية والأزياء.',
  phone: '+201080099757',
  phoneDisplay: '01080099757',
  whatsapp: 'https://wa.me/201080099757',
  email: 'info@sabergroup-eg.com',
  locality: 'Tanta',
  localityAr: 'طنطا',
  region: 'Gharbia',
  country: 'EG',
  offices: [
    {
      name: 'Tanta Office',
      street: 'El-Stad St',
      lat: 30.810011,
      lng: 30.998228,
      mapsUrl: 'https://maps.app.goo.gl/U8b1DJxKdUVosnwV8',
    },
    {
      name: 'Saber Group Studios',
      street: 'Elnady St',
      lat: 30.7958747,
      lng: 30.9888239,
    },
  ],
  areaServed: ['Tanta', 'Gharbia', 'Egypt'],
  sameAs: [
    'https://www.facebook.com/sabergroupeg',
    'https://www.instagram.com/sabergroupstudios',
    'https://www.behance.net/ahmed_saber_',
  ],
  clients: [
    'Valora Developments',
    'Asia Cosmetics',
    'Seashell',
    'Swissôtel El Quseir',
    'Cubic',
    'Zad',
  ],
};

// Public, indexable routes. `priority` feeds sitemap.xml.
export const ROUTES = [
  {
    path: '/',
    priority: '1.0',
    title: 'Saber Group | Marketing & Creative Agency in Tanta, Egypt',
    description:
      'Saber Group is a marketing and creative agency in Tanta, Egypt: social media management, video production, photography, branding and web development.',
  },
  {
    path: '/portfolio',
    priority: '0.9',
    title: 'Portfolio | Saber Group — Marketing & Production Work',
    description:
      'Campaigns, photoshoots, video production and branding projects by Saber Group for real estate, hospitality, restaurants, beauty and healthcare brands in Egypt.',
  },
  {
    path: '/about',
    priority: '0.8',
    title: 'About Saber Group | Agency in Tanta, Egypt',
    description:
      'Saber Group started in Tanta, Egypt. Learn about our story, vision and values.',
  },
  {
    path: '/services',
    priority: '0.8',
    title: 'Business Software: ATS & CRM | Saber Group',
    description:
      'Saber Group builds an Arabic-ready Applicant Tracking System (ATS) and a sales CRM for teams in Egypt. See what each does and request a quote.',
  },
  {
    path: '/contact',
    priority: '0.7',
    title: 'Contact Saber Group | Tanta, Egypt',
    description:
      'Contact Saber Group in Tanta, Egypt by phone, WhatsApp or email to start a marketing, production or software project.',
  },
  {
    path: '/address',
    priority: '0.6',
    title: 'Saber Group Locations | Tanta, Egypt',
    description: 'Find the Saber Group office and studio in Tanta, Egypt.',
  },
  {
    path: '/join-us',
    priority: '0.6',
    title: 'Careers at Saber Group | Jobs in Tanta, Egypt',
    description:
      'Open positions at Saber Group, a marketing, production and software agency in Tanta, Egypt.',
  },
  { path: '/policies', priority: '0.2', sitemapOnly: true },
  { path: '/terms', priority: '0.2', sitemapOnly: true },
];
