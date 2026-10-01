// ─── Data deletion (Saber CRM / Meta) ─────────────────────────────────────────
// Edit text here only. No JSX, no logic.
// Shown in the "Data Deletion" tab of /policies. Linked from the Saber CRM
// Meta app as its data deletion URL, and returned by the CRM's data deletion
// callback as the status page (/policies?tab=data-deletion&code=...).

export const dataDeletionContent = {
  en: {
    intro:
      'Saber CRM lets businesses connect their Facebook Pages and Instagram accounts to reply to customer messages. This section explains what data Saber CRM keeps and how to have it deleted.',
    storedTitle: 'What Saber CRM stores when a Page is connected',
    stored: [
      'The Page or Instagram account ID and name.',
      "An encrypted Page access token, used only to receive and send that Page's messages.",
      'Messages exchanged with the Page or Instagram account through Saber CRM, with their date and time.',
      'The name and profile photo Meta provides for customers who message the Page.',
    ],
    notStoredTitle: 'Saber CRM does not store',
    notStored: [
      'Your Facebook password.',
      'Your personal Facebook access token or Facebook profile information.',
    ],
    steps: [
      {
        title: 'Remove Saber CRM from your Facebook account',
        content:
          'On Facebook, go to Settings & privacy → Settings → Business integrations, find Saber CRM and click Remove. Saber CRM loses access to your Pages immediately, and you receive a confirmation code you can use on this page to check the status of your request.',
      },
      {
        title: "Delete a connected Page's conversations and customer data",
        content:
          'Email info@sabergroup-eg.com from the email address of a Page admin, with the name of the Page or Instagram account. We complete the request within 30 days and confirm by email.',
      },
      {
        title: 'If you messaged a business that uses Saber CRM',
        content:
          'Contact that business directly, or email info@sabergroup-eg.com with the name of the Page you messaged and your Facebook or Instagram name, and we will delete your messages and profile information within 30 days.',
      },
    ],
    status: {
      title: 'Your deletion request',
      loading: 'Checking your request…',
      notFound: "We couldn't find a request with this confirmation code.",
      code: 'Confirmation code',
      state: 'Status',
      received: 'Received',
      completed: 'Completed',
      states: { received: 'Received – in progress', completed: 'Completed' },
      completedNote:
        "Saber CRM stores no personal data linked to your Facebook account, so there was nothing further to delete. To delete a Page's conversations, email info@sabergroup-eg.com.",
    },
  },
  ar: {
    intro:
      'يتيح Saber CRM للشركات ربط صفحات فيسبوك وحسابات إنستجرام للرد على رسائل العملاء. يوضح هذا القسم البيانات التي يحتفظ بها Saber CRM وكيفية طلب حذفها.',
    storedTitle: 'ما يحفظه Saber CRM عند ربط صفحة',
    stored: [
      'معرّف واسم الصفحة أو حساب إنستجرام.',
      'رمز وصول مشفّر للصفحة، يُستخدم فقط لاستقبال وإرسال رسائل تلك الصفحة.',
      'الرسائل المتبادلة مع الصفحة أو حساب إنستجرام من خلال Saber CRM مع تاريخها ووقتها.',
      'الاسم وصورة الملف الشخصي التي توفرها ميتا للعملاء الذين يراسلون الصفحة.',
    ],
    notStoredTitle: 'لا يحفظ Saber CRM',
    notStored: [
      'كلمة مرور فيسبوك الخاصة بك.',
      'رمز الوصول الشخصي لحسابك على فيسبوك أو بيانات ملفك الشخصي.',
    ],
    steps: [
      {
        title: 'إزالة Saber CRM من حسابك على فيسبوك',
        content:
          'على فيسبوك، اذهب إلى الإعدادات والخصوصية ← الإعدادات ← تكاملات الأعمال، ابحث عن Saber CRM واضغط إزالة. يفقد Saber CRM الوصول إلى صفحاتك فورًا، وستحصل على رمز تأكيد يمكنك استخدامه في هذه الصفحة لمتابعة حالة طلبك.',
      },
      {
        title: 'حذف محادثات وبيانات عملاء صفحة مرتبطة',
        content:
          'راسلنا على info@sabergroup-eg.com من البريد الإلكتروني لأحد مسؤولي الصفحة مع ذكر اسم الصفحة أو حساب إنستجرام. ننفّذ الطلب خلال 30 يومًا ونؤكد لك بالبريد.',
      },
      {
        title: 'إذا راسلت شركة تستخدم Saber CRM',
        content:
          'تواصل مع تلك الشركة مباشرة، أو راسلنا على info@sabergroup-eg.com مع ذكر اسم الصفحة التي راسلتها واسمك على فيسبوك أو إنستجرام، وسنحذف رسائلك وبيانات ملفك الشخصي خلال 30 يومًا.',
      },
    ],
    status: {
      title: 'طلب الحذف الخاص بك',
      loading: 'جاري التحقق من طلبك…',
      notFound: 'لم نجد طلبًا بهذا الرمز.',
      code: 'رمز التأكيد',
      state: 'الحالة',
      received: 'تاريخ الاستلام',
      completed: 'تاريخ الإتمام',
      states: { received: 'تم الاستلام – قيد التنفيذ', completed: 'تم' },
      completedNote:
        'لا يحفظ Saber CRM أي بيانات شخصية مرتبطة بحسابك على فيسبوك، لذلك لم يكن هناك ما يلزم حذفه. لحذف محادثات صفحة، راسلنا على info@sabergroup-eg.com.',
    },
  },
};
