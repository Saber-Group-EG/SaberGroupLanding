import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';
import { useTranslation } from '../../i18n/hooks/useTranslation';

export const InlineContactSection = () => {
  const copy = useHomeCopy();
  const { isArabic } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'media-production',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const contactCopy = copy.contact;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: 'media-production',
      message: '',
    });
  };

  const thanksTitle = copy.shared.thanksTitle.replace(
    '{name}',
    formData.name || copy.shared.friend,
  );

  return (
    <section
      id="contact"
      className="py-24 bg-[#090b0e] text-white border-t border-neutral-900 scroll-mt-16 relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 start-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#E5192D]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">

        {/* Harmonized 2-Column Equal-Height Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">

          {/* Start Column: Visual Brand Story & Direct Touchpoints */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl bg-[#111418] border border-neutral-800 p-8 sm:p-10 shadow-2xl relative overflow-hidden">

            {/* Top Info */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5192D]/15 text-[#E5192D] text-[10px] font-extrabold uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5192D]" />
                <span>{contactCopy.badge}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white uppercase tracking-tight leading-[1.08]">
                {contactCopy.headingLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
                <span className="text-[#E5192D] block">{contactCopy.headingAccent}</span>
              </h2>

              <p className="text-neutral-400 text-xs sm:text-sm mt-4 leading-relaxed max-w-sm">
                {contactCopy.intro}
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="relative z-10 mt-10 space-y-3 pt-6 border-t border-neutral-800/80">
              <a
                href="mailto:contact@sabergroup.studio"
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-[#E5192D] transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E5192D]/10 text-[#E5192D] flex items-center justify-center flex-shrink-0 group-hover:bg-[#E5192D] group-hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    {contactCopy.directEmail}
                  </div>
                  <div className="text-xs font-semibold text-white group-hover:text-[#E5192D] transition-colors" dir="ltr">
                    contact@sabergroup.studio
                  </div>
                </div>
              </a>

              <a
                href="tel:+201000000000"
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-[#E5192D] transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E5192D]/10 text-[#E5192D] flex items-center justify-center flex-shrink-0 group-hover:bg-[#E5192D] group-hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    {contactCopy.hotline}
                  </div>
                  <div className="text-xs font-semibold text-white group-hover:text-[#E5192D] transition-colors" dir="ltr">
                    +20 100 000 0000
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                <div className="w-10 h-10 rounded-xl bg-[#E5192D]/10 text-[#E5192D] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    {contactCopy.studioLocation}
                  </div>
                  <div className="text-xs font-semibold text-white">
                    {contactCopy.locationValue}
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle decorative glow */}
            <div className="absolute -bottom-10 -end-10 w-44 h-44 bg-[#E5192D]/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* End Column: Clean & Aligned Contact Form */}
          <div className="lg:col-span-7 bg-[#111418] rounded-3xl p-8 sm:p-10 border border-neutral-800 shadow-2xl flex flex-col justify-between">
            {submitted ? (
              <div className="py-16 my-auto flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-6">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                  {thanksTitle}
                </h3>
                <p className="text-neutral-400 text-sm max-w-md mb-8">
                  {contactCopy.thanksText}
                </p>
                <button
                  onClick={resetForm}
                  className="px-8 py-3 rounded-full bg-[#E5192D] text-white font-bold text-xs tracking-wider uppercase cursor-pointer hover:bg-[#c81424] transition-colors"
                >
                  {contactCopy.sendAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between gap-5">
                {/* Form Header */}
                <div>
                  <div className="text-[10px] font-extrabold text-neutral-400 tracking-[0.2em] uppercase mb-1.5">
                    {contactCopy.formEyebrow}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                    {contactCopy.formTitle}
                  </h3>
                  <p className="text-neutral-400 text-xs mt-1">
                    {contactCopy.formSubtitle}
                  </p>
                </div>

                {/* Service Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-2">
                    {contactCopy.serviceLabel}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {contactCopy.services.map((svc) => {
                      const isSelected = formData.service === svc.id;
                      return (
                        <button
                          key={svc.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, service: svc.id })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#E5192D] text-white border-[#E5192D] shadow-sm'
                              : 'bg-neutral-900/90 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white'
                          }`}
                        >
                          {svc.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Compact 2-Column Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      {contactCopy.name}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={contactCopy.namePlaceholder}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#E5192D] text-xs transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      {contactCopy.email}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder={contactCopy.emailPlaceholder}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#E5192D] text-xs transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    {contactCopy.phone}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={contactCopy.phonePlaceholder}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#E5192D] text-xs transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    {contactCopy.brief}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={contactCopy.briefPlaceholder}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-hidden focus:border-[#E5192D] text-xs resize-none transition-colors"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-1 flex items-center justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#E5192D] hover:bg-[#c81424] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md shadow-red-600/30 active:scale-95 cursor-pointer"
                  >
                    <span>{contactCopy.submit}</span>
                    <Send className={`w-3.5 h-3.5 ${isArabic ? '-scale-x-100' : ''}`} />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
