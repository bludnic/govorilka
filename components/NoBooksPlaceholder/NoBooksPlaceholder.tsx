import BookIcon from '@material-ui/icons/Book';
import Button from '@material-ui/core/Button';
import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const useStyles = makeStyles(
    (theme) => ({
        /* Styles applied to the root element. */
        root: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            textAlign: 'center',
        },
        /* Styles applied to the addBook `Button` component. */
        addButton: {
            marginTop: theme.spacing(2),
        },
    }),
    { name: 'NoBooksPlaceholder' },
);

type NoBooksPlaceholderProps = {
    className?: string;
};

export const NoBooksPlaceholder: FC<NoBooksPlaceholderProps> = (props) => {
    const { className } = props;
    const classes = useStyles();
    const router = useRouter();
    const { t } = useTranslation();

    const addBook = () => {
        router.push('/book-upload');
    };

    return (
        <div className={clsx(classes.root, className)}>
            <Typography>{t('noBooksPlaceholder')}</Typography>

            <Button
                className={classes.addButton}
                variant="outlined"
                onClick={addBook}
                startIcon={<BookIcon />}
            >
                {t('addBook')}
            </Button>
        </div>
    );
};
