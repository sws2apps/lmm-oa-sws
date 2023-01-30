import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LANGUAGE_LIST } from './locales/langList';

const resources = {};

// programatically load all locales
for await (const language of LANGUAGE_LIST) {
  // load ui namespace
<<<<<<< HEAD
  const ui = await import(`./locales/${language.code}/ui.json`).then((module) => module.default);
  // load source namespace
  const source = await import(`./locales/${language.code}/source.json`).then((module) => module.default);
=======
  const ui = await import(`./locales/${language.locale}/ui.json`).then((module) => module.default);
  // load source namespace
  const source = await import(`./locales/${language.locale}/source.json`).then((module) => module.default);
>>>>>>> 6e3b1db33e16ba9f987241c3effad690d52a3341

  resources[language.code] = {
    ui,
    source,
  };
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'e',
  fallbackLng: 'e',
  keySeparator: true,
  interpolation: { escapeValue: false },
});

export default i18n;
