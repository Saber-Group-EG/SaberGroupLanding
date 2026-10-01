import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from '../i18n/hooks/useTranslation';
import {
  privacyContent,
  refundContent,
  serviceContent,
} from '../content/PoliciesContent.js';
import { dataDeletionContent } from '../content/DataDeletionContent.js';

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  { key: 'privacy', en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
  { key: 'refund', en: 'Refund Policy', ar: 'سياسة الاسترداد' },
  { key: 'service', en: 'Service Duration', ar: 'مدة الخدمة' },
  { key: 'data-deletion', en: 'Data Deletion', ar: 'حذف البيانات' },
];

// ─── Shared components ────────────────────────────────────────────────────────

const SectionCard = ({ index, title, content, badge }) => (
  <div className="bg-white/80 dark:bg-dark-800/80 border border-light-200/50 dark:border-dark-700/50 rounded-2xl p-6 md:p-8">
    <div className="flex items-start gap-4">
      <span className="shrink-0 w-8 h-8 rounded-lg bg-primary-500/10 text-primary-500 flex items-center justify-center text-sm font-bold">
        {index}
      </span>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h2 className="text-lg font-bold text-light-900 dark:text-white">
            {title}
          </h2>
          {badge && (
            <span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-500 text-xs font-semibold">
              {badge}
            </span>
          )}
        </div>
        <p className="text-light-600 dark:text-light-400 leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  </div>
);

const ContactFooter = ({ isArabic, showPhone }) => (
  <div className="text-center bg-white/80 dark:bg-dark-800/80 border border-light-200/50 dark:border-dark-700/50 rounded-2xl p-8">
    <p className="text-light-600 dark:text-light-400 mb-3">
      {isArabic
        ? 'للأسئلة المتعلقة بهذه السياسة، تواصل معنا:'
        : 'For questions about this policy, reach us at:'}
    </p>
    <a
      href="mailto:info@sabergroup-eg.com"
      className="text-primary-500 font-semibold hover:underline"
    >
      info@sabergroup-eg.com
    </a>
    {showPhone && (
      <>
        <span className="mx-4 text-light-300 dark:text-light-600">|</span>
        <a
          href="tel:+201080099757"
          dir="ltr"
          className="text-primary-500 font-semibold hover:underline"
        >
          01080099757
        </a>
      </>
    )}
  </div>
);

// ─── Tab panels ───────────────────────────────────────────────────────────────

const PrivacyPanel = ({ isArabic }) => {
  const lang = isArabic ? 'ar' : 'en';
  const { intro, sections } = privacyContent[lang];
  return (
    <div className="space-y-6">
      <div className="bg-primary-500/5 border border-primary-500/20 rounded-2xl p-6 text-light-700 dark:text-light-300 leading-relaxed">
        {intro}
      </div>
      {sections.map((sec, i) => (
        <SectionCard
          key={i}
          index={i + 1}
          title={sec.title}
          content={sec.content}
        />
      ))}
      <ContactFooter isArabic={isArabic} />
    </div>
  );
};

const RefundPanel = ({ isArabic }) => {
  const lang = isArabic ? 'ar' : 'en';
  const { sections } = refundContent[lang];
  return (
    <div className="space-y-6">
      {sections.map((sec, i) => (
        <SectionCard
          key={i}
          index={i + 1}
          title={sec.title}
          content={sec.content}
        />
      ))}
      <ContactFooter isArabic={isArabic} showPhone />
    </div>
  );
};

const ServicePanel = ({ isArabic }) => {
  const lang = isArabic ? 'ar' : 'en';
  const { sections, sla, slaTitle, note } = serviceContent[lang];
  return (
    <div className="space-y-6">
      {sections.map((sec, i) => (
        <SectionCard
          key={i}
          index={i + 1}
          title={sec.title}
          content={sec.content}
          badge={sec.badge}
        />
      ))}

      <div className="bg-white/80 dark:bg-dark-800/80 border border-light-200/50 dark:border-dark-700/50 rounded-2xl p-6 md:p-8">
        <div className="flex items-start gap-4 mb-6">
          <span className="shrink-0 w-8 h-8 rounded-lg bg-primary-500/10 text-primary-500 flex items-center justify-center text-sm font-bold">
            {sections.length + 1}
          </span>
          <h2 className="text-lg font-bold text-light-900 dark:text-white mt-1">
            {slaTitle}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 ps-12">
          {sla.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-light-50 dark:bg-dark-700/50 rounded-xl px-4 py-3"
            >
              <span className="text-light-500 dark:text-light-400 text-sm">
                {item.label}
              </span>
              <span className="font-semibold text-light-900 dark:text-white text-sm">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-primary-500/5 border border-primary-500/20 rounded-2xl p-6 text-light-600 dark:text-light-400 leading-relaxed text-sm">
        {note}
      </div>

      <ContactFooter isArabic={isArabic} />
    </div>
  );
};

// Status of a Meta data deletion request. The CRM's data deletion callback
// sends people here with ?code=...; /api/v1 is proxied to the CRM backend
// (see vercel.json).
const DeletionStatus = ({ code, isArabic, text }) => {
  const [request, setRequest] = useState(null);
  const [state, setState] = useState('loading');

  // Rendered with key={code}, so a new code remounts and starts at 'loading'.
  useEffect(() => {
    fetch(`/api/v1/webhooks/meta/data-deletion/${encodeURIComponent(code)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((body) => {
        setRequest(body.data);
        setState('found');
      })
      .catch(() => setState('notFound'));
  }, [code]);

  const formatDate = (value) =>
    value ? new Date(value).toLocaleString(isArabic ? 'ar-EG' : 'en-US') : '—';

  return (
    <div className="bg-primary-500/5 border border-primary-500/20 rounded-2xl p-6">
      <h2 className="text-lg font-bold text-light-900 dark:text-white mb-3">
        {text.title}
      </h2>
      {state === 'loading' && (
        <p className="text-light-600 dark:text-light-400">{text.loading}</p>
      )}
      {state === 'notFound' && <p className="text-red-500">{text.notFound}</p>}
      {state === 'found' && request && (
        <>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            <dt className="text-light-500 dark:text-light-400">{text.code}</dt>
            <dd className="font-mono text-light-900 dark:text-white" dir="ltr">
              {request.confirmationCode}
            </dd>
            <dt className="text-light-500 dark:text-light-400">{text.state}</dt>
            <dd className="font-semibold text-light-900 dark:text-white">
              {text.states[request.status]}
            </dd>
            <dt className="text-light-500 dark:text-light-400">
              {text.received}
            </dt>
            <dd className="text-light-900 dark:text-white">
              {formatDate(request.createdAt)}
            </dd>
            <dt className="text-light-500 dark:text-light-400">
              {text.completed}
            </dt>
            <dd className="text-light-900 dark:text-white">
              {formatDate(request.completedAt)}
            </dd>
          </dl>
          {request.status === 'completed' && (
            <p className="text-light-600 dark:text-light-400 text-sm mt-4">
              {text.completedNote}
            </p>
          )}
        </>
      )}
    </div>
  );
};

const BulletCard = ({ title, items }) => (
  <div className="bg-white/80 dark:bg-dark-800/80 border border-light-200/50 dark:border-dark-700/50 rounded-2xl p-6 md:p-8">
    <h2 className="text-lg font-bold text-light-900 dark:text-white mb-3">
      {title}
    </h2>
    <ul className="list-disc ps-6 space-y-2 text-light-600 dark:text-light-400 leading-relaxed">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const DataDeletionPanel = ({ isArabic, code }) => {
  const lang = isArabic ? 'ar' : 'en';
  const { intro, storedTitle, stored, notStoredTitle, notStored, steps, status } =
    dataDeletionContent[lang];
  return (
    <div className="space-y-6">
      {code && (
        <DeletionStatus
          key={code}
          code={code}
          isArabic={isArabic}
          text={status}
        />
      )}
      <div className="bg-primary-500/5 border border-primary-500/20 rounded-2xl p-6 text-light-700 dark:text-light-300 leading-relaxed">
        {intro}
      </div>
      <BulletCard title={storedTitle} items={stored} />
      <BulletCard title={notStoredTitle} items={notStored} />
      {steps.map((step, i) => (
        <SectionCard
          key={i}
          index={i + 1}
          title={step.title}
          content={step.content}
        />
      ))}
      <ContactFooter isArabic={isArabic} />
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const PoliciesPage = () => {
  const { isArabic } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const validKeys = TABS.map((t) => t.key);
  const activeTab = validKeys.includes(tabParam) ? tabParam : 'privacy';

  const deletionCode = searchParams.get('code');

  const setTab = (key) => setSearchParams({ tab: key }, { replace: true });

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen bg-linear-to-br from-light-50 via-white to-light-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-20 px-4 md:px-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 mt-12">
          <h1 className="text-4xl md:text-5xl font-bold text-light-900 dark:text-white mb-3">
            {isArabic ? 'السياسات' : 'Policies'}
          </h1>
          <p className="text-light-500 dark:text-light-400 mb-2">
            {isArabic
              ? 'كل ما تحتاج معرفته حول كيفية عملنا وحماية بياناتك.'
              : 'Everything you need to know about how we operate and protect your data.'}
          </p>
          <p className="text-light-400 dark:text-light-500 text-xs">
            {isArabic ? 'آخر تحديث: أكتوبر 2026' : 'Last updated: October 2026'}
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white/80 dark:bg-dark-800/80 border border-light-200/50 dark:border-dark-700/50 rounded-2xl p-1.5 gap-1 flex-wrap justify-center">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setTab(tab.key)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-linear-to-r from-primary-500 to-secondary-500 text-white shadow-md'
                    : 'text-light-500 dark:text-light-400 hover:text-light-900 dark:hover:text-white'
                }`}
              >
                {isArabic ? tab.ar : tab.en}
              </button>
            ))}
          </div>
        </div>

        {/* Panel */}
        {activeTab === 'privacy' && <PrivacyPanel isArabic={isArabic} />}
        {activeTab === 'refund' && <RefundPanel isArabic={isArabic} />}
        {activeTab === 'service' && <ServicePanel isArabic={isArabic} />}
        {activeTab === 'data-deletion' && (
          <DataDeletionPanel isArabic={isArabic} code={deletionCode} />
        )}
      </div>
    </section>
  );
};

export default PoliciesPage;
