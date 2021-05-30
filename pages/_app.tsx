import React, { useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Head from 'next/head';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AppProps } from 'next/app';
import { appWithTranslation, useTranslation } from 'next-i18next';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { darkTheme, lightTheme } from 'theme';

function App(props: AppProps) {
    const { Component, pageProps } = props;
    const { t } = useTranslation();

    useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles && jssStyles.parentElement) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = React.useMemo(
        () => createMuiTheme(prefersDarkMode ? darkTheme : lightTheme),
        [prefersDarkMode],
    );

    return (
        <React.Fragment>
            <Head>
                <title>{t('brandName')}</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <Component {...pageProps} />
            </ThemeProvider>
        </React.Fragment>
    );
}

export default appWithTranslation(App);
