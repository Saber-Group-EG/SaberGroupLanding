// Content for the About page (/about). Also read by scripts/prerender.mjs.

const aboutContent = {
  en: {
    headline: 'Saber Group',
    subheadline:
      'An Egyptian agency specializing in building smart software solutions that empower businesses to manage their teams and leverage their data more efficiently.',
    stats: [
      { value: '20+', label: 'Active Clients' },
      { value: '99.5%', label: 'Platform Uptime' },
      { value: '15+', label: 'Years of Experience' },
    ],
    story: {
      title: 'Our Story',
      body: "Saber Group started in Tanta, Egypt, with a single goal: bridge the gap between Egyptian work teams and professional software tools. We noticed many companies relying on spreadsheets and manual processes to manage their hiring and sales, so we built practical, locally-tailored platforms that fit the Arabic market's needs.",
    },
    vision: {
      title: 'Our Vision',
      body: 'To be the first choice for Egyptian and Arab companies seeking reliable, customizable software tools — tools that grow with their business and adapt to their local context.',
    },
    values: {
      title: 'Our Values',
      list: [
        {
          title: 'Innovation',
          desc: 'We build tools that stay ahead of market needs, not chase them.',
        },
        {
          title: 'Precision',
          desc: 'Every feature we ship is built on real data and real client feedback.',
        },
        {
          title: 'Partnership',
          desc: 'We treat our clients as partners, not just subscribers.',
        },
        {
          title: 'Reliability',
          desc: '99.5% uptime guarantee and fast technical support during business hours.',
        },
      ],
    },
    cta: {
      title: 'Ready to get started?',
      subtitle:
        "Contact us today and let's find the right solution for your company.",
    },
  },
  ar: {
    headline: 'Saber Group',
    subheadline:
      'وكالة تقنية وتسويقية مصرية متخصصة في بناء حلول برمجية ذكية تُمكّن الشركات من إدارة فرقها واستثمار بياناتها بكفاءة أعلى.',
    stats: [
      { value: '20+', label: 'عميل نشط' },
      { value: '99.5%', label: 'جاهزية المنصة' },
      { value: '15+', label: 'سنوات خبرة' },
    ],
    story: {
      title: 'قصتنا',
      body: 'انطلقت Saber Group من طنطا، مصر، بهدف واحد: سد الفجوة بين فرق العمل المصرية والأدوات البرمجية الاحترافية. لاحظنا أن كثيرًا من الشركات تعتمد على جداول بيانات وعمليات يدوية لإدارة توظيفها ومبيعاتها، فقررنا بناء منصات عملية ومحلية الطابع تلائم احتياجات السوق العربي.',
    },
    vision: {
      title: 'رؤيتنا',
      body: 'أن نكون الخيار الأول للشركات المصرية والعربية التي تبحث عن أدوات برمجية موثوقة وقابلة للتخصيص — أدوات تنمو مع نمو أعمالها وتتكيف مع سياقها المحلي.',
    },
    values: {
      title: 'قيمنا',
      list: [
        {
          title: 'الابتكار',
          desc: 'نبني أدوات تتقدم على احتياجات السوق، لا تلحق بها.',
        },
        {
          title: 'الدقة',
          desc: 'كل ميزة نطلقها مبنية على بيانات وتغذية راجعة حقيقية من عملائنا.',
        },
        {
          title: 'الشراكة',
          desc: 'نتعامل مع عملائنا كشركاء، لا مجرد مشتركين.',
        },
        {
          title: 'الموثوقية',
          desc: 'ضمان جاهزية 99.5% ودعم فني سريع في أوقات العمل.',
        },
      ],
    },
    cta: {
      title: 'هل أنت مستعد للبدء؟',
      subtitle: 'تواصل معنا اليوم ودعنا نجد الحل المناسب لشركتك.',
    },
  },
};

export default aboutContent;
