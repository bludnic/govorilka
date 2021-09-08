import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import { makeStyles } from '@material-ui/core/styles';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import { NavigationLayout } from 'layouts/navigation';
import { ProfileCard } from 'components/user/ProfileCard';

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
        /* Styles applied to the `ProfileCard` component. */
        ProfileCard: {},
    }),
    { name: 'Profile' },
);

type Props = {};

const Profile: NextPage<Props> = (props) => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <NavigationLayout
            className={classes.root}
            AppBarProps={{
                title: t('profile'),
            }}
        >
            <div className={classes.container}>
                <ProfileCard className={classes.ProfileCard} />
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

export default Profile;
