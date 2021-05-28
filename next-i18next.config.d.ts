export type Locale = 'en' | 'ru';

declare const nextI18NextConfig: {
    i18n: {
        locales: Locale[];
        defaultLocale: Locale;
    };
};

export default nextI18NextConfig;
