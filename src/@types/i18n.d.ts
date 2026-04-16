import "i18";
import "i18next";
import translation from "~/../public/locales/en/translation.json";
import type { Language } from "~/common/languages";

const resources = {
  translation,
} as const;

declare module "i18next" {
  interface CustomTypeOptions {
    resources: typeof resources;
    enableSelector: "optimize";
  }

  interface i18n {
    language: Language;
  }
}
