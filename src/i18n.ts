import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { enMessages } from './consts/en';

const resources = {
  en: {
    translation: enMessages,
  },
};

void i18next.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});
