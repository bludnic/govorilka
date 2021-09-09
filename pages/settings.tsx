import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import { makeStyles } from '@material-ui/core/styles';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import { LanguageSwitcher } from 'components/LanguageSwitcher';
import { NavigationLayout } from 'layouts/navigation';
import {Button} from '@material-ui/core';
import {useRouter} from 'next/router';

const useStyles = makeStyles(
    (theme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the container `div` element. */
        container: {
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(4),

            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
        /* Styles applied to the `LanguageSwitcher` component. */
        LanguageSwitcher: {},
    }),
    { name: 'Settings' },
);

type Props = {};

const Settings: NextPage<Props> = (props) => {
    const classes = useStyles();
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <NavigationLayout
            className={classes.root}
            AppBarProps={{
                title: t('settings'),
            }}
        >
            <div className={classes.container}>
                <LanguageSwitcher className={classes.LanguageSwitcher} />

                <Button onClick={() => router.push('/media-session')}>Media Session API</Button>
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

export default Settings;
