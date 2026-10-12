import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { useTranslation } from "../i18n/hooks/useTranslation";
import Swal from "sweetalert2";
import { SITE_NAME } from "../utils/ogMeta";
import { addLead, fetchCountries as apiFetchCountries, fetchCities as apiFetchCities, fetchGovernorates as apiFetchGovernorates } from "../api/generalApi";
import useSubCategories from "../hooks/useSubCategories";

const ContactUs = () => {
  const { t, isArabic } = useTranslation();
  const { subCategories, isLoading } = useSubCategories(isArabic);
  const [countries, setCountries] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [cities, setCities] = useState([]);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    country: "",
    government: "",
    city: "",
    services: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const inputClass = "w-full px-4 py-3 min-h-11 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-400 text-sm focus:outline-none focus:border-[#E5192D] focus-visible:ring-2 focus-visible:ring-[#E5192D]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111418] transition-colors";

  const labelClass = "block text-[11px] font-bold text-neutral-400 uppercase ltr:tracking-wider rtl:tracking-normal mb-1.5";

  // Helper to get a localized display name from location objects
  const formatLocationName = (item) => {
    if (!item) return '';
    const name = item.name || '';
    if (!name) return '';
    if (typeof name === 'string') return name;
    // name may be an object like { en, ar }
    return isArabic ? (name.ar || name.en || '') : (name.en || name.ar || '');
  };

  const contactMethods = [
    {
      icon: <Phone className="w-4 h-4" />,
      title: t("contact:callUs") || "Call Us",
      value: "01080099757",
      link: "tel:+201080099757",
    },
    {
      icon: <Mail className="w-4 h-4" />,
      title: t("contact:emailUs") || "Email Us",
      value: "info@sabergroup-eg.com",
      link: "mailto:info@sabergroup-eg.com",
    },
    {
      icon: <MessageCircle className="w-4 h-4" />,
      title: t("contact:whatsapp") || "WhatsApp",
      value: "01080099757",
      link: "https://wa.me/201080099757",
    },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
        </svg>
      ),
      link: "https://www.instagram.com/sabergroupstudios",
    },
    {
      name: "LinkedIn",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      link: "https://www.linkedin.com/in/ahmed-saber-004aa8196/",
    },
    {
      name: "Behance",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 7v10h6.5c2.25 0 3.5-1.25 3.5-3.25 0-1.75-1.25-2.75-3-2.95V10c1.4-.15 2.5-1.1 2.5-2.5C12.5 6 11 5 8.5 5H3zm9 7.5c.83 0 1.5.67 1.5 1.5S12.83 17.5 12 17.5H9V14h3v.5zM16 8h5v2h-5V8zm0 4h5v6h-5v-6z" />
        </svg>
      ),
      link: "https://www.behance.net/ahmed_saber_",
    },
    {
      name: "Facebook",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      link: "https://www.facebook.com/sabergroupeg",
    },

  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleService = (serviceId) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((s) => s !== serviceId)
        : [...prev.services, serviceId],
    }));
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await apiFetchCountries({ deleted: false, PageCount: 1000, page: 1 });
        const countriesData = res.data?.data || [];
        setCountries(countriesData);
        const egypt = countriesData.find((c) => {
          const nm = formatLocationName(c).toString().trim().toLowerCase();
          return nm === "egypt" || nm === "مصر";
        });
        if (egypt) {
          setFormData((prev) => ({ ...prev, country: egypt._id }));
          fetchGovernorates(egypt._id);
        }
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    };

    const fetchAllCities = async () => {
      try {
        const res = await apiFetchCities({ deleted: false, PageCount: 1000, page: 1 });
        setAllCities(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch cities:", err);
      }
    };

    fetchCountries();
    fetchAllCities();
  }, []);

  const fetchGovernorates = async (countryId) => {
    if (!countryId) {
      setGovernorates([]);
      setCities([]);
      setFormData((prev) => ({ ...prev, government: "", city: "" }));
      return;
    }

    try {
      const res = await apiFetchGovernorates({ deleted: false, PageCount: 1000, page: 1, country: countryId });
      setGovernorates(res.data?.data || []);
      setFormData((prev) => ({ ...prev, government: "", city: "" }));
    } catch (err) {
      console.error("Failed to fetch governorates:", err);
      setGovernorates([]);
    }
  };


  const filteredCountries = countries.filter((c) => {
    const name = (formatLocationName(c) || "").toString().trim().toLowerCase();
    return name !== "اونلاين" && name !== "غير محدد";
  });

  const isEgyptSelected = (() => {
    if (!formData.country) return false;
    const sel = countries.find((c) => c._id === formData.country);
    if (!sel) return false;
    const name = (formatLocationName(sel) || "").toString().trim().toLowerCase();
    return name === "egypt" || name === "مصر";
  })();

  // extend handleChange to react to country/government/projectInterest
  const originalHandleChange = handleChange;
  const enhancedHandleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "country") {
      const selected = countries.find((c) => c._id === value);
      const selName = formatLocationName(selected).toString().trim().toLowerCase();
      if (selName === "egypt" || selName === "مصر") {
        fetchGovernorates(value);
      } else {
        setGovernorates([]);
        setCities([]);
        setFormData((prev) => ({ ...prev, government: "", city: "" }));
      }
    } else if (name === "government") {
      const filteredCities = allCities.filter((city) => {
        return city.government === value || city.governmentId === value || city.governorate === value || city.government?._id === value;
      });
      setCities(filteredCities);
      setFormData((prev) => ({ ...prev, city: "" }));
    }

    // projectInterest removed

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // replace validate and submit with CRM payload logic
  const validateFormExtended = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t("contact:nameRequired") || "Name is required";
    if (!formData.email.trim()) newErrors.email = t("contact:emailRequired") || "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t("contact:emailInvalid") || "Invalid email address";
    if (!formData.country || !formData.country.trim()) newErrors.country = t("contact:countryRequired") || "Country is required";
    if (!formData.phone.trim()) newErrors.phone = t("contact:phoneRequired") || "Phone is required";
    return newErrors;
  };

  const handleSubmitExtended = async (e) => {
    e.preventDefault();
    const validationErrors = validateFormExtended();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorKey = Object.keys(validationErrors)[0];
      const firstErrorMessage = validationErrors[firstErrorKey];
      const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => { errorElement.focus(); }, 300);
      }
      setTimeout(async () => {
        await Swal.fire({ icon: 'warning', title: t('contact:validationError') || 'Validation Error', text: firstErrorMessage, confirmButtonText: t('common:ok') || 'OK', confirmButtonColor: '#f59e0b' });
      }, 300);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email || "",
        phone: formData.phone,
        otherPhones: [],
        status: "Pending",
        addresses: [{ area: "", landmark: "", street: "", deleted: false }],
        country: formData.country || "",
        ...(formData.government ? { government: formData.government } : {}),
        ...(formData.city ? { city: formData.city } : {}),
        subCategories: formData.services,
        campaigns: [],
        channels: [],
        // no projects field — projectInterest removed
        files: [],
        prevOrders: [],
        sales: [],
        ...(formData.message && formData.message.trim() ? { message: { message: formData.message.trim() } } : {}),
        company: import.meta.env.VITE_CRM_COMPANY_ID,
        branch: import.meta.env.VITE_CRM_BRANCH_ID,
        deleted: false,
        isWhatsapp: false,
      };

      await addLead(payload);

      await Swal.fire({ icon: 'success', title: t('contact:successTitle') || 'Message Sent Successfully!', text: t('contact:successMessage') || `Thank you for contacting ${SITE_NAME}. We'll get back to you within 24 hours.`, confirmButtonText: t('common:ok') || 'OK', confirmButtonColor: '#10b981' });

      setSubmitSuccess(true);
      const egypt = countries.find((c) => {
        const nm = formatLocationName(c).toString().trim().toLowerCase();
        return nm === "egypt" || nm === "مصر";
      });
      setFormData({ name: "", email: "", phone: "", message: "", country: egypt?._id || "", government: "", city: "", services: [] });
      if (egypt) fetchGovernorates(egypt._id);
      setErrors({});
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.debug("Form submission error:", error);
      const errorMessage = error?.response?.data?.message || t("contact:submitError") || "An error occurred. Please try again.";
      setErrors({ submit: errorMessage });
      await Swal.fire({ icon: 'error', title: t('contact:error') || 'Error', text: errorMessage, confirmButtonText: t('common:ok') || 'OK', confirmButtonColor: '#ef4444' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t("contact:nameRequired") || "Name is required";
    if (!formData.email.trim()) newErrors.email = t("contact:emailRequired") || "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t("contact:emailInvalid") || "Invalid email address";
    if (!formData.phone || !formData.phone.trim()) newErrors.phone = t("contact:phoneRequired") || "Phone is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstKey = Object.keys(validationErrors)[0];
      const firstMsg = validationErrors[firstKey];
      const el = document.querySelector(`[name="${firstKey}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => el.focus(), 300);
      }
      Swal.fire({
        icon: "warning",
        title: t("contact:validationError") || "Validation Error",
        text: firstMsg,
        confirmButtonText: t("common:ok") || "OK",
        confirmButtonColor: "#f59e0b",
        background: "#1a1a1a",
        color: "#fff",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      Swal.fire({
        icon: "success",
        title: t("contact:successTitle") || "Message Sent Successfully!",
        text: t("contact:successMessage") || "Thank you for reaching out. Our team will contact you within 24 hours.",
        confirmButtonText: t("common:ok") || "OK",
        confirmButtonColor: "#10b981",
        background: "#1a1a1a",
        color: "#fff",
        showClass: { popup: "animate-fade-in-down" },
      });
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "", country: "", government: "", city: "", services: [] });
      setErrors({});
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.debug("submission error", err);
      const errorMessage = t("contact:submitError") || "An error occurred. Please try again.";
      setErrors({ submit: errorMessage });
      Swal.fire({
        icon: "error",
        title: t("contact:error") || "Error",
        text: errorMessage,
        confirmButtonText: t("common:ok") || "OK",
        confirmButtonColor: "#ef4444",
        background: "#1a1a1a",
        color: "#fff",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact-section"
      dir={isArabic ? 'rtl' : 'ltr'}
      className="pt-16 min-h-screen bg-[#090b0e] text-white selection:bg-[#E5192D] selection:text-white relative overflow-hidden"
      style={{
        fontFamily: isArabic
          ? "'Cairo', system-ui, sans-serif"
          : "'Montserrat', system-ui, sans-serif",
      }}
    >
      <Helmet>
        {!isArabic && (
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap"
          />
        )}
        {isArabic && (
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap"
          />
        )}
      </Helmet>

      {/* Ambient background glow */}
      <div className="absolute top-1/2 start-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#E5192D]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-10">
        {/* Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5192D]/15 text-[#FF6B76] text-[10px] font-extrabold uppercase ltr:tracking-widest rtl:tracking-normal mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5192D]" />
          <span>{t('contact:badge')}</span>
        </div>

        <h1 className="font-black text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight leading-[1.05] text-white">
          <span className="block">{t('contact:title')}</span>
          <span className="block text-[#E5192D]">{t('contact:tagline')}</span>
        </h1>

        <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mt-4 leading-relaxed">
          {t('contact:subtitle')}
        </p>

        {/* Two-column body: form card + info card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch pt-12 pb-20 sm:pb-24">
          {/* Form Card */}
          <div id="contact-form" className="lg:col-span-7 lg:order-2 rounded-3xl bg-[#111418] border border-neutral-800 p-6 sm:p-8 lg:p-10 shadow-2xl flex flex-col">
            {submitSuccess ? (
              <div className="py-16 my-auto flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-6 animate-bounce motion-reduce:animate-none">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">
                  {t('contact:successTitle')}
                </h3>
                <p className="text-neutral-400 text-sm max-w-md mb-8">
                  {t('contact:successMessage')}
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="px-8 py-3.5 rounded-full bg-[#E5192D] hover:bg-[#c81424] text-white font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5192D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111418]"
                >
                  {t('contact:sendAnother')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitExtended} className="flex flex-col gap-5">
                {/* Form Header */}
                <div className="border-b border-neutral-800/80 pb-5 mb-5">
                  <div className="text-[10px] font-extrabold text-neutral-400 ltr:tracking-[0.2em] rtl:tracking-normal uppercase mb-1.5">
                    {t('contact:formEyebrow')}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                    {t('contact:formTitle')}
                  </h2>
                  <p className="text-neutral-400 text-xs mt-1">
                    {t('contact:formSubtitle')}
                  </p>
                </div>

                {/* Service Needed — multi-select from CRM subcategories */}
                {(subCategories.length > 0 || isLoading) && (
                  <div>
                    <label id="service-label" className={labelClass}>
                      {t('contact:serviceLabel')}
                    </label>
                    <div className="flex flex-wrap gap-2" role="group" aria-labelledby="service-label">
                      {isLoading && subCategories.length === 0
                        ? Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-11 w-28 rounded-xl bg-neutral-800/70 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
                          ))
                        : subCategories.map((sub) => {
                            const isSelected = formData.services.includes(sub._id);
                            return (
                              <button
                                key={sub._id}
                                type="button"
                                onClick={() => toggleService(sub._id)}
                                aria-pressed={isSelected}
                                className={`px-4 py-2 min-h-11 rounded-xl border text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5192D]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111418] ${
                                  isSelected
                                    ? 'bg-[#E5192D] text-white border-[#E5192D] shadow-sm'
                                    : 'bg-neutral-900/90 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white'
                                }`}
                              >
                                {sub.name}
                              </button>
                            );
                          })}
                    </div>
                  </div>
                )}

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label htmlFor="name" className={labelClass}>
                      {t('contact:name') || 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={enhancedHandleChange}
                      placeholder={t('contact:namePlaceholder') || 'John Doe'}
                      aria-invalid={errors.name ? 'true' : undefined}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      className={`${inputClass} ${errors.name ? 'border-[#f87171]' : ''}`}
                    />
                    {errors.name && (
                      <p id="name-error" className="flex items-center gap-1.5 text-[#f87171] text-xs mt-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>
                      {t('contact:email') || 'Email'} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={enhancedHandleChange}
                      placeholder={
                        t('contact:emailPlaceholder') || 'john@company.com'
                      }
                      aria-invalid={errors.email ? 'true' : undefined}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className={`${inputClass} ${errors.email ? 'border-[#f87171]' : ''}`}
                    />
                    {errors.email && (
                      <p id="email-error" className="flex items-center gap-1.5 text-[#f87171] text-xs mt-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    {t('contact:phone') || 'Phone Number'} *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={enhancedHandleChange}
                    placeholder={
                      t('contact:phonePlaceholder') ||
                      'Enter your phone number'
                    }
                    aria-invalid={errors.phone ? 'true' : undefined}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    className={`${inputClass} ${errors.phone ? 'border-[#f87171]' : ''}`}
                  />
                  {errors.phone && (
                    <p id="phone-error" className="flex items-center gap-1.5 text-[#f87171] text-xs mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                {/* Country & Governorate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label htmlFor="country" className={labelClass}>
                      {t('contact:country') || 'Country'} *
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={enhancedHandleChange}
                      aria-invalid={errors.country ? 'true' : undefined}
                      aria-describedby={errors.country ? 'country-error' : undefined}
                      className={`${inputClass} ${errors.country ? 'border-[#f87171]' : ''}`}
                    >
                      <option value="">
                        {t('contact:selectCountry') || 'Select a country'}
                      </option>
                      {filteredCountries.map((c) => (
                        <option key={c._id} value={c._id}>
                          {formatLocationName(c)}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <p id="country-error" className="flex items-center gap-1.5 text-[#f87171] text-xs mt-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.country}</span>
                      </p>
                    )}
                  </div>
                  {isEgyptSelected ? (
                    <div>
                      <label htmlFor="government" className={labelClass}>
                        {t('contact:government') || 'Governorate'}
                      </label>
                      <select
                        id="government"
                        name="government"
                        value={formData.government}
                        onChange={enhancedHandleChange}
                        disabled={!formData.country}
                        className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <option value="">
                          {t('contact:selectGovernment') ||
                            'Select a governorate'}
                        </option>
                        {governorates.map((g) => (
                          <option key={g._id} value={g._id}>
                            {formatLocationName(g)}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}
                </div>

                {isEgyptSelected && (
                  <div>
                    <label htmlFor="city" className={labelClass}>
                      {t('contact:city') || 'City'}
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={enhancedHandleChange}
                      disabled={!formData.government}
                      className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <option value="">
                        {t('contact:selectCity') || 'Select a city'}
                      </option>
                      {cities.map((c) => (
                        <option key={c._id} value={c._id}>
                          {formatLocationName(c)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Message */}
                <div>
                  <label htmlFor="message" className={labelClass}>
                    {t('contact:message') || 'Message'}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={enhancedHandleChange}
                    rows="4"
                    placeholder={
                      t('contact:messagePlaceholder') ||
                      'Tell us more about your inquiry...'
                    }
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="p-4 rounded-xl bg-[#f87171]/10 border border-[#f87171]/20">
                    <p className="flex items-center gap-1.5 text-[#f87171] text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errors.submit}</span>
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-1 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#E5192D] hover:bg-[#c81424] text-white font-bold text-xs tracking-wider uppercase shadow-md shadow-red-600/30 active:scale-95 disabled:opacity-60 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5192D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111418]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />
                        <span>{t('contact:sending') || 'Sending...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{t('contact:sendMessage') || "Let's Talk"}</span>
                        <Send className={`w-4 h-4 ${isArabic ? '-scale-x-100' : ''}`} />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-neutral-500 text-center">
                  {t('contact:privacyNote')}
                </p>
              </form>
            )}
          </div>

          {/* Info Card */}
          <div className="lg:col-span-5 lg:order-1 rounded-3xl bg-[#111418] border border-neutral-800 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5192D]/15 text-[#FF6B76] text-[10px] font-extrabold uppercase ltr:tracking-widest rtl:tracking-normal mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5192D]" />
                <span>{t('contact:badge')}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white uppercase tracking-tight leading-[1.08]">
                <span className="block">{t('contact:title')}</span>
                <span className="text-[#E5192D] block">{t('contact:tagline')}</span>
              </h2>

              <p className="text-neutral-400 text-xs sm:text-sm mt-4 leading-relaxed max-w-sm">
                {t('contact:subtitle')}
              </p>
            </div>

            {/* Direct Contact Rows */}
            <div className="relative z-10 mt-10 space-y-3 pt-6 border-t border-neutral-800/80">
              <a
                href={`mailto:${t('contact:emailAddress')}`}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-[#E5192D] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5192D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111418]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E5192D]/10 text-[#E5192D] group-hover:bg-[#E5192D] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase ltr:tracking-wider rtl:tracking-normal">
                    {t('contact:emailTitle')}
                  </div>
                  <div className="text-xs font-semibold text-white group-hover:text-[#E5192D] transition-colors" dir="ltr" style={{ unicodeBidi: 'isolate-override' }}>
                    {t('contact:emailAddress')}
                  </div>
                </div>
              </a>

              <a
                href="tel:+201080099757"
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-[#E5192D] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5192D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111418]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E5192D]/10 text-[#E5192D] group-hover:bg-[#E5192D] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase ltr:tracking-wider rtl:tracking-normal">
                    {t('contact:phoneTitle')}
                  </div>
                  <div className="text-xs font-semibold text-white group-hover:text-[#E5192D] transition-colors" dir="ltr" style={{ unicodeBidi: 'isolate-override' }}>
                    {t('contact:phoneNumber')}
                  </div>
                </div>
              </a>

              <a
                href="https://wa.me/201080099757"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-[#E5192D] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5192D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111418]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E5192D]/10 text-[#E5192D] group-hover:bg-[#E5192D] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase ltr:tracking-wider rtl:tracking-normal">
                    {t('contact:whatsapp')}
                  </div>
                  <div className="text-xs font-semibold text-white group-hover:text-[#E5192D] transition-colors" dir="ltr" style={{ unicodeBidi: 'isolate-override' }}>
                    {t('contact:phoneNumber')}
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                <div className="w-10 h-10 rounded-xl bg-[#E5192D]/10 text-[#E5192D] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase ltr:tracking-wider rtl:tracking-normal">
                    {t('contact:addressTitle')}
                  </div>
                  <div className="text-xs font-semibold text-white">
                    {t('contact:address')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                <div className="w-10 h-10 rounded-xl bg-[#E5192D]/10 text-[#E5192D] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase ltr:tracking-wider rtl:tracking-normal">
                    {t('contact:officeHoursTitle')}
                  </div>
                  <div className="text-xs font-semibold text-white" dir="ltr" style={{ unicodeBidi: 'isolate-override' }}>
                    {t('contact:officeHours')}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">
                    {t('contact:weekend')}
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle decorative glow */}
            <div className="absolute -bottom-10 -end-10 w-44 h-44 bg-[#E5192D]/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>


        {/* Social Media Links */}
        <div className="pb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
              {t('contact:followUs')}
            </h2>
            <p className="text-neutral-400 text-sm">
              {t('contact:socialSubtitle')}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="w-11 h-11 rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-[#E5192D] hover:text-white transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5192D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090b0e]"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

    
      </div>

      {/* Pre-footer CTA band */}
      <section className="py-20 bg-[#0e1114] border-t border-neutral-900 text-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6">
              <h2 className="font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight leading-[1.1] text-white">
                {t('contact:ctaHeading')}
              </h2>
            </div>

            <div className="hidden lg:block lg:col-span-1 h-20 w-[1px] bg-neutral-800 mx-auto" />

            <div className="lg:col-span-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
                {t('contact:ctaText')}
              </p>

              <button
                type="button"
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#E5192D] hover:bg-[#c81424] text-white font-bold text-xs tracking-wider uppercase transition-all duration-150 shadow-md shadow-red-600/30 active:scale-95 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5192D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1114]"
              >
                <span>{t('contact:ctaButton')}</span>
                <ArrowRight className="w-4 h-4 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default ContactUs;
