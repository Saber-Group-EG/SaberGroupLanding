import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from '../i18n/hooks/useTranslation';
import servicesContent, {
  tiers as tiersByProduct,
} from '../content/ServicesContent';

// tierIndex is the language-independent tier position used across the app:
// 0 = Starter, 1 = Growth, 2 = Enterprise. It matches the tierIndex query
// param /checkout expects, so Buy Now passes the same value through.
const TIER_NAMES_EN = ['Starter', 'Growth', 'Enterprise'];

const ServicePlan = () => {
  const { isArabic } = useTranslation();
  const navigate = useNavigate();
  const { product, tierIndex } = useParams();
  const lang = isArabic ? 'ar' : 'en';

  const productKey = product?.toLowerCase();
  const index = Number(tierIndex);

  const validProduct = productKey === 'ats' || productKey === 'crm';
  const validTier =
    Number.isInteger(index) && index >= 0 && index < TIER_NAMES_EN.length;

  if (!validProduct || !validTier) {
    return <Navigate to="/services" replace />;
  }

  const { tabs } = servicesContent[lang];
  const productInfo = servicesContent[lang].products[productKey];
  const productTiers = tiersByProduct[productKey][lang];
  const rowLabels = productTiers.rowLabels;
  const rowOrder = tiersByProduct[productKey].rowOrder;
  const tier = productTiers.plans[index];

  const isEnterprise = !tier.price;

  const t = {
    breadcrumb: isArabic ? 'الخدمات' : 'Services',
    perMonth: isArabic ? 'شهريًا' : 'EGP / mo',
    customPrice: isArabic ? 'تسعير حسب الطلب' : 'Custom pricing',
    vatNote: isArabic
      ? 'السعر شامل ضريبة القيمة المضافة'
      : 'Price includes VAT',
    cancelNote: isArabic
      ? 'اشتراك شهري — يمكن إلغاؤه في أي وقت'
      : 'Monthly subscription — cancel any time',
    buyNow: isArabic ? 'اشترِ الآن' : 'Buy Now',
    getQuote: isArabic ? 'اطلب عرض سعر' : 'Get a quote',
    included: isArabic ? 'الباقة تشمل' : "What's included",
    back: isArabic ? 'رجوع للخدمات' : 'Back to Services',
  };

  const handlePrimaryAction = () => {
    if (isEnterprise) {
      navigate('/services#quote-form');
    } else {
      navigate(`/checkout?product=${productKey}&tierIndex=${index}`);
    }
  };

  return (
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      className="min-h-screen bg-linear-to-br from-light-50 via-white to-light-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-20 px-4 md:px-6"
    >
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-light-400 dark:text-light-500 mb-8">
          <button
            onClick={() => navigate('/services')}
            className="text-primary-500 hover:underline"
          >
            {t.breadcrumb}
          </button>
          <span>›</span>
          <span>{tabs[productKey]}</span>
          <span>›</span>
          <span className="text-light-600 dark:text-light-300">
            {tier.name}
          </span>
        </div>

        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <span className="text-xs font-semibold text-primary-500 uppercase tracking-wider">
            {productInfo.tagline}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-light-900 dark:text-white mt-3 mb-4 leading-tight">
            {tier.name}
          </h1>
          <p className="text-lg text-light-600 dark:text-light-400 leading-relaxed mb-6">
            {tier.blurb}
          </p>

          <div className="flex items-baseline gap-3 flex-wrap">
            {tier.price ? (
              <>
                <span className="text-3xl font-bold text-light-900 dark:text-white">
                  {tier.price.toLocaleString()}
                </span>
                <span className="text-sm text-light-500 dark:text-light-400">
                  {t.perMonth}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-light-900 dark:text-white">
                {t.customPrice}
              </span>
            )}
          </div>
          <p className="text-xs text-light-400 dark:text-light-500 mt-2">
            {tier.price ? t.vatNote : ''}
          </p>
        </div>

        {/* Product overview */}
        <div className="bg-white/80 dark:bg-dark-800/80 border border-light-200/50 dark:border-dark-700/50 rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex items-baseline gap-3 mb-2">
            <h2 className="text-2xl font-bold text-light-900 dark:text-white">
              {productInfo.name}
            </h2>
            <span className="text-sm text-light-500 dark:text-light-400">
              {productInfo.tagline}
            </span>
          </div>
          <p className="text-light-600 dark:text-light-400 leading-relaxed">
            {productInfo.description}
          </p>
        </div>

        {/* Included features for this tier */}
        <div className="bg-white/80 dark:bg-dark-800/80 border border-light-200/50 dark:border-dark-700/50 rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-light-900 dark:text-white mb-5">
            {t.included}
          </h2>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {rowOrder.map((rowKey) => (
              <li
                key={rowKey}
                className="flex items-start justify-between gap-4 text-sm border-b border-light-100 dark:border-dark-700 pb-3"
              >
                <span className="text-light-500 dark:text-light-400">
                  {rowLabels[rowKey]}
                </span>
                <span className="font-semibold text-light-800 dark:text-light-200 text-end">
                  {tier.rows[rowKey]}
                </span>
              </li>
            ))}
          </ul>
          {productInfo.notes && (
            <p className="text-xs text-light-500 dark:text-light-400 mt-5">
              {productInfo.notes}
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="bg-white/80 dark:bg-dark-800/80 border border-light-200/50 dark:border-dark-700/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="text-sm font-semibold text-light-900 dark:text-white">
              {tier.name} — {tabs[productKey]}
            </div>
            <p className="text-xs text-light-500 dark:text-light-400 mt-1">
              {t.cancelNote}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/services')}
              className="px-5 py-3 rounded-xl text-sm font-semibold border border-light-200 dark:border-dark-700 text-light-700 dark:text-light-300 hover:border-primary-500 transition-colors"
            >
              {t.back}
            </button>
            <button
              onClick={handlePrimaryAction}
              className="px-8 py-3.5 rounded-xl bg-primary-500 text-white text-sm font-bold hover:bg-primary-600 transition-colors"
            >
              {isEnterprise ? t.getQuote : t.buyNow}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicePlan;
