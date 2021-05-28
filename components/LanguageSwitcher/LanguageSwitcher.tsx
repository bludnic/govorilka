import React, { FC, useMemo } from 'react';
import FormControl, { FormControlProps } from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select, { SelectProps } from '@material-ui/core/Select';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { Locale } from 'next-i18next.config';
import { MenuPropsBottom } from 'util/mui';
import { countryToFlag } from 'util/i18n/countryFlag';
import { fromLanguageToCountry } from 'util/i18n/fromLanguageToCountry';

const useStyles = makeStyles(
    (theme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the emoji flag inside `MenuItem` component. */
        flag: {
            marginRight: theme.spacing(1),
        },
    }),
    { name: 'LanguageSwitcher' },
);

export type LanguageSwitcherProps = {
    className?: string;
    FormControlProps?: FormControlProps;
    SelectProps?: SelectProps;
};

export const LanguageSwitcher: FC<LanguageSwitcherProps> = (props) => {
    const { className, FormControlProps, SelectProps } = props;
    const classes = useStyles();
    const router = useRouter();
    const { t } = useTranslation();

    const handleLanguageChange = (
        e: React.ChangeEvent<{ name?: string; value: unknown }>,
    ) => {
        router.replace(
            {
                pathname: router.pathname,
                query: router.query,
            },
            undefined,
            {
                locale: e.target.value as string,
            },
        );
    };

    const languages: Array<{
        locale: Locale;
        name: string;
    }> = useMemo(
        () => [
            {
                locale: 'en',
                name: t('english'),
            },
            {
                locale: 'ru',
                name: t('russian'),
            },
        ],
        [router.locale],
    );

    return (
        <FormControl
            className={clsx(classes.root, className)}
            variant="outlined"
            fullWidth
            {...FormControlProps}
        >
            <InputLabel id="select-language-label">{t('language')}</InputLabel>
            <Select
                labelId="select-language-label"
                id="select-language"
                value={router.locale}
                onChange={handleLanguageChange}
                label={t('language')}
                MenuProps={MenuPropsBottom}
                {...SelectProps}
            >
                {languages.map(({ locale, name }) => (
                    <MenuItem key={locale} value={locale}>
                        <span className={classes.flag}>
                            {countryToFlag(fromLanguageToCountry(locale))}
                        </span>
                        <span>{name}</span>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
