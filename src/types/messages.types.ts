export type Languages = "en";
export type LanguageState = {
  locale: Languages,
  messages: LocaleMessages;
};
export type LocaleMessages = Record<Languages, Record<string, string>>;
