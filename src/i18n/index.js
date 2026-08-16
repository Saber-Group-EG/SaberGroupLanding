import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import commonEN from "./locales/en/common.json";
import navigationEN from "./locales/en/navigation.json";
import contactEN from "./locales/en/contact.json";
import heroEN from "./locales/en/hero.json";
import footerEN from "./locales/en/footer.json";
import aboutEN from "./locales/en/about.json";
import joinUsEN from "./locales/en/joinUs.json";
import commonAR from "./locales/ar/common.json";
import navigationAR from "./locales/ar/navigation.json";
import contactAR from "./locales/ar/contact.json";
import heroAR from "./locales/ar/hero.json";
import footerAR from "./locales/ar/footer.json";
import aboutAR from "./locales/ar/about.json";
import joinUsAR from "./locales/ar/joinUs.json";

// Translation resources
const resources = {
  en: {
    common: commonEN,
    navigation: navigationEN,
    contact: contactEN,
    hero: heroEN,
    footer: footerEN,
    about: aboutEN,
    joinUs: joinUsEN,
  },
  ar: {
    common: commonAR,
    navigation: navigationAR,
    contact: contactAR,
    hero: heroAR,
    footer: footerAR,
    about: aboutAR,
    joinUs: joinUsAR,
  },
};

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    lng: "en",
    supportedLngs: ["en", "ar"],
    defaultNS: "contact",
    ns: ["common", "navigation", "contact", "footer", "hero", "about", "joinUs"],

    // React options
    react: {
      useSuspense: false,
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // Custom configuration
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  });

// Language change handler to update HTML direction
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";

  // Also update font family for Arabic
  if (lng === "ar") {
    document.body.classList.add("font-arabic");
  } else {
    document.body.classList.remove("font-arabic");
  }

  // Save to localStorage
  localStorage.setItem("Saber Group-language", lng);
});

export default i18n;
