import { useState } from 'react';
import { X, Check, Send, Phone, Mail } from 'lucide-react';
import { useHomeCopy } from '../../i18n/hooks/useHomeCopy';
import { useTranslation } from '../../i18n/hooks/useTranslation';


export const ContactModal = ({ isOpen, onClose }) => {
  const copy = useHomeCopy();
  const { isArabic } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    services: [],
    budget: '$10k - $25k',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const modalCopy = copy.modals.contact;
  const budgetTiers = ['$5k - $10k', '$10k - $25k', '$25k - $50k', '$50k+'];

  const toggleService = (serviceId) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((s) => s !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const thanksTitle = copy.shared.thanksTitle.replace(
    '{name}',
    formData.name || copy.shared.friend,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-200 flex flex-col my-auto max-h-[92vh]">

        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5192D]" />
            <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
              {modalCopy.barTitle}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8">
          {submitted ? (
            <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-neutral-900 mb-2">
                {thanksTitle}
              </h3>
              <p className="text-neutral-500 text-sm max-w-md mb-8">
                {modalCopy.thanksText}
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-8 py-3 rounded-full bg-[#E5192D] text-white font-bold text-xs tracking-wider uppercase cursor-pointer"
              >
                {modalCopy.done}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <h3 className="text-3xl font-black text-neutral-900 tracking-tight uppercase mb-1">
                  {modalCopy.title}
                </h3>
                <p className="text-neutral-500 text-xs sm:text-sm">
                  {modalCopy.subtitle}
                </p>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2.5">
                  {modalCopy.servicesLabel}
                </label>
                <div className="flex flex-wrap gap-2">
                  {modalCopy.services.map((service) => {
                    const isSelected = formData.services.includes(service.id);
                    return (
                      <button
                        type="button"
                        key={service.id}
                        onClick={() => toggleService(service.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#E5192D] text-white shadow-xs'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {service.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    {modalCopy.name}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={modalCopy.namePlaceholder}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-hidden focus:border-[#E5192D] focus:ring-1 focus:ring-[#E5192D] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    {modalCopy.email}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder={copy.contact.emailPlaceholder}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-hidden focus:border-[#E5192D] focus:ring-1 focus:ring-[#E5192D] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    {modalCopy.phone}
                  </label>
                  <input
                    type="tel"
                    placeholder={copy.contact.phonePlaceholder}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-hidden focus:border-[#E5192D] focus:ring-1 focus:ring-[#E5192D] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    {modalCopy.company}
                  </label>
                  <input
                    type="text"
                    placeholder={modalCopy.companyPlaceholder}
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-hidden focus:border-[#E5192D] focus:ring-1 focus:ring-[#E5192D] text-sm"
                  />
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  {modalCopy.budget}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {budgetTiers.map((tier) => (
                    <button
                      type="button"
                      key={tier}
                      onClick={() => setFormData({ ...formData, budget: tier })}
                      dir="ltr"
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        formData.budget === tier
                          ? 'border-[#E5192D] bg-red-50 text-[#E5192D]'
                          : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  {modalCopy.brief}
                </label>
                <textarea
                  rows={3}
                  placeholder={modalCopy.briefPlaceholder}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-hidden focus:border-[#E5192D] focus:ring-1 focus:ring-[#E5192D] text-sm resize-none"
                />
              </div>

              {/* Submit Button & Direct Studio Contacts */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-100">
                <div className="flex items-center gap-4 text-neutral-500 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#E5192D]" />
                    <span dir="ltr">hello@sabergroup.com</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#E5192D]" />
                    <span dir="ltr">+20 2 2456 7890</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3 rounded-full bg-[#E5192D] hover:bg-[#c81424] text-white font-bold text-xs tracking-wider uppercase transition-colors shadow-md shadow-red-600/30 cursor-pointer"
                >
                  <span>{modalCopy.submit}</span>
                  <Send className={`w-4 h-4 ${isArabic ? '-scale-x-100' : ''}`} />
                </button>
              </div>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
