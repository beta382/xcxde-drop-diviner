import {
  deDE,
  enUS,
  esES,
  frFR,
  itIT,
  jaJP,
  koKR,
  zhCN,
  zhTW,
} from "@mui/material/locale";
import type { Resources } from "i18next";
import type { ExtractStrict } from "type-fest";

export const muiLocales = {
  enUS,
  deDE,
  esES,
  frFR,
  itIT,
  jaJP,
  koKR,
  zhCN,
  zhTW,
};

export const languages = {
  // English
  en: {
    localName: "English",
    gameShorthand: "Us",
    muiShorthand: "enUS",
    uiTranslated: true,
  },
  // German
  de: {
    localName: "Deutsch",
    gameShorthand: "Ge",
    muiShorthand: "deDE",
    uiTranslated: false,
  },
  // Spanish
  es: {
    localName: "español",
    gameShorthand: "Sp",
    muiShorthand: "esES",
    uiTranslated: false,
  },
  // French
  fr: {
    localName: "français",
    gameShorthand: "Fr",
    muiShorthand: "frFR",
    uiTranslated: false,
  },
  // Italian
  it: {
    localName: "italiano",
    gameShorthand: "It",
    muiShorthand: "itIT",
    uiTranslated: false,
  },
  // Japanese
  ja: {
    localName: "日本語",
    gameShorthand: "Jp",
    muiShorthand: "jaJP",
    uiTranslated: true,
  },
  // Korean
  ko: {
    localName: "한국어",
    gameShorthand: "Kr",
    muiShorthand: "koKR",
    uiTranslated: false,
  },
  // Chinese (Simplified)
  "zh-CN": {
    localName: "中文（简体）",
    gameShorthand: "Cn",
    muiShorthand: "zhCN",
    uiTranslated: false,
  },
  // Chinese (Traditional)
  "zh-TW": {
    localName: "中文（繁體）",
    gameShorthand: "Tw",
    muiShorthand: "zhTW",
    uiTranslated: false,
  },
} as const satisfies Record<
  string,
  {
    localName: string;
    gameShorthand: string;
    muiShorthand: keyof typeof muiLocales;
    uiTranslated: boolean;
  }
>;

export type Language = keyof typeof languages;
export type VoiceLanguage = ExtractStrict<Language, "en" | "ja">;

export type Translation = Resources["translation"];
