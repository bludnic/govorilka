import React, { useEffect, useState } from 'react';
import CircularProgress  from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { GetStaticProps, NextPage } from 'next';
import { makeStyles } from '@material-ui/core/styles';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import { NavigationLayout } from 'layouts/navigation';
import { PDFBook } from 'types';
import { getAllBooks } from 'util/indexedDB/books';

const useStyles = makeStyles(
    (theme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the `div` container of <CircularProgress /> component. */
        circularProgressContainer: {
            textAlign: 'center',
            paddingTop: theme.spacing(4),
        },
    }),
    { name: 'Index' },
);

type Props = {};

const Index: NextPage<Props> = () => {
    const classes = useStyles();
    const router = useRouter();
    const { t } = useTranslation();

    const [books, setBooks] = useState<PDFBook[]>([]);
    const [loadingBooks, setLoadingBooks] = useState(false);
    const [booksFetched, setBooksFetched] = useState(false);

    useEffect(() => {
        setLoadingBooks(true);
        getAllBooks()
            .then((books) => setBooks(books))
            .finally(() => {
                setLoadingBooks(false);
                setBooksFetched(true);
            });
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
                title: t('myBooks'),
            }}
        >
            {loadingBooks ? (
                <div className={classes.circularProgressContainer}>
                    <CircularProgress variant="indeterminate" />
                </div>
            ) : booksFetched ? (
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
            ) : null}
        </NavigationLayout>
    );
};

export const getStaticProps: GetStaticProps = async (context) => {
    const locale = context.locale || context.defaultLocale;

    const translations = locale
        ? await serverSideTranslations(locale, ['common'])
        : null;

    return {
        props: {
            ...translations,
        },
    };
};

export default Index;
