import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import { FirebaseAuth } from 'components/auth';
import { NavigationLayout } from 'layouts/navigation';

const useStyles = makeStyles(
    (theme: Theme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the container `div` element. */
        container: {
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(4),

            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
    }),
    { name: 'Auth' },
);

const Auth: NextPage = () => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <NavigationLayout
            className={classes.root}
            AppBarProps={{
                title: t('signIn'),
            }}
        >
            <div className={classes.container}>
                <FirebaseAuth />
            </div>
        </NavigationLayout>
    );
};

export const getStaticProps: GetStaticProps = async (context) => {
    const locale = context.locale || context.defaultLocale;

    const translations = locale
        ? await serverSideTranslations(locale, ['common'])
        : null;

    return {
        props: {
            ...translations,
        },
    };
};

export default Auth;
