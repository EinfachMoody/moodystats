import { motion } from 'framer-motion';
import { Check, ChevronRight, Globe } from 'lucide-react';
import { Language, LANGUAGES } from '@/i18n/translations';
import { GlassCard } from './GlassCard';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  onBack: () => void;
}

export const LanguageSelector = ({
  currentLanguage,
  onLanguageChange,
  onBack,
}: LanguageSelectorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl hover:bg-muted/50 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180" />
        </motion.button>
        <h1 className="text-2xl font-bold text-foreground">Language</h1>
      </div>

      {/* Language List */}
      <GlassCard className="!p-0 overflow-hidden">
        {LANGUAGES.map((lang, index) => (
          <motion.button
            key={lang.code}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onLanguageChange(lang.code);
              onBack();
            }}
            className={`w-full flex items-center justify-between px-4 py-4 transition-colors ${
              index !== LANGUAGES.length - 1 ? 'border-b border-border/50' : ''
            } ${currentLanguage === lang.code ? 'bg-primary/5' : 'hover:bg-muted/30'}`}
            dir={lang.rtl ? 'rtl' : 'ltr'}
          >
            <div className={`flex items-center gap-3 ${lang.rtl ? 'flex-row-reverse' : ''}`}>
              <Globe className="w-5 h-5 text-primary" />
              <div className={`text-${lang.rtl ? 'right' : 'left'}`}>
                <p className="font-semibold text-foreground">{lang.nativeName}</p>
                <p className="text-xs text-muted-foreground">{lang.englishName}</p>
              </div>
            </div>
            {currentLanguage === lang.code && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-primary-foreground" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </GlassCard>
    </motion.div>
  );
};
