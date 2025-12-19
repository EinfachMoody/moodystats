import { useCallback } from 'react';
import { translations, Language, TranslationKey, LANGUAGES } from '@/i18n/translations';

export const useTranslation = (language: Language) => {
  const t = useCallback((key: TranslationKey): string => {
    const translation = translations[language]?.[key];
    if (translation) return translation;
    
    // Fallback to English
    return translations.en[key] || key;
  }, [language]);

  const isRTL = LANGUAGES.find(l => l.code === language)?.rtl || false;

  return { t, isRTL };
};
