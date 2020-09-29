export const TRANSLATION_LANGUAGES = [
  {
    text: "Japanese",
    key: "ja",
    flag: "🇯🇵"
  }
];

export const LANGUAGES = [
  {
    text: "English",
    key: "en",
    flag: "🇺🇸"
  },
  ...TRANSLATION_LANGUAGES
];

export const TRANSLATION_DEFAULT_LANGUAGE = "ja";

export function vulnerabilityMapTpl() {
  return LANGUAGES.reduce(
    (acc, curr) => {
      acc[curr.key] = {};
      return acc;
    },
    { en: {} }
  );
}
