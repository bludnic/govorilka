import React, { FC } from 'react';
import BookIcon from '@material-ui/icons/Book';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import MuiBottomNavigation from '@material-ui/core/BottomNavigation';
import MuiBottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import SettingsIcon from '@material-ui/icons/Settings';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const useStyles = makeStyles(
    () => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'BottomNavigation' },
);

export type BottomNavigationProps = {
    className?: string;
};

export const BottomNavigation: FC<BottomNavigationProps> = (props) => {
    const { className } = props;
    const classes = useStyles();
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <MuiBottomNavigation
            className={clsx(classes.root, className)}
            value={router.pathname}
            onChange={(event, newPathname: string) => {
                router.replace({
                    pathname: newPathname,
                });
            }}
            showLabels
        >
            <MuiBottomNavigationAction
                value="/"
                label={t('myBooks')}
                icon={<LibraryBooksIcon />}
            />

            <MuiBottomNavigationAction
                value="/book-upload"
                label={t('newBook')}
                icon={<BookIcon />}
            />

            <MuiBottomNavigationAction
                value="/settings"
                label={t('settings')}
                icon={<SettingsIcon />}
            />
        </MuiBottomNavigation>
    );
};
