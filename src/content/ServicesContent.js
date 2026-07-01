// Content for the Services page (/services).
// Tier data below reflects real product gating decisions as of this draft.
// Pricing itself is still undecided -- only feature gating is final.

const servicesContent = {
  en: {
    hero: {
      eyebrow: 'Software we built and run ourselves',
      title:
        'Two tools we use to run our own business — now yours to run yours',
      subtitle:
        "ATS handles hiring. CRM handles sales. We built both because the tools on the market either cost too much or didn't speak Arabic properly. Pick one below, see what it actually does, and ask for a quote.",
    },
    tabs: {
      ats: 'ATS — Hiring',
      crm: 'CRM — Sales',
    },
    products: {
      ats: {
        name: 'ATS',
        tagline: 'Applicant Tracking System',
        description:
          'Every job posting, application, interview, and offer letter in one place. Built after watching a hiring manager track candidates across four WhatsApp groups and a shared spreadsheet — we figured there was a better way, so we built it for ourselves first, then for clients.',
        trace: {
          label: 'A candidate moving through the system',
          lines: [
            'candidate applied → Frontend Developer, custom fields filled',
            'HR moved candidate → Interview',
            'interview scheduled → Thu 11:00 AM, scored questions attached',
            'interview completed → score 82/100, above threshold',
            'offer generated from template → sent by email, opened in 4 min',
            'contract generated → downloaded as PDF, candidate marked Hired',
          ],
        },
        capabilities: [
          'Post a job with whatever custom fields the role needs, and get a link to share anywhere — LinkedIn, Facebook, any platform',
          'Filter applicants with deep search across every field, not just name and status',
          "Move a candidate's status yourself, with a reason attached, so the history explains itself later",
          'Choose per company whether applicants get an automatic confirmation email on submission',
          'Email candidates from inside the system and see exactly what happened — sent, delivered, opened, clicked, bounced',
          'See a full history per applicant: every status change, offer, contract, and email in one timeline',
          'Build offers and contracts from templates instead of writing them from scratch each time, and send offers by email or download contracts as PDF',
          "Schedule interviews with scored questions, and set a threshold so it's clear who passed",
          'Assign a user to specific companies and departments, so they only see applicants for the jobs that are theirs to see',
          'Relabel the sidebar per company so your team sees the statuses and jobs that matter to them, not a generic menu',
        ],
        notes:
          'Email sending is capped at 100 per day across the system; teams that need more can talk to us about a higher limit.',
      },
      crm: {
        name: 'CRM',
        tagline: 'Customer Relationship Management',
        description:
          "Built for sales teams where the manager's real question every Monday is \"who's actually responding fast and who's sitting on leads.\" Less about contact storage, more about seeing where deals stall and who's carrying the team.",
        trace: {
          label: 'A lead moving through the pipeline',
          lines: [
            'lead created → from website contact form',
            'assigned → Sales rep: Mariam (round robin)',
            'first response time → 14 minutes',
            'reminder set → follow up Thursday 10:00 AM',
            'stage moved → Qualified → Proposal Sent',
            'manager commented → marked done by rep',
          ],
        },
        capabilities: [
          'Track every lead from first contact to closed deal, with a full history of stage changes and messages',
          "See first-response time per rep, not just team average — find out who's actually fast",
          "Set a reminder on any lead and get notified when it's due, so nothing sits untouched",
          "Get notified the moment a lead is assigned to you, marked done, or commented on — only what's relevant to your role",
          "Let a manager review a rep's notes and leave comments the rep can mark as done",
          'Control which lead fields are required, which are optional, and what status choices exist — per company',
          'Give each rep and manager a personal performance dashboard on login',
          'Work entirely in Arabic or English, switchable per user',
        ],
      },
    },
    tiersSection: {
      title: 'Plans',
      subtitle:
        "How we tier each product, based on team size and how much automation you need. Exact pricing is set per client for now — tell us your team size and we'll tell you which one fits.",
      ctaLabel: 'Proceed',
    },
    quoteForm: {
      title: 'Get a quote',
      subtitle:
        "Tell us a bit about your team and which product you need. We'll follow up with sizing and a price — no payment on this page.",
      fields: {
        name: 'Your name',
        company: 'Company name',
        phone: 'Phone / WhatsApp',
        product: 'Which product?',
        tier: 'Which plan looks closest?',
        teamSize: 'Team size',
        notes: 'Anything else we should know?',
      },
      productOptions: [
        { value: 'ats', label: 'ATS — Hiring' },
        { value: 'crm', label: 'CRM — Sales' },
        { value: 'both', label: 'Both' },
      ],
      submit: 'Send request',
      sending: 'Sending…',
      successTitle: 'Got it.',
      successMessage:
        "We'll reach out on the number you gave us, usually within a business day, to size the plan and send a quote.",
      errorMessage:
        'Something went wrong sending this. Try again, or just WhatsApp us at 01080099757.',
      privacyNote: 'No payment happens here — this just gets a quote started.',
    },
  },
  ar: {
    hero: {
      eyebrow: 'برامج بنيناها وبنستخدمها بنفسنا',
      title: 'أداتين بنشغل بيهم شركتنا — دلوقتي ممكن تشغل بيهم شركتك',
      subtitle:
        'ATS لإدارة التوظيف، و CRM لإدارة المبيعات. بنينا الاتنين بعد ما لاحظنا إن الأدوات الموجودة في السوق غالية أو مش بتدعم العربي كويس. اختار واحدة تحت، شوف هي بتعمل إيه بالظبط، واطلب عرض سعر.',
    },
    tabs: {
      ats: 'ATS — التوظيف',
      crm: 'CRM — المبيعات',
    },
    products: {
      ats: {
        name: 'ATS',
        tagline: 'نظام تتبع المتقدمين للوظائف',
        description:
          'كل إعلان وظيفة، وطلب تقديم، ومقابلة، وخطاب عرض في مكان واحد. بنيناه بعد ما شفنا مسؤول توظيف بيتابع المتقدمين على أربع جروبات واتساب وشيت إكسل مشترك — حسينا إن لازم يكون فيه طريقة أحسن.',
        trace: {
          label: 'متقدم بيتحرك في النظام',
          lines: [
            'تقديم جديد ← مطور Frontend، الحقول المخصصة متعبية',
            'انتقل إلى ← مقابلة',
            'تحديد مقابلة ← الخميس 11:00 ص، أسئلة مُقيّمة مرفقة',
            'انتهت المقابلة ← النتيجة 82/100، فوق الحد المطلوب',
            'إنشاء عرض من قالب ← تم الإرسال بالإيميل، تم فتحه بعد 4 دقايق',
            'إنشاء عقد ← تم تحميله PDF، المتقدم اتعلّم Hired',
          ],
        },
        capabilities: [
          'نشر وظيفة بالحقول المخصصة اللي تحتاجها، والحصول على لينك تنشره في أي مكان — LinkedIn أو Facebook أو غيره',
          'فلترة المتقدمين بحث عميق على كل الحقول، مش بس الاسم والحالة',
          'تغيير حالة المتقدم بنفسك، مع سبب مرفق، عشان السجل يوضح نفسه بعدين',
          'تحديد لكل شركة هل تبعت إيميل تأكيد تلقائي عند التقديم أو لا',
          'إرسال إيميلات للمتقدمين من داخل النظام ومعرفة اللي حصل بالظبط — تم الإرسال، التسليم، الفتح، الضغط، أو الارتداد',
          'سجل كامل لكل متقدم: كل تغيير حالة، وعرض، وعقد، وإيميل في تايملاين واحد',
          'بناء عروض وعقود من قوالب جاهزة بدل كتابتها من الصفر كل مرة، وإرسال العروض بالإيميل أو تحميل العقود PDF',
          'تحديد مقابلات بأسئلة مُقيّمة، وتحديد حد أدنى يوضح مين عدى',
          'تخصيص مستخدم لشركات وأقسام معينة، عشان يشوف بس المتقدمين للوظايف اللي تخصه',
          'تغيير تسميات الشريط الجانبي لكل شركة عشان فريقك يشوف الحالات والوظايف اللي تهمه، مش قايمة عامة',
        ],
        notes:
          'إرسال الإيميلات محدد بـ 100 إيميل يوميًا على مستوى النظام؛ الفرق اللي محتاجة أكتر تتواصل معانا لرفع الحد.',
      },
      crm: {
        name: 'CRM',
        tagline: 'إدارة علاقات العملاء',
        description:
          'بنيناه لفرق المبيعات اللي مديرها بيسأل كل يوم اتنين سؤال واحد: مين فعلاً بيرد بسرعة ومين سايب العملاء المحتملين بلا رد. مش مجرد تخزين بيانات تواصل، لكن معرفة فين بالظبط الصفقات بتقف ومين شغال جد.',
        trace: {
          label: 'عميل محتمل بيتحرك في القمع البيعي',
          lines: [
            'عميل محتمل جديد ← من فورم تواصل الموقع',
            'تم التعيين ← مندوب مبيعات: مريم (round robin)',
            'وقت أول رد ← 14 دقيقة',
            'تذكير محدد ← متابعة الخميس 10:00 ص',
            'انتقل إلى ← مؤهل ← تم إرسال عرض سعر',
            'تعليق المدير ← تم وضعه كمنتهي من المندوب',
          ],
        },
        capabilities: [
          'تتبع كل عميل محتمل من أول تواصل لحد إغلاق الصفقة، مع سجل كامل لكل تحرك ورسالة',
          'معرفة وقت أول رد لكل مندوب، مش متوسط الفريق فقط — اعرف مين فعلاً سريع',
          'تحديد تذكير على أي عميل محتمل والتنبيه عند حلول وقته، عشان مفيش حد يتسيب',
          'تنبيه فوري لحظة تعيين عميل محتمل ليك، أو وضع علامة منتهي، أو إضافة تعليق — بس اللي يخصك',
          'مراجعة المدير لملاحظات المندوب وكتابة تعليقات يقدر المندوب يعلّمها كمنتهية',
          'تحديد الحقول المطلوبة والاختيارية وخيارات الحالة لكل شركة',
          'لوحة تحكم أداء شخصية لكل مندوب ومدير من أول ما يسجل دخول',
          'العمل بالكامل بالعربي أو الإنجليزي، قابل للتبديل لكل مستخدم',
        ],
      },
    },
    tiersSection: {
      title: 'الباقات',
      subtitle:
        'طريقة تقسيم الباقات لكل منتج، حسب حجم الفريق ومستوى الأتمتة المطلوب. الأسعار الدقيقة بتتحدد حسب كل عميل دلوقتي — قولنا حجم فريقك وهنقولك أنسب باقة.',
      ctaLabel: 'استمرار',
    },
    quoteForm: {
      title: 'اطلب عرض سعر',
      subtitle:
        'قولنا عن فريقك وأنت محتاج أي منتج. هنتواصل معاك بعد كده بالتفاصيل والسعر — مفيش دفع في الصفحة دي.',
      fields: {
        name: 'اسمك',
        company: 'اسم الشركة',
        phone: 'تليفون / واتساب',
        product: 'أي منتج؟',
        tier: 'أقرب باقة ليك؟',
        teamSize: 'حجم الفريق',
        notes: 'حاجة تانية تحب تقولها؟',
      },
      productOptions: [
        { value: 'ats', label: 'ATS — التوظيف' },
        { value: 'crm', label: 'CRM — المبيعات' },
        { value: 'both', label: 'الاتنين' },
      ],
      submit: 'إرسال الطلب',
      sending: 'جاري الإرسال…',
      successTitle: 'تم.',
      successMessage:
        'هنتواصل معاك على الرقم اللي كتبته، عادةً خلال يوم عمل، لتحديد التفاصيل والسعر.',
      errorMessage:
        'حصل خطأ في الإرسال. جرب تاني، أو راسلنا على واتساب 01080099757.',
      privacyNote: 'مفيش دفع هنا — ده مجرد بداية لطلب عرض السعر.',
    },
  },
};

// Real, reasoned tier gating per product. Pricing is not shown — only
// feature gating, which has been confirmed. Each product has its own
// row set since CRM and ATS scale on different axes.

export const tiers = {
  crm: {
    rowOrder: [
      'users',
      'roles',
      'distribution',
      'fields',
      'insights',
      'support',
    ],
    en: {
      rowLabels: {
        users: 'Users',
        roles: 'Roles',
        distribution: 'Lead distribution',
        fields: 'Custom lead fields & statuses',
        insights: 'Insights',
        support: 'Support',
      },
      plans: [
        {
          name: 'Starter',
          price: 3000,
          blurb: 'One team, getting off spreadsheets',
          rows: {
            users: 'Up to 5',
            roles: 'Fixed (Sales, Sales Manager, Client Moderator)',
            distribution: 'Manual assignment only',
            fields: 'Fixed defaults',
            insights: 'Personal performance only',
            support: 'Email',
          },
        },
        {
          name: 'Growth',
          price: 5000,
          blurb: 'A real sales team, with real routing',
          highlighted: true,
          rows: {
            users: 'Up to 20',
            roles: 'Custom roles',
            distribution: 'Round robin, or by city, country, or category',
            fields: 'Configurable',
            insights: '+ team-wide manager insights',
            support: 'Priority',
          },
        },
        {
          name: 'Enterprise',
          blurb: 'Scale, plus compound routing rules',
          rows: {
            users: 'Unlimited',
            roles: 'Custom roles',
            distribution:
              'Multi-condition rules — e.g. city X + category A → Sales 1',
            fields: 'Configurable, advanced',
            insights: 'Same as Growth',
            support: 'Dedicated contact',
          },
        },
      ],
    },
    ar: {
      rowLabels: {
        users: 'المستخدمين',
        roles: 'الأدوار',
        distribution: 'توزيع العملاء المحتملين',
        fields: 'حقول وحالات مخصصة',
        insights: 'الرؤى والتحليلات',
        support: 'الدعم',
      },
      plans: [
        {
          name: 'المبدئية',
          price: 3000,
          blurb: 'فريق واحد، بادئ يترك الإكسل',
          rows: {
            users: 'حتى 5',
            roles: 'ثابتة (مبيعات، مدير مبيعات، مشرف عميل)',
            distribution: 'تعيين يدوي فقط',
            fields: 'إعدادات ثابتة',
            insights: 'أداء شخصي فقط',
            support: 'بالإيميل',
          },
        },
        {
          name: 'النمو',
          price: 5000,
          blurb: 'فريق مبيعات حقيقي، بتوزيع حقيقي',
          highlighted: true,
          rows: {
            users: 'حتى 20',
            roles: 'أدوار مخصصة',
            distribution: 'Round robin، أو حسب المدينة، الدولة، أو الفئة',
            fields: 'قابلة للتخصيص',
            insights: '+ رؤى على مستوى الفريق للمدير',
            support: 'دعم ذو أولوية',
          },
        },
        {
          name: 'المؤسسات',
          blurb: 'حجم غير محدود، مع قواعد توزيع مركبة',
          rows: {
            users: 'غير محدود',
            roles: 'أدوار مخصصة',
            distribution:
              'قواعد متعددة الشروط — مثال: مدينة س + فئة أ ← مندوب 1',
            fields: 'قابلة للتخصيص، متقدمة',
            insights: 'نفس باقة النمو',
            support: 'مسؤول تواصل مخصص',
          },
        },
      ],
    },
  },
  ats: {
    rowOrder: [
      'companies',
      'departments',
      'users',
      'history',
      'emailTracking',
      'templates',
      'interviews',
      'sidebar',
      'support',
    ],
    en: {
      rowLabels: {
        companies: 'Companies per user',
        departments: 'Department-level access scoping',
        users: 'Users',
        history: 'Applicant history / audit trail',
        emailTracking: 'Email tracking',
        templates: 'Job, offer & contract templates',
        interviews: 'Interview scoring & thresholds',
        sidebar: 'Custom sidebar labels',
        support: 'Support',
      },
      plans: [
        {
          name: 'Starter',
          price: 3000,
          blurb: 'Post a job, collect applicants, hire',
          rows: {
            companies: '1',
            departments: '—',
            users: 'Up to 5',
            history: 'Included',
            emailTracking: 'Sent confirmation',
            templates: '—',
            interviews: '—',
            sidebar: '—',
            support: 'Email',
          },
        },
        {
          name: 'Growth',
          price: 5000,
          blurb: 'Run hiring like an HR team',
          highlighted: true,
          rows: {
            companies: 'Up to 3',
            departments: 'Included',
            users: 'Up to 20',
            history: 'Included',
            emailTracking: '+ delivery & open tracking',
            templates: 'Included',
            interviews: 'Included',
            sidebar: 'Included',
            support: 'Priority',
          },
        },
        {
          name: 'Enterprise',
          blurb: 'Hiring across a whole organization',
          rows: {
            companies: 'Unlimited',
            departments: 'Included, granular',
            users: 'Unlimited',
            history: 'Included',
            emailTracking: '+ click & bounce analytics',
            templates: 'Included, per-department',
            interviews: 'Included',
            sidebar: 'Included',
            support: 'Dedicated contact',
          },
        },
      ],
    },
    ar: {
      rowLabels: {
        companies: 'الشركات لكل مستخدم',
        departments: 'تحديد الوصول على مستوى الأقسام',
        users: 'المستخدمين',
        history: 'سجل المتقدمين الكامل',
        emailTracking: 'تتبع الإيميلات',
        templates: 'قوالب الوظائف والعروض والعقود',
        interviews: 'تقييم المقابلات وتحديد الحدود',
        sidebar: 'تسميات مخصصة للشريط الجانبي',
        support: 'الدعم',
      },
      plans: [
        {
          name: 'المبدئية',
          price: 3000,
          blurb: 'نشر وظيفة، استقبال متقدمين، توظيف',
          rows: {
            companies: '1',
            departments: '—',
            users: 'حتى 5',
            history: 'متوفر',
            emailTracking: 'تأكيد الإرسال',
            templates: '—',
            interviews: '—',
            sidebar: '—',
            support: 'بالإيميل',
          },
        },
        {
          name: 'النمو',
          price: 5000,
          blurb: 'إدارة التوظيف بطريقة فريق HR حقيقي',
          highlighted: true,
          rows: {
            companies: 'حتى 3',
            departments: 'متوفر',
            users: 'حتى 20',
            history: 'متوفر',
            emailTracking: '+ تتبع التسليم والفتح',
            templates: 'متوفر',
            interviews: 'متوفر',
            sidebar: 'متوفر',
            support: 'دعم ذو أولوية',
          },
        },
        {
          name: 'المؤسسات',
          blurb: 'توظيف على مستوى مؤسسة كاملة',
          rows: {
            companies: 'غير محدود',
            departments: 'متوفر، تفصيلي',
            users: 'غير محدود',
            history: 'متوفر',
            emailTracking: '+ تحليلات الضغط والارتداد',
            templates: 'متوفر، لكل قسم',
            interviews: 'متوفر',
            sidebar: 'متوفر',
            support: 'مسؤول تواصل مخصص',
          },
        },
      ],
    },
  },
};

export default servicesContent;
