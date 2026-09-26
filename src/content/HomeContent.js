const homeContent = {
  en: {
    hero: {
      watchShowreel: 'WATCH SHOWREEL',
      projectLinkTitle: 'Click to view project details',
      prevSlide: 'Previous Slide',
      nextSlide: 'Next Slide',
      soundOff: 'Sound Off',
      soundOn: 'Sound On',
      muteTitle: 'Mute video',
      unmuteTitle: 'Unmute video audio',
      bullets: ['Video Production', 'Photography', 'Digital Marketing', 'Brand Creation'],
      slides: {
        'slide-01': {
          eyebrow: 'WE TURN IDEAS INTO',
          titleLines: ['REAL', 'RESULTS'],
          projectCategory: 'REAL ESTATE PROJECT',
          projectLocation: 'TANTA, EGYPT',
        },
        'slide-02': {
          eyebrow: 'CAPTIVATING COASTAL',
          titleLines: ['ATMOSPHERES'],
          projectCategory: 'RESTAURANT & BEACH',
          projectLocation: 'HURGHADA, EGYPT',
        },
        'slide-03': {
          eyebrow: 'ELEGANCE DEFINED IN',
          titleLines: ['EVERY DETAIL'],
          projectCategory: 'BRAND CAMPAIGN',
          projectLocation: 'CAIRO, EGYPT',
        },
        'slide-04': {
          eyebrow: 'TIMELESS LUXURY ON',
          titleLines: ['THE RED SEA'],
          projectCategory: 'HOTEL RENOVATION',
          projectLocation: 'EL QUSEIR, EGYPT',
        },
      },
    },

    stories: {
      heading: ['OUR', 'STORIES'],
      intro: 'A quick look into our latest projects and behind the scenes.',
      viewAll: 'VIEW ALL STORIES',
      scrollNext: 'Scroll stories right',
      items: {
        'story-bts': {
          subtitle: 'Video Shoot',
          category: 'Production',
          description:
            'Behind the scenes of our flagship cinema camera setup, utilizing anamorphic lenses and dynamic motion rigs.',
        },
        'story-valora': {
          subtitle: 'Tanta',
          category: 'Real Estate',
          description:
            'Golden hour drone sweeps and architectural cinematography for the new Valora luxury residential landmark in Tanta.',
        },
        'story-seashell': {
          subtitle: 'Hurghada',
          category: 'Hospitality',
          description:
            'Capturing sunlit beach vibes, azure Red Sea waters, and signature seaside culinary moments.',
        },
        'story-doctors': {
          subtitle: 'Marketing',
          category: 'Healthcare',
          description:
            'Humanizing medical innovation with documentary patient care narratives and doctor spotlight stories.',
        },
        'story-cosmetics': {
          subtitle: 'Brand Campaign',
          category: 'Beauty',
          description:
            'Macro studio photography and slow-motion droplet physics for luxury skincare serums and cosmetics.',
        },
        'story-cubic': {
          subtitle: 'Construction',
          category: 'Engineering',
          description:
            'Documenting the scale and human engineering precision of Cubic Engineering projects.',
        },
        'story-swissotel': {
          subtitle: 'El Quseir',
          category: 'Hospitality',
          description:
            'Twilight architectural photography highlighting the peaceful sanctuary of Swissôtel El Quseir.',
        },
      },
    },

    latestProjects: {
      eyebrow: 'RECENT PRODUCTIONS & RELEASES',
      heading: ['Our Latest', 'Project'],
      intro:
        'Explore our freshest commercial films, photography showcases, and multi-platform launches created for game-changing brands.',
      filterTabs: [
        { id: 'all', label: 'All Projects' },
        { id: 'real-estate', label: 'Real Estate' },
        { id: 'beauty', label: 'Beauty & Cosmetics' },
        { id: 'hospitality', label: 'Hospitality & Dining' },
      ],
      featuredFallback: 'FEATURED',
      productionScope: 'PRODUCTION SCOPE:',
      viewCaseStudy: 'View Case Study & Media',
      exploreMedia: 'Explore Media',
    },

    selectedProjects: {
      eyebrow: 'FEATURED WORK',
      heading: ['Selected', 'Projects'],
      intro: 'A selection of our latest work across different industries.',
      categories: [
        { id: 'all', label: 'All' },
        { id: 'real-estate', label: 'Real Estate' },
        { id: 'beauty', label: 'Cosmetics & Beauty' },
        { id: 'hospitality', label: 'Hospitality' },
      ],
      viewAll: 'VIEW ALL PROJECTS',
    },

    whatWeDo: {
      eyebrow: 'WHAT WE DO',
      heading: ['Creative Solutions', 'for Real Growth'],
      learnMore: 'LEARN MORE',
      closeDetails: 'Close Details',
      imageAlt: 'Camera Lens Optical System',
      services: {
        'service-social-media': {
          title: 'Social Media Management',
          description:
            'Strategic social media planning, high-engagement content calendars, community management, and paid performance ad campaigns that convert.',
          features: [
            'Content Strategy & Creation',
            'Audience Growth & Engagement',
            'Meta & TikTok Paid Campaigns',
            'Monthly Analytics & ROI Reports',
          ],
        },
        'service-media-production': {
          title: 'Media Production',
          description:
            'High-end cinema TV commercials, brand films, documentary productions, and viral video content that tell unforgettable visual stories.',
          features: [
            'TV & Commercial Films',
            'Cinematic Drone & Aerials',
            'Motion Graphics & 3D Visuals',
            'Sound Design & 4K Color Grading',
          ],
        },
        'service-photoshoot': {
          title: 'Photoshoot',
          description:
            'Premium editorial, studio, fashion, architectural, and commercial product photography executed with world-class lighting and styling.',
          features: [
            'High-End Commercial Product Stills',
            'Architectural & Interior Stills',
            'Fashion & Editorial Portraits',
            'Food & Luxury Hospitality Stills',
          ],
        },
        'service-creative-identity': {
          title: 'Creative Identity',
          description:
            'Distinctive brand architectures, logo typography systems, brand guidelines, and visual narratives designed to stand out in crowded markets.',
          features: [
            'Brand Identity & Logo Systems',
            'Art Direction & Moodboarding',
            'Packaging & Print Materials',
            'Brand Guidelines & Design Tokens',
          ],
        },
        'service-web-solutions': {
          title: 'Web Solutions',
          description:
            'Cutting-edge digital experiences, fast interactive websites, bespoke web applications, and custom business platforms engineered to scale.',
          features: [
            'Custom Web & App Development',
            'High-Converting Landing Pages',
            'Interactive UI/UX Design',
            'Enterprise Software & API Integrations',
          ],
        },
      },
    },

    products: {
      eyebrow: 'SABER GROUP TECH ECOSYSTEM',
      heading: ['Our', 'Products'],
      intro:
        'Proprietary software suites, business systems, and digital platforms built to power operations, hiring, hospitality, and healthcare.',
      demoCta: 'REQUEST DEMO / ACCESS',
      joinWaitlist: 'Join Waitlist',
      explore: 'Explore Platform',
      items: {
        'jahez-crm': {
          subtitle: 'Customer Relationship & Sales Automation Suite',
          badge: 'Available Now',
          description:
            'A comprehensive enterprise CRM engineered to streamline lead pipelines, multi-channel deals, sales team activities, and predictive revenue analytics.',
          features: [
            'Automated Lead Routing',
            'Sales Funnel Analytics',
            'Multi-tenant Support',
            'API & Webhooks',
          ],
        },
        'jahez-ats': {
          subtitle: 'Intelligent Applicant Tracking & Talent Acquisition',
          badge: 'Available Now',
          description:
            'End-to-end recruitment platform with candidate pipeline tracking, resume intelligence, automated interview scheduling, and team scoring boards.',
          features: [
            'Candidate Scoring',
            'Custom Hiring Pipelines',
            'Interview Scheduling',
            'Team Collaboration',
          ],
        },
        'easy-menu': {
          subtitle: 'Next-Gen Interactive Digital Dining & Ordering System',
          badge: 'Coming Soon',
          description:
            'Dynamic digital QR menus and tableside contactless ordering experience crafted for luxury hospitality venues, restaurants, and lounges.',
          features: [
            'Instant QR Menus',
            'Live Dish Availability',
            'Kitchen Order Sync',
            'Multilingual Support',
          ],
        },
        'medify': {
          subtitle: 'Smart Healthcare & Clinical Operations Management',
          badge: 'Coming Soon',
          description:
            'Unified clinical workflow, electronic medical appointments, patient engagement portal, and telemedicine platform for modern clinics and hospitals.',
          features: [
            'Patient Records (EMR)',
            'Smart Appointment Booking',
            'Billing & Insurance',
            'Telehealth Ready',
          ],
        },
      },
    },

    stats: {
      projects: 'Completed Projects',
      clients: 'Happy Clients',
      years: 'Years of Experience',
      passion: 'Passion for What We Do',
    },

    team: {
      eyebrow: 'THE MINDS BEHIND THE MAGIC',
      heading: ['Our Team', 'Work'],
      intro:
        'A collective of film directors, cinematographers, digital strategists, and software engineers united by craftsmanship and relentless vision.',
      joinCta: 'JOIN OUR TEAM',
      prevMember: 'Previous Team Member',
      nextMember: 'Next Team Member',
      goToSlide: 'Go to slide {n}',
      linkedinAria: 'LinkedIn Profile',
      instagramAria: 'Instagram Profile',
      bannerTitle: 'Think you belong here?',
      bannerText:
        'We are constantly seeking brilliant storytellers, editors, and engineers.',
      bannerCta: 'APPLY FOR OPEN ROLES',
      members: {
        'mostafa-saber': {
          name: 'Mostafa Saber',
          role: 'Founder & Executive Creative Director',
          category: 'Leadership & Directing',
          quote:
            '"Every single frame should either tell an unforgettable story or drive exponential business growth."',
        },
        'omar-farouk': {
          name: 'Omar Farouk',
          role: 'Head of Cinematography & Production',
          category: 'Film & Lighting',
          quote:
            '"Lighting is emotion. We paint with shadows and anamorphic glass to evoke true feeling."',
        },
        'nour-el-din': {
          name: 'Nour El-Din',
          role: 'Lead Art Director & Visual Identity',
          category: 'Branding & Concept Art',
          quote:
            '"Simplicity is the ultimate sophistication in brand language and visual resonance."',
        },
        'sarah-hassan': {
          name: 'Sarah Hassan',
          role: 'VP of Technology & Software Systems',
          category: 'Tech & Product',
          quote:
            '"Building robust platforms like Jahez CRM that scale seamlessly alongside client ambition."',
        },
        'karim-mansour': {
          name: 'Karim Mansour',
          role: 'Senior Post-Production & Colorist',
          category: 'Color & Sound Design',
          quote:
            '"Color grading turns raw footage into pure cinematic wonder with tone and rhythm."',
        },
        'layla-mahmoud': {
          name: 'Layla Mahmoud',
          role: 'Director of Performance & Growth Marketing',
          category: 'Growth & Analytics',
          quote:
            '"Creativity without distribution is a secret. We scale stories into verified conversions."',
        },
      },
    },

    joinTeam: {
      eyebrow: 'CAREERS',
      heading: 'Open Positions',
      generalApp: 'General Application',
      prev: 'Previous',
      next: 'Next',
      openNow: 'OPEN NOW',
      applyNow: 'Apply Now',
      jobs: {
        'job-cinematographer': {
          title: 'Senior Video Director & Cinematographer',
          department: 'Media Production',
          type: 'In-Studio',
          location: 'Cairo Studio',
          experience: '4+ Years',
        },
        'job-editor-colorist': {
          title: 'Senior Video Editor & Colorist',
          department: 'Post-Production',
          type: 'Hybrid',
          location: 'Cairo Studio',
          experience: '3+ Years',
        },
        'job-art-director': {
          title: 'Creative Art Director & 3D Artist',
          department: 'Brand & Visual Design',
          type: 'Hybrid',
          location: 'Cairo Studio',
          experience: '3+ Years',
        },
        'job-fullstack': {
          title: 'Full-Stack Software Engineer',
          department: 'Technology & SaaS',
          type: 'Remote',
          location: 'Egypt / MENA',
          experience: '3+ Years',
        },
        'job-media-buyer': {
          title: 'Performance Media Buyer',
          department: 'Growth Marketing',
          type: 'Remote / Cairo',
          location: 'Remote (Cairo)',
          experience: '2+ Years',
        },
        'job-social-strategist': {
          title: 'Social Media Strategist & Copywriter',
          department: 'Content & Strategy',
          type: 'In-Studio',
          location: 'Cairo Studio',
          experience: '2+ Years',
        },
      },
    },

    clients: {
      label: 'OUR CLIENTS',
      prevAria: 'Previous clients',
      nextAria: 'Next clients',
    },

    cta: {
      heading: ["Let's Create", 'Something Great Together'],
      text: "Have a project in mind? We'd love to hear about it.",
      button: 'GET IN TOUCH',
    },

    contact: {
      badge: "LET'S TALK",
      headingLines: ['Crafting Stories', 'That Redefine'],
      headingAccent: 'Industries.',
      intro:
        'From high-end commercial sets to full-scale software platforms, we engineer vision into commercial reality.',
      directEmail: 'Direct Email',
      hotline: 'Production Hotline',
      studioLocation: 'Studio Location',
      locationValue: 'Cairo, Egypt • Serving Regional & Global Brands',
      services: [
        { id: 'social-media', label: 'Social Media Management' },
        { id: 'media-production', label: 'Media Production' },
        { id: 'photoshoot', label: 'Photoshoot' },
        { id: 'creative-identity', label: 'Creative Identity' },
        { id: 'web-solutions', label: 'Web Solutions' },
      ],
      serviceLabel: 'Service Needed',
      formEyebrow: 'START A PROJECT',
      formTitle: 'Have A Project In Mind?',
      formSubtitle:
        'Tell us what you need and our team will get back to you within 24 hours.',
      name: 'Full Name *',
      namePlaceholder: 'Ahmed Saber',
      email: 'Email Address *',
      emailPlaceholder: 'name@company.com',
      phone: 'Phone / WhatsApp *',
      phonePlaceholder: '+20 100 000 0000',
      brief: 'Project Brief',
      briefPlaceholder: 'Brief description of your campaign, goals, or timeline...',
      submit: 'SEND INQUIRY',
      thanksText:
        'Your message has landed directly with our studio team. We will review your project details and get back to you shortly.',
      sendAnother: 'Send Another Message',
    },

    modals: {
      showreel: {
        barTitle: 'SABER GROUP • SHOWREEL 2024',
        sceneCounter: 'SCENE 0{n} / 0{total}',
        restart: 'Restart',
        scenes: {
          'showreel-valora': 'VALORA • Real Estate Architecture',
          'showreel-asia': 'ASIA COSMETICS • High Fashion Beauty',
          'showreel-seashell': 'SEASHELL • Red Sea Coastal Lifestyle',
          'showreel-swissotel': 'SWISSÔTEL • Luxury Resort Renovation',
          'showreel-studio': 'SABER CREATIVE • Studio Behind The Scenes',
        },
      },
      storyViewer: {
        spotlight: 'PROJECT SPOTLIGHT',
        shotOn: 'Shot on ARRI Alexa • 24fps',
        share: 'Share',
        shareAlert: 'Story link copied to clipboard!',
      },
      project: {
        caseStudy: 'CASE STUDY',
        client: 'Client',
        location: 'Location',
        year: 'Year',
        outcome: 'Outcome',
        outcomeValue: 'Verified Impact',
        overview: 'PROJECT OVERVIEW',
        deliverables: 'KEY DELIVERABLES',
        results: 'MEASURABLE RESULTS',
        ctaTitle: 'Inspired by this project?',
        ctaText:
          'Let us build an equivalent high-converting campaign for your brand.',
        ctaButton: 'INQUIRE ABOUT THIS',
      },
      contact: {
        barTitle: 'SABER GROUP • PROJECT CONSULTATION',
        thanksText:
          'Your project inquiry has been sent directly to the Saber Group creative directors. We will get back to you within 24 hours.',
        done: 'Done',
        title: "Let's Build Your Next Landmark",
        subtitle: 'Tell us about your brand vision, targets, and timeline.',
        servicesLabel: 'Services Needed',
        services: [
          { id: 'video', label: 'Video Production' },
          { id: 'photography', label: 'Photography' },
          { id: 'digital', label: 'Digital Marketing' },
          { id: 'branding', label: 'Branding & Design' },
          { id: 'web', label: 'Websites & Systems' },
        ],
        name: 'Your Name *',
        namePlaceholder: 'e.g. Mostafa Saber',
        email: 'Email Address *',
        phone: 'Phone Number',
        company: 'Company / Organization',
        companyPlaceholder: 'e.g. Valora Developments',
        budget: 'Estimated Budget',
        brief: 'Project Brief & Goals',
        briefPlaceholder:
          'Share details about your upcoming launch, timeline, and key requirements...',
        submit: 'SEND INQUIRY',
      },
    },

    shared: {
      thanksTitle: 'Thank You, {name}!',
      friend: 'Friend',
      projects: {
        'proj-valora': {
          category: 'Real Estate Development',
          industry: 'Real Estate',
          location: 'Tanta, Egypt',
          description:
            'A comprehensive brand identity, cinematic architectural commercial, and full marketing launch for Tanta’s premier luxury residential project.',
          metrics: [
            { label: 'Inbound Sales Inquiries', value: '+380%' },
            { label: 'Units Contracted at Launch', value: '92%' },
            { label: 'Social Video Views', value: '1.4M' },
          ],
          deliverables: [
            'Cinematic 4K Film',
            'Architectural Stills',
            'Social Strategy',
            'Brochures & Signage',
          ],
        },
        'proj-asia': {
          category: 'Brand Campaign',
          industry: 'Cosmetics & Beauty',
          location: 'Cairo, Egypt',
          description:
            'High-end beauty packaging art direction, studio macro product photography, and high-impact digital campaign across Egypt & the MENA region.',
          metrics: [
            { label: 'Engagement Multiplier', value: '4.8x' },
            { label: 'Direct E-Commerce Growth', value: '+210%' },
            { label: 'Campaign Impressions', value: '3.2M' },
          ],
          deliverables: [
            'Hero Commercial Film',
            'Editorial Studio Photos',
            'Social Media Identity',
            'Influencer Package',
          ],
        },
        'proj-seashell': {
          category: 'Restaurant & Beach',
          industry: 'Hospitality & Dining',
          location: 'Hurghada & North Coast, Egypt',
          description:
            'Capturing the golden sunset aesthetic, coastal culinary excellence, and vibrant beach club nightlife of Egypt’s premier seaside venue.',
          metrics: [
            { label: 'Weekend Table Bookings', value: '+165%' },
            { label: 'Organic Reel Views', value: '5.1M' },
            { label: 'Brand Recognition Lift', value: '+85%' },
          ],
          deliverables: [
            'Summer Video Series',
            'Food & Drink Photography',
            'Nightlife Coverage',
            'Creative Content Management',
          ],
        },
        'proj-swissotel': {
          category: 'Hotel Renovation',
          industry: 'Luxury Hospitality',
          location: 'El Quseir, Red Sea',
          description:
            'Rebranding and visual storytelling for the historic Red Sea coastal resort, featuring authentic Nubian architecture and private coral bays.',
          metrics: [
            { label: 'Direct Booking Revenue', value: '+42%' },
            { label: 'European Market Reach', value: '1.8M' },
            { label: 'Guest Sentiment Rating', value: '98%' },
          ],
          deliverables: [
            'Resort Cinematic Video',
            'Interior & Suite Stills',
            'Virtual 360 Tour',
            'Digital Media Campaigns',
          ],
        },
        'latest-valora-film': {
          category: 'Brand Film & Real Estate Launch',
          industry: 'Real Estate',
          location: 'Tanta, Egypt',
          role: 'Full Production, Drone Cinematography, Sound & Color',
          featuredBadge: 'PREMIERE',
          description:
            'A cinematic multi-channel campaign bringing to life Tanta’s most ambitious luxury community through emotive storytelling, anamorphic glass lighting, and high-conversion commercial media.',
          metrics: [
            { label: 'Qualified Investor Leads', value: '4,200+' },
            { label: 'Video Reach', value: '2.8M+' },
            { label: 'Launch Phase Sold', value: '96%' },
          ],
          deliverables: [
            'Cinematic Brand Film',
            'Social Micro-Cuts',
            'Architectural Stills',
            'Outdoor Visuals',
          ],
        },
        'latest-asia-luxe': {
          category: 'Commercial Film & High-End Product Stills',
          industry: 'Cosmetics & Beauty',
          location: 'Cairo & Dubai',
          role: 'Art Direction, Macro High-Speed Cinematography, Color Grading',
          featuredBadge: 'VIRAL CAMPAIGN',
          description:
            'High-speed Phantom camera captures, fluid dynamics, and refined product art direction highlighting pure botanical ingredients and clinical luxury skincare.',
          metrics: [
            { label: 'TikTok & Reels Views', value: '6.4M' },
            { label: 'Direct E-Com Sales', value: '+310%' },
            { label: 'Retailer Stockout', value: '14 Days' },
          ],
          deliverables: [
            '4K TV Commercial',
            'Macro Drop Stills',
            'Social Content Suite',
            'Influencer Box Kit',
          ],
        },
        'latest-seashell-summer': {
          category: 'Lifestyle Commercial & Sunset Series',
          industry: 'Hospitality & Dining',
          location: 'Hurghada & North Coast',
          role: 'Lifestyle Directing, Event Filmmaking, Social Media Takeover',
          featuredBadge: 'SUMMER SERIES',
          description:
            'Capturing the rhythm of golden-hour sunsets, Mediterranean culinary mastery, and exhilarating seaside nightlife with vibrant cinematic tone.',
          metrics: [
            { label: 'Summer Table Bookings', value: '+185%' },
            { label: 'Organic Sound Usage', value: '14K+ Reels' },
            { label: 'Brand Recognition', value: 'Top 3 Coastal' },
          ],
          deliverables: [
            'Series of 8 Commercials',
            'Culinary & Cocktail Stills',
            'Nightlife Documentaries',
          ],
        },
        'latest-swissotel-legacy': {
          category: 'Hospitality Film & Heritage Rebranding',
          industry: 'Luxury Hospitality',
          location: 'El Quseir, Red Sea',
          role: 'Heritage Storytelling, Resort Cinematography, Virtual 360',
          featuredBadge: 'LUXURY RETREAT',
          description:
            'A journey through historical Nubian craftsmanship, tranquil sea lagoons, and timeless Red Sea hospitality designed to captivate discerning European tourists.',
          metrics: [
            { label: 'Direct Bookings Lift', value: '+54%' },
            { label: 'International Reach', value: '3.1M' },
            { label: 'Guest Award 2024', value: 'Gold Winner' },
          ],
          deliverables: [
            'Resort Film',
            'Interior Architectural Set',
            '360 Interactive Virtual Experience',
          ],
        },
      },
    },
  },

  ar: {
    hero: {
      watchShowreel: 'شاهد عرض الأعمال',
      projectLinkTitle: 'اضغط لعرض تفاصيل المشروع',
      prevSlide: 'الشريحة السابقة',
      nextSlide: 'الشريحة التالية',
      soundOff: 'الصوت مُطفأ',
      soundOn: 'الصوت مُفعّل',
      muteTitle: 'كتم الفيديو',
      unmuteTitle: 'تشغيل صوت الفيديو',
      bullets: [
        'إنتاج فيديو',
        'تصوير فوتوغرافي',
        'تسويق رقمي',
        'بناء العلامات التجارية',
      ],
      slides: {
        'slide-01': {
          eyebrow: 'نحوّل الأفكار إلى',
          titleLines: ['نتائج', 'حقيقية'],
          projectCategory: 'مشروع عقاري',
          projectLocation: 'طنطا، مصر',
        },
        'slide-02': {
          eyebrow: 'أجواء ساحلة',
          titleLines: ['آسرة'],
          projectCategory: 'مطعم وشاطئ',
          projectLocation: 'الغردقة، مصر',
        },
        'slide-03': {
          eyebrow: 'الأناقة في',
          titleLines: ['كل تفصيلة'],
          projectCategory: 'حملة علامة تجارية',
          projectLocation: 'القاهرة، مصر',
        },
        'slide-04': {
          eyebrow: 'فخامة خالدة على',
          titleLines: ['البحر الأحمر'],
          projectCategory: 'تجديد فندق',
          projectLocation: 'القصير، مصر',
        },
      },
    },

    stories: {
      heading: ['قصصنا'],
      intro: 'لمحة سريعة عن أحدث مشاريعنا ووراء الكواليس.',
      viewAll: 'عرض كل القصص',
      scrollNext: 'عرض المزيد من القصص',
      items: {
        'story-bts': {
          subtitle: 'تصوير فيديو',
          category: 'إنتاج',
          description:
            'وراء الكواليس أثناء تجهيز كاميراتنا السينمائية الرئيسية، باستخدام العدسات الأناموريك ومعدات الحركة الديناميكية.',
        },
        'story-valora': {
          subtitle: 'طنطا',
          category: 'التطوير العقاري',
          description:
            'لقطات طيران بطائرات درون في الساعة الذهبية وتصوير سينمائي معماري لمشروع فالورا السكني الفاخر الجديد في طنطا.',
        },
        'story-seashell': {
          subtitle: 'الغردقة',
          category: 'الضيافة',
          description:
            'توثيق أجواء الشاطئ المشرقة ومياه البحر الأحمر الزرقاء ولحظات الطهي المميزة على الواجهة البحرية.',
        },
        'story-doctors': {
          subtitle: 'تسويق',
          category: 'الرعاية الصحية',
          description:
            'إنسانة الابتكار الطبي من خلال قصص وثائقية عن رعاية المرضى وقصص مميزة للأطباء.',
        },
        'story-cosmetics': {
          subtitle: 'حملة علامة تجارية',
          category: 'الجمال',
          description:
            'تصوير استوديو بمقربة وديناميكا قطرات بطيئة لسيرومات العناية بالبشرة والمستحضرات الفاخرة.',
        },
        'story-cubic': {
          subtitle: 'الإنشاءات',
          category: 'الهندسة',
          description:
            'توثيق حجم ودقة الهندسة البشرية في مشاريع كيوبك الهندسية.',
        },
        'story-swissotel': {
          subtitle: 'القصير',
          category: 'الضيافة',
          description:
            'تصوير معماري في الغسق يُبرز ملاذ سويس أوتيل القصير الهادئ.',
        },
      },
    },

    latestProjects: {
      eyebrow: 'أحدث الإنتاجات والإصدارات',
      heading: ['أحدث', 'مشاريعنا'],
      intro:
        'استكشف أحدث أفلامنا التجارية وعروض التصوير والإطلاقات متعددة المنصات التي أنشأناها للعلامات الطموحة.',
      filterTabs: [
        { id: 'all', label: 'كل المشاريع' },
        { id: 'real-estate', label: 'العقارات' },
        { id: 'beauty', label: 'الجمال ومستحضرات التجميل' },
        { id: 'hospitality', label: 'الضيافة والمطاعم' },
      ],
      featuredFallback: 'مميز',
      productionScope: 'نطاق الإنتاج:',
      viewCaseStudy: 'عرض دراسة الحالة والوسائط',
      exploreMedia: 'استكشف الوسائط',
    },

    selectedProjects: {
      eyebrow: 'أعمال مختارة',
      heading: ['مشاريع', 'مختارة'],
      intro: 'مختارات من أحدث أعمالنا في قطاعات مختلفة.',
      categories: [
        { id: 'all', label: 'الكل' },
        { id: 'real-estate', label: 'العقارات' },
        { id: 'beauty', label: 'مستحضرات التجميل والجمال' },
        { id: 'hospitality', label: 'الضيافة' },
      ],
      viewAll: 'عرض كل المشاريع',
    },

    whatWeDo: {
      eyebrow: 'ماذا نقدم',
      heading: ['حلول إبداعية', 'لنمو حقيقي'],
      learnMore: 'اعرف المزيد',
      closeDetails: 'إغلاق التفاصيل',
      imageAlt: 'نظام بصري لعدسة الكاميرا',
      services: {
        'service-social-media': {
          title: 'إدارة وسائل التواصل الاجتماعي',
          description:
            'تخطيط استراتيجي لوسائل التواصل الاجتماعي، وتقويمات محتوى عالية التفاعل، وإدارة مجتمعات، وحملات أداء مدفوعة تحقق نتائج.',
          features: [
            'استراتيجية وإنشاء المحتوى',
            'نمو الجمهور وتعزيز التفاعل',
            'حملات مدفوعة على Meta وTikTok',
            'تقارير تحليلية شهرية وعائد الاستثمار',
          ],
        },
        'service-media-production': {
          title: 'إنتاج الإعلام',
          description:
            'إعلانات تلفزيونية سينمائية عالية الجودة، وأفلام علامة تجارية، وإنتاجات وثائقية، ومحتوى فيديو فيروسي يروي قصصًا بصرية لا تُنسى.',
          features: [
            'أفلام تلفزيونية وإعلانات',
            'تصوير جوي سينمائي بالدرون',
            'موشن جرافيك ورسوم ثلاثية الأبعاد',
            'تصميم صوتي وتصحيح ألوان 4K',
          ],
        },
        'service-photoshoot': {
          title: 'تصوير فوتوغرافي',
          description:
            'تصوير تحريري واستوديو وأزياء وعماري وتجاري للممنتجات بجودة عالمية في الإضاءة والتنسيق.',
          features: [
            'صور منتجات تجارية فاخرة',
            'صور معمارية وداخلية',
            'بورتريهات أزياء وتحريرية',
            'صور طعام وضيافة فاخرة',
          ],
        },
        'service-creative-identity': {
          title: 'هوية إبداعية',
          description:
            'هويات علامة تجارية مميزة، وأنظمة طباعة للشعارات، وإرشادات علامة تجارية، وسرد بصري مصمم للتمييز في أسواق مزدحمة.',
          features: [
            'هوية العلامة وأنظمة الشعار',
            'إخراج فني ولوحات مزاجية',
            'مواد تغليف ومطبوعات',
            'إرشادات العلامة ورموز التصميم',
          ],
        },
        'service-web-solutions': {
          title: 'حلول ويب',
          description:
            'تجارب رقمية متطورة، ومواقع تفاعلية سريعة، وتطبيقات ويب مخصصة، ومنصات أعمال مصممة للتوسع.',
          features: [
            'تطوير مواقع وتطبيقات مخصصة',
            'صفحات هبوط عالية التحويل',
            'تصميم تفاعلي لتجربة المستخدم',
            'تكاملات برمجية وواجهات برمجية للمؤسسات',
          ],
        },
      },
    },

    products: {
      eyebrow: 'منظومة صابر جروب التقنية',
      heading: ['منتجاتنا'],
      intro:
        'حزم برمجيات خاصة وأنظمة أعمال ومنصات رقمية مصممة لتشغيل العمليات والتوظيف والضيافة والرعاية الصحية.',
      demoCta: 'اطلب عرضًا تجريبيًا / وصولًا',
      joinWaitlist: 'انضم لقائمة الانتظار',
      explore: 'استكشف المنصة',
      items: {
        'jahez-crm': {
          subtitle: 'نظام إدارة علاقات العملاء وأتمتة المبيعات',
          badge: 'متاح الآن',
          description:
            'نظام CRM مؤسسي متكامل مصمم لتبسيط مسارات العملاء المحتملين وصفقات القنوات المتعددة وأنشطة فريق المبيعات وتحليلات الإيرادات التنبؤية.',
          features: [
            'توجيه العملاء المحتملين تلقائيًا',
            'تحليلات قمع المبيعات',
            'دعم متعدد المستأجرين',
            'واجهات برمجية وWebhooks',
          ],
        },
        'jahez-ats': {
          subtitle: 'نظام ذكي لتتبع المتقدمين واكتساب المواهب',
          badge: 'متاح الآن',
          description:
            'منصة توظيف متكاملة تتبع مسارات المرشحين، وذكاء السير الذاتية، وجدولة المقابلات تلقائيًا، ولوحات تقييم الفرق.',
          features: [
            'تقييم المرشحين',
            'مسارات توظيف مخصصة',
            'جدولة المقابلات',
            'تعاون الفريق',
          ],
        },
        'easy-menu': {
          subtitle: 'نظام طعام وطلب تفاعلي من الجيل الجديد',
          badge: 'قريبًا',
          description:
            'قوائم طعام QR ديناميكية وتجربة طلب لاتلامسية على الطاولة مصممة لمنشآت الضيافة الفاخرة والمطاعم والصالات.',
          features: [
            'قوائم QR فورية',
            'توفر الأطباق لحظيًا',
            'مزامنة طلبات المطبخ',
            'دعم متعدد اللغات',
          ],
        },
        'medify': {
          subtitle: 'إدارة ذكية للرعاية الصحية والعمليات السريرية',
          badge: 'قريبًا',
          description:
            'سير عمل سريري موحد، ومواعيد طبية إلكترونية، وبوابة مشاركة المرضى، ومنصة طب عن بُعد للعيادات والمستشفيات الحديثة.',
          features: [
            'سجلات المرضى (EMR)',
            'حجز مواعيد ذكي',
            'فوترة وتأمين',
            'جاهزية للطب عن بُعد',
          ],
        },
      },
    },

    stats: {
      projects: 'مشروع منجز',
      clients: 'عميل سعيد',
      years: 'سنوات من الخبرة',
      passion: 'شغف بما نقوم به',
    },

    team: {
      eyebrow: 'العقول وراء الإبداع',
      heading: ['فريقنا', 'في العمل'],
      intro:
        'مجموعة من مخرجي الأفلام والمصورين السينمائيين والاستراتيجيين الرقميين ومهندسي البرمجيات يجمعهم الإتقان والرؤية الدؤوبة.',
      joinCta: 'انضم إلى فريقنا',
      prevMember: 'عضو الفريق السابق',
      nextMember: 'عضو الفريق التالي',
      goToSlide: 'اذهب إلى الشريحة {n}',
      linkedinAria: 'الملف الشخصي على LinkedIn',
      instagramAria: 'الملف الشخصي على Instagram',
      bannerTitle: 'تشعر أنك تنتمي إلى هنا؟',
      bannerText:
        'نبحث باستمرار عن سردين قصص مبدعين، ومونتيرين، ومهندسين متميزين.',
      bannerCta: 'قدّم لوظائف شاغرة',
      members: {
        'mostafa-saber': {
          name: 'مصطفى صابر',
          role: 'المؤسس والرئيس التنفيذي للإبداع',
          category: 'القيادة والإخراج',
          quote:
            '"يجب أن تحكي كل لقطة قصة لا تُنسى أو تدفع نمو الأعمال بشكل متسارع."',
        },
        'omar-farouk': {
          name: 'عمر فاروق',
          role: 'رئيس قسم التصوير السينمائي والإنتاج',
          category: 'الفيلم والإضاءة',
          quote:
            '"الإضاءة هي المشاعر. نرسم بالظلال والعدسات الأناموريك لإيصال مشاعر حقيقية."',
        },
        'nour-el-din': {
          name: 'نور الدين',
          role: 'مدير فني أول والهوية البصرية',
          category: 'العلامة التجارية والكونسبت آرت',
          quote:
            '"البساطة هي أرقى درجات الإتقان في لغة العلامات التجارية والتناغم البصري."',
        },
        'sarah-hassan': {
          name: 'سارة حسن',
          role: 'نائب رئيس التقنية وأنظمة البرمجيات',
          category: 'التقنية والمنتج',
          quote:
            '"نبني منصات قوية مثل Jahez CRM تتوسع بسلاسة مع طموح عملائنا."',
        },
        'karim-mansour': {
          name: 'كريم منصور',
          role: 'مدير ما بعد الإنتاج الأقدم ومونتير ألوان',
          category: 'الألوان وتصميم الصوت',
          quote:
            '"تصحيح الألوان يحوّل اللقطات الخام إلى عجابة سينمائية خالصة بإيقاعها ونبرتها."',
        },
        'layla-mahmoud': {
          name: 'ليلى محمود',
          role: 'مديرة الأداء وتسويق النمو',
          category: 'النمو والتحليلات',
          quote:
            '"الإبداع بلا توزيع هو سر مكتوم. نحوّل القصص إلى نتائج موثّقة."',
        },
      },
    },

    joinTeam: {
      eyebrow: 'الوظائف',
      heading: 'وظائف شاغرة',
      generalApp: 'طلب توظيف عام',
      prev: 'السابق',
      next: 'التالي',
      openNow: 'متاح الآن',
      applyNow: 'قدّم الآن',
      jobs: {
        'job-cinematographer': {
          title: 'مخرج فيديو أول وسينماتوغرافر',
          department: 'إنتاج الإعلام',
          type: 'من الاستوديو',
          location: 'استوديو القاهرة',
          experience: '+4 سنوات',
        },
        'job-editor-colorist': {
          title: 'مونتير فيديو أول ومونتير ألوان',
          department: 'ما بعد الإنتاج',
          type: 'هايبرد',
          location: 'استوديو القاهرة',
          experience: '+3 سنوات',
        },
        'job-art-director': {
          title: 'مدير فني إبداعي وفنان 3D',
          department: 'تصميم العلامات والهوية',
          type: 'هايبرد',
          location: 'استوديو القاهرة',
          experience: '+3 سنوات',
        },
        'job-fullstack': {
          title: 'مهندس برمجيات Full-Stack',
          department: 'التقنية وبرمجيات SaaS',
          type: 'عن بعد',
          location: 'مصر / الشرق الأوسط وشمال أفريقيا',
          experience: '+3 سنوات',
        },
        'job-media-buyer': {
          title: 'مشتري إعلانات أداء',
          department: 'تسويق النمو',
          type: 'عن بعد / القاهرة',
          location: 'عن بعد (القاهرة)',
          experience: '+2 سنوات',
        },
        'job-social-strategist': {
          title: 'استراتيجي سوشيال ميديا وكاتب إعلانات',
          department: 'المحتوى والاستراتيجية',
          type: 'من الاستوديو',
          location: 'استوديو القاهرة',
          experience: '+2 سنوات',
        },
      },
    },

    clients: {
      label: 'عملاؤنا',
      prevAria: 'العملاء السابقون',
      nextAria: 'العملاء التاليون',
    },

    cta: {
      heading: ['لنصنع معًا', 'شيئًا عظيمًا'],
      text: 'لديك مشروع في ذهنك؟ يسعدنا أن نسمعه.',
      button: 'تواصل معنا',
    },

    contact: {
      badge: 'لنتحدث',
      headingLines: ['نصنع قصصًا', 'تُعيد تعريف'],
      headingAccent: 'الصناعات.',
      intro:
        'من مجموعات الإعلانات الفاخرة إلى منصات برمجية متكاملة، نحوّل الرؤى إلى واقع تجاري.',
      directEmail: 'البريد الإلكتروني المباشر',
      hotline: 'خط الإنتاج الساخن',
      studioLocation: 'موقع الاستوديو',
      locationValue: 'القاهرة، مصر • نخدم علامات إقليمية وعالمية',
      services: [
        { id: 'social-media', label: 'إدارة وسائل التواصل الاجتماعي' },
        { id: 'media-production', label: 'إنتاج الإعلام' },
        { id: 'photoshoot', label: 'تصوير فوتوغرافي' },
        { id: 'creative-identity', label: 'هوية إبداعية' },
        { id: 'web-solutions', label: 'حلول ويب' },
      ],
      serviceLabel: 'الخدمة المطلوبة',
      formEyebrow: 'ابدأ مشروعك',
      formTitle: 'لديك مشروع في ذهنك؟',
      formSubtitle:
        'أخبرنا بما تحتاجه وسيتواصل فريقنا معك خلال 24 ساعة.',
      name: 'الاسم الكامل *',
      namePlaceholder: 'أحمد صابر',
      email: 'البريد الإلكتروني *',
      emailPlaceholder: 'name@company.com',
      phone: 'الهاتف / واتساب *',
      phonePlaceholder: '+20 100 000 0000',
      brief: 'نبذة عن المشروع',
      briefPlaceholder: 'وصف موجز لحملتك وأهدافك والجدول الزمني...',
      submit: 'إرسال الاستفسار',
      thanksText:
        'وصلت رسالتك مباشرة إلى فريق الاستوديو. سنراجع تفاصيل مشروعك ونعود إليك قريبًا.',
      sendAnother: 'إرسال رسالة أخرى',
    },

    modals: {
      showreel: {
        barTitle: 'صابر جروب • عرض الأعمال 2024',
        sceneCounter: 'المشهد 0{n} / 0{total}',
        restart: 'إعادة التشغيل',
        scenes: {
          'showreel-valora': 'VALORA • عمارة عقارية',
          'showreel-asia': 'ASIA COSMETICS • جمال وأناقة عصرية',
          'showreel-seashell': 'SEASHELL • نمط حياة ساحلي على البحر الأحمر',
          'showreel-swissotel': 'SWISSÔTEL • تجديد منتجع فاخر',
          'showreel-studio': 'SABER CREATIVE • وراء كواليس الاستوديو',
        },
      },
      storyViewer: {
        spotlight: 'قصة مشروع',
        shotOn: 'تم التصوير بـ ARRI Alexa • 24fps',
        share: 'مشاركة',
        shareAlert: 'تم نسخ رابط القصة!',
      },
      project: {
        caseStudy: 'دراسة حالة',
        client: 'العميل',
        location: 'الموقع',
        year: 'السنة',
        outcome: 'النتيجة',
        outcomeValue: 'أثر موثّق',
        overview: 'نظرة عامة على المشروع',
        deliverables: 'المخرجات الرئيسية',
        results: 'نتائج قابلة للقياس',
        ctaTitle: 'ألهمك هذا المشروع؟',
        ctaText: 'دعنا نبني حملة مماثلة عالية التحويل لعلامتك التجارية.',
        ctaButton: 'استفسر عن هذا المشروع',
      },
      contact: {
        barTitle: 'صابر جروب • استشارة مشروع',
        thanksText:
          'تم إرسال طلب مشروعك مباشرة إلى المديرين الإبداعيين في صابر جروب. سنعود إليك خلال 24 ساعة.',
        done: 'تم',
        title: 'لنبنِ معلمك القادم',
        subtitle: 'أخبرنا عن رؤيتك لعلامتك التجارية وأهدافك والجدول الزمني.',
        servicesLabel: 'الخدمات المطلوبة',
        services: [
          { id: 'video', label: 'إنتاج فيديو' },
          { id: 'photography', label: 'تصوير فوتوغرافي' },
          { id: 'digital', label: 'تسويق رقمي' },
          { id: 'branding', label: 'العلامة التجارية والتصميم' },
          { id: 'web', label: 'المواقع والأنظمة' },
        ],
        name: 'اسمك *',
        namePlaceholder: 'مثال: مصطفى صابر',
        email: 'البريد الإلكتروني *',
        phone: 'رقم الهاتف',
        company: 'الشركة / المؤسسة',
        companyPlaceholder: 'مثال: Valora Developments',
        budget: 'الميزانية التقديرية',
        brief: 'نبذة المشروع وأهدافه',
        briefPlaceholder:
          'شاركنا تفاصيل الإطلاق القادم والجدول الزمني والمتطلبات الأساسية...',
        submit: 'إرسال الاستفسار',
      },
    },

    shared: {
      thanksTitle: 'شكرًا لك، {name}!',
      friend: 'صديقي',
      projects: {
        'proj-valora': {
          category: 'التطوير العقاري',
          industry: 'التطوير العقاري',
          location: 'طنطا، مصر',
          description:
            'هوية علامة تجارية شاملة، وإعلان معماري سينمائي، وإطلاق تسويقي كامل لمشروع فالورا السكني الفاخر الأول بطنطا.',
          metrics: [
            { label: 'استفسارات المبيعات الواردة', value: '+380%' },
            { label: 'الوحدات المتعاقد عليها عند الإطلاق', value: '92%' },
            { label: 'مشاهدات الفيديو الاجتماعية', value: '1.4M' },
          ],
          deliverables: [
            'فيلم سينمائي 4K',
            'صور معمارية',
            'استراتيجية التواصل الاجتماعي',
            'الكتيبات واللافتات',
          ],
        },
        'proj-asia': {
          category: 'حملة علامة تجارية',
          industry: 'مستحضرات التجميل والجمال',
          location: 'القاهرة، مصر',
          description:
            'إخراج فني لتغليف مستحضرات تجميل فاخرة، وتصوير منتجات بمقربة في الاستوديو، وحملة رقمية عالية الأثر في مصر والمنطقة.',
          metrics: [
            { label: 'معامل التفاعل', value: '4.8x' },
            { label: 'نمو المبيعات المباشرة', value: '+210%' },
            { label: 'ظهور الحملة', value: '3.2M' },
          ],
          deliverables: [
            'فيلم إعلاني رئيسي',
            'صور استوديو تحريرية',
            'هوية وسائل التواصل',
            'حزمة مؤثرين',
          ],
        },
        'proj-seashell': {
          category: 'مطاعم وشواطئ',
          industry: 'الضيافة والمطاعم',
          location: 'الغردقة والساحل الشمالي، مصر',
          description:
            'توثيق جمال الغروب الذهبي والتميّز الطهي الساحلي وأجواء الحياة الليلية النابضة في أبرز وجهة بحرية في مصر.',
          metrics: [
            { label: 'حجوزات طاولات نهاية الأسبوع', value: '+165%' },
            { label: 'مشاهدات الريلز العضوية', value: '5.1M' },
            { label: 'ارتفاع الوعي بالعلامة', value: '+85%' },
          ],
          deliverables: [
            'سلسلة فيديوهات صيفية',
            'تصوير الأطعمة والمشروبات',
            'تغطية الحياة الليلية',
            'إدارة محتوى إبداعي',
          ],
        },
        'proj-swissotel': {
          category: 'تجديد فندق',
          industry: 'الضيافة الفاخرة',
          location: 'القصير، البحر الأحمر',
          description:
            'إعادة تموضع وسرد بصري لمنتجع البحر الأحمر التاريخي، بعمارة نوبية أصيلة وخليج شعاب خاصة.',
          metrics: [
            { label: 'إيرادات الحجز المباشر', value: '+42%' },
            { label: 'الوصول للسوق الأوروبي', value: '1.8M' },
            { label: 'تقييم رضا النزلاء', value: '98%' },
          ],
          deliverables: [
            'فيديو سينمائي للمنتجع',
            'صور داخلية وأجنحة',
            'جولة افتراضية 360',
            'حملات إعلامية رقمية',
          ],
        },
        'latest-valora-film': {
          category: 'فيلم علامة تجارية وإطلاق عقاري',
          industry: 'التطوير العقاري',
          location: 'طنطا، مصر',
          role: 'إنتاج متكامل، تصوير جوي بالدرون، صوت وألوان',
          featuredBadge: 'العرض الأول',
          description:
            'حملة سينمائية متعددة القنوات تُنبض الحياة في أجرأ مشروع سكني فاخر بطنطا، من خلال سرد قصصي مؤثر وإضاءة عدسات أناموريكية وإعلانات تجارية عالية التحويل.',
          metrics: [
            { label: 'عملاء مؤهلون محتملون', value: '4,200+' },
            { label: 'وصول الفيديو', value: '2.8M+' },
            { label: 'نسبة البيع في مرحلة الإطلاق', value: '96%' },
          ],
          deliverables: [
            'فيلم علامة سينمائي',
            'لقطات سوشيال ميكرو',
            'صور معمارية',
            'إعلانات خارجية',
          ],
        },
        'latest-asia-luxe': {
          category: 'فيلم تجاري وصور منتجات فاخرة',
          industry: 'مستحضرات التجميل والجمال',
          location: 'القاهرة ودبي',
          role: 'إخراج فني، تصوير ماكرو عالي السرعة، تصحيح ألوان',
          featuredBadge: 'حملة فيروسية',
          description:
            'لقطات بسرعة فائقة بكاميرا Phantom، وفيزياء مواد، وإخراج فني راقٍ يُبرز المكونات النباتية النقية وعناية فاخرة بالبشرة.',
          metrics: [
            { label: 'مشاهدات تيك توك وريلز', value: '6.4M' },
            { label: 'مبيعات المتجر الإلكتروني المباشرة', value: '+310%' },
            { label: 'نفاد مخزون التجزئة', value: '14 يومًا' },
          ],
          deliverables: [
            'إعلان تلفزيوني 4K',
            'صور ماكرو للقطرات',
            'حزمة محتوى اجتماعي',
            'علبة مؤثرين',
          ],
        },
        'latest-seashell-summer': {
          category: 'إعلان نمط حياة وسلسلة غروب',
          industry: 'الضيافة والمطاعم',
          location: 'الغردقة والساحل الشمالي',
          role: 'إخراج نمط حياة، تصوير فعاليات، إدارة محتوى السوشيال ميديا',
          featuredBadge: 'سلسلة الصيف',
          description:
            'توثيق إيقاع غروب الساعة الذهبية، والتميّز المتوسطي في الطهي، وأجواء الحياة الليلية النابضة على الواجهة البحرية بأسلوب سينمائي حيوي.',
          metrics: [
            { label: 'حجوزات الطاولات الصيفية', value: '+185%' },
            { label: 'استخدام الصوت العضوي', value: '14 ألف+ ريلز' },
            { label: 'الوعي بالعلامة', value: 'ضمن أول 3 ساحلين' },
          ],
          deliverables: [
            'سلسلة من 8 إعلانات',
            'صور طعام ومشروبات',
            'تغطية الحياة الليلية',
          ],
        },
        'latest-swissotel-legacy': {
          category: 'فيلم ضيافة وإعادة تموضع تراثي',
          industry: 'الضيافة الفاخرة',
          location: 'القصير، البحر الأحمر',
          role: 'سرد تراثي، تصوير سينمائي للمنتجع، جولة افتراضية 360',
          featuredBadge: 'منتجع فاخر',
          description:
            'رحلة عبر الحرفية النوبية التاريخية، والبحيرات البحرية الهادئة، والضيافة الخالدة على البحر الأحمر، مصممة لإبهار السياح الأوروبيين المتميزين.',
          metrics: [
            { label: 'ارتفاع الحجوزات المباشرة', value: '+54%' },
            { label: 'الوصول الدولي', value: '3.1M' },
            { label: 'جائزة نزلاء 2024', value: 'الفائزة بالذهبية' },
          ],
          deliverables: [
            'فيلم المنتجع',
            'مجموعة تصوير داخلية',
            'تجربة تفاعلية 360',
          ],
        },
      },
    },
  },
};

export default homeContent;
