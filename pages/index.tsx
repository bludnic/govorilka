import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { NextPage } from 'next';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

import { NavigationLayout } from 'layouts/navigation';
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

const Index: NextPage<Props> = () => {
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
        <NavigationLayout
            className={classes.root}
            AppBarProps={{
                title: 'My books',
            }}
        >
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
                ))}
            </List>
        </NavigationLayout>
    );
};

export default Index;
