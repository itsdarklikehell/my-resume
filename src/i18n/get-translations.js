export function getTranslations(lang, dictionaries) {
  return {
    ...dictionaries.nl,
    ...(dictionaries[lang] || {}),
  };
}
