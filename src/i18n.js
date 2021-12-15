import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en.json';
import translationMG from './locales/mg.json';

const resources = {
    en: {
        translation: translationEN,
    },
    mg: {
        translation: translationMG,
    }
}

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',

        keySeparator: true,

        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;