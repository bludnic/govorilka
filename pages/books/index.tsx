import React, { useEffect, useState } from 'react';
import BookIcon from '@material-ui/icons/Book';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { NextPage } from 'next';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

import { PDFBook } from 'types';
import { getAllBooks } from 'util/indexedDB/books';

const useStyles = makeStyles(
    () => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'Index' },
);

type Props = {};

const Index: NextPage<Props> = (props) => {
    const classes = useStyles();
    const router = useRouter();

    const [books, setBooks] = useState<PDFBook[]>([]);

    useEffect(() => {
        getAllBooks().then((books) => setBooks(books));
    }, []);

    const openBook = (bookId: number) => {
        router.push({
            pathname: '/book',
            query: {
                id: bookId,
            },
        });
    };

    return (
        <div className={classes.root}>
            <List>
                {books.map((book) => (
                    <ListItem
                        onClick={() => openBook(book.id)}
                        key={book.id}
                        button
                    >
                        <ListItemText
                            primary={book.title}
                            secondary={book.id}
                        />
                    </ListItem>
                ))}{' '}
            </List>

            <Button
                onClick={() => router.push('/book-upload')}
                startIcon={<BookIcon />}
                fullWidth
            >
                Upload Book
            </Button>
        </div>
    );
};

export default Index;
