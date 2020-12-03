import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import { NextPage } from 'next';
import { makeStyles } from '@material-ui/core/styles';

import { BookDetails } from 'components/BookDetails';
import { BookDetailsDialog } from 'components/BookDetailsDialog';
import { LoadingOverlay } from 'components/LoadingOverlay';
import { PDFBook } from 'types';
import { UploadPdf } from 'components/UploadPdf';
import { convertPdfBase64ToBook } from 'util/pdf';
import { saveBookToDB } from 'util/book/saveBookToDB';

const useStyles = makeStyles(
    (theme) => ({
        /* Styles applied to the root element. */
        root: {},
        Card: {
            height: 256,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
        },
    }),
    { name: 'BookUpload' },
);

type Props = {};

const BookUpload: NextPage<Props> = (props) => {
    const classes = useStyles();
    const [book, setBook] = useState<PDFBook | null>(null);
    const [bookDetailsDialog, setBookDetailsDialog] = useState(false);
    const [isConverting, setConverting] = useState(false);

    const handleUploadPdf = (base64: string) => {
        setConverting(true);
        convertPdfBase64ToBook(base64)
            .then((book) => {
                setBook(book);
                setBookDetailsDialog(true);
            })
            .catch((err) => {
                console.log(err);
            })
            .then(() => {
                setConverting(false);
            });
    };

    const handleBookDetailsSubmit = (bookTitle: string) => {
        setBookDetailsDialog(false);

        if (book) {
            const newBook = {
                ...book,
                metadata: {
                    ...book.metadata,
                    title: bookTitle,
                },
            };

            setBook(newBook);

            saveBookToDB(newBook);
        }
    };

    const handleBookDetailsClose = () => {
        setBookDetailsDialog(false);

        if (book) {
            saveBookToDB(book);
        }
    };

    return (
        <div className={classes.root}>
            <Card className={classes.Card}>
                {book ? (
                    <BookDetails book={book} />
                ) : (
                    <UploadPdf onUpload={handleUploadPdf} />
                )}
            </Card>

            <LoadingOverlay loading={isConverting} />

            {book ? (
                <BookDetailsDialog
                    open={bookDetailsDialog}
                    onClose={handleBookDetailsClose}
                    onSubmit={handleBookDetailsSubmit}
                    book={book}
                />
            ) : null}
        </div>
    );
};

export default BookUpload;
