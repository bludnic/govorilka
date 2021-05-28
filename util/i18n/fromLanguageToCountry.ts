import { Locale } from 'next-i18next.config';

const languageCountryMap: Record<Locale, string> = {
    en: 'US',
    ru: 'RU',
};

export function fromLanguageToCountry(locale: Locale): string {
    return languageCountryMap[locale];
}
