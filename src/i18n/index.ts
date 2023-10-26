import { createI18n } from 'vue-i18n';
import en from '@/i18n/locales/en.json';
import uk from '@/i18n/locales/uk.json';

export const supportedLocales = {
  en: { name: 'en' },
  uk: { name: 'uk' },
};

const i18n = createI18n({
  // default locale
  locale: 'en',
  // translations
  messages: {
    en: en,
    uk: uk,
  },
  warnHtmlInMessage: 'off',
});

export default i18n;
