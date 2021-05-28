import React, { FC } from 'react';
import List from '@material-ui/core/List';
import { PLayListItem } from './PLayListItem';
import { makeStyles } from '@material-ui/core/styles';

import { PDFBook, PDFPage } from 'types';

const useStyles = makeStyles(
    () => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'PlayList' },
);

type Props = {
    page: number;
    onChange: (page: number) => void;
    book: PDFBook;
};

export const PlayList: FC<Props> = (props) => {
    const { page, onChange, book } = props;
    const classes = useStyles();

    const handleClick = (page: PDFPage) => {
        onChange(page.pageNum);
    };

    return (
        <List className={classes.root}>
            {book.pages.map((pdfPage) => (
                <PLayListItem
                    key={pdfPage.pageNum}
                    onClick={handleClick}
                    page={pdfPage}
                    selected={pdfPage.pageNum === page}
                />
            ))}
        </List>
    );
};
