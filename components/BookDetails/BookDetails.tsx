import React, { FC } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'next-i18next';

import { PDFBook } from 'types';

const useStyles = makeStyles(
    () => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'BookDetails' },
);

type Props = {
    book: PDFBook;
};

export const BookDetails: FC<Props> = (props) => {
    const { book } = props;
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <List className={classes.root}>
            <ListItem>
                <ListItemText
                    primary={t('bookName')}
                    secondary={book.metadata.title}
                />
            </ListItem>

            <ListItem>
                <ListItemText primary={t('pages')} secondary={book.numPages} />
            </ListItem>
        </List>
    );
};
