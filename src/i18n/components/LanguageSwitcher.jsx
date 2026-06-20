import React from "react";
import { useTranslation } from "../hooks/useTranslation";

const LanguageSwitcher = ({ className = "" }) => {
  const { currentLanguage, toggleLanguage } = useTranslation();

  return (
    <button
      onClick={toggleLanguage}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-300
        border-light-200 dark:border-dark-700
        text-light-700 dark:text-light-300
        hover:border-primary-500 hover:text-primary-500
        focus:outline-none ${className}`}
      aria-label={`Switch to ${currentLanguage === "en" ? "Arabic" : "English"}`}
    >
      {currentLanguage === "en" ? "عربي" : "EN"}
    </button>
  );
};

export default LanguageSwitcher;
