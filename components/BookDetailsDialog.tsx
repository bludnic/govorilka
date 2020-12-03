import React, { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';

import { PDFBook } from 'types';

const useStyles = makeStyles(
    (theme) => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'BookDetailsDialog' },
);

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (bookTitle: string) => void;
    book: PDFBook;
};

export const BookDetailsDialog: FC<Props> = (props) => {
    const { open, onClose, onSubmit, book } = props;
    const classes = useStyles();

    const [bookTitle, setBookTitle] = useState(book.metadata.title);

    const handleSubmit = () => {
        onSubmit(bookTitle);
    };

    return (
        <Dialog className={classes.root} open={open} onClose={onClose} fullWidth>
            <DialogContent>
                <TextField
                    label="Название книги"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    fullWidth
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={handleSubmit}>ОК</Button>
            </DialogActions>
        </Dialog>
    );
};
