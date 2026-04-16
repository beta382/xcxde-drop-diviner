import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import { languages } from "~/common/languages";

i18n.use(Backend).use(LanguageDetector).use(initReactI18next);

if (import.meta.env.DEV) {
  const { HMRPlugin } = await import("i18next-hmr/plugin");
  i18n.use(new HMRPlugin({ vite: { client: true } }));
}

await i18n.init({
  debug: import.meta.env.DEV,
  supportedLngs: Object.keys(languages),
  fallbackLng: "en",
  load: "currentOnly",
  backend: {
    loadPath: "./locales/{{lng}}/{{ns}}.json",
  },
  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
  },
  interpolation: {
    escapeValue: false, // Handled by React
  },
});

export default i18n;
