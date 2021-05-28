const withPWA = require('next-pwa');

const { i18n } = require('./next-i18next.config');

module.exports = withPWA({
    pwa: {
        dest: 'public',
    },
    i18n,
    // other next config
});
