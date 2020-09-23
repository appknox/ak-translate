import { LANGUAGES } from "./languages";

export default function languageIcon(lang: string) {
  const icons = LANGUAGES.reduce((acc, curr) => {
    acc[curr.key] = curr.flag;
    return acc;
  }, {});
  return icons[lang] || "";
}
