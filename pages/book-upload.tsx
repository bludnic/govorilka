import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import { NextPage } from 'next';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

import { BookDetails } from 'components/BookDetails';
import { BookDetailsDialog } from 'components/BookDetailsDialog';
import { LoadingOverlay } from 'components/LoadingOverlay';
import { NavigationLayout } from 'layouts/navigation';
import { PDFBook } from 'types';
import { UploadPdf } from 'components/UploadPdf';
import { addBook } from 'util/indexedDB/books';
import { convertPdfBase64ToBook } from 'util/pdf';

const useStyles = makeStyles(
    () => ({
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

const BookUpload: NextPage<Props> = () => {
    const classes = useStyles();
    const router = useRouter();
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
                title: bookTitle,
            };

            setBook(newBook);

            addBook(newBook).then(() => {
                openBook(newBook.id);
            });
        }
    };

    const handleBookDetailsClose = () => {
        setBookDetailsDialog(false);

        if (book) {
            addBook(book);
        }
    };

    const openBook = (bookId: number) => {
        router.push({
            pathname: '/book',
            query: {
                id: bookId,
            },
        });
    };

    return (
        <NavigationLayout className={classes.root}>
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
        </NavigationLayout>
    );
};

export default BookUpload;
