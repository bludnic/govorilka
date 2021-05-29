import React, { useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { Box, FormControlLabel, Switch } from '@material-ui/core';
import { GetStaticProps, NextPage } from 'next';
import { makeStyles } from '@material-ui/core/styles';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import apiClient, { SsmlVoiceGender, Voice } from 'util/apiClient';
import { FlexSpacer } from 'components/FlexSpacer';
import { LoadingOverlay } from 'components/LoadingOverlay';
import { NavigationLayout } from 'layouts/navigation';
import { PDFBook, PDFPage } from 'types';
import { PlayList } from 'components/PlayList';
import { Player } from 'components/Player';
import { VoicesCombobox } from 'components/VoicesCombobox';
import { getBook } from 'util/indexedDB/books';

const useStyles = makeStyles(
    (theme) => ({
        /* Styles applied to the root element. */
        root: {},
        /* Styles applied to the `div` container of <CircularProgress /> component. */
        circularProgressContainer: {
            textAlign: 'center',
            paddingTop: theme.spacing(4),
        },
        /* Styles applied to the `Player` component. */
        Player: {
            marginTop: theme.spacing(2),
        },
        /* Styles applied to the `VoiceCombobox` component. */
        VoicesCombobox: {
            marginTop: theme.spacing(1),
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        /* Styles applied to the book meta `Box` component. */
        bookMetaBox: {
            marginTop: theme.spacing(1),
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        /* Styles applied to the autoplay `FormControl` component. */
        autoplayFormControl: {
            marginRight: 0, // reset margin
        },
    }),
    { name: 'Book' },
);

const defaultVoice: Voice = {
    languageCodes: ['ru-RU'],
    name: 'ru-RU-Standard-C',
    ssmlGender: SsmlVoiceGender.FEMALE,
    naturalSampleRateHertz: 24000,
};

type Props = {};

const Book: NextPage<Props> = (props) => {
    const classes = useStyles();
    const router = useRouter();
    const { t } = useTranslation();

    const [loadingBook, setLoadingBook] = useState(false);
    const [bookFetched, setBookFetched] = useState(false);

    const [book, setBook] = useState<PDFBook | null>(null);
    useEffect(() => {
        if (!router.query.id) return;

        setLoadingBook(true);
        getBook(Number(router.query.id))
            .then((book) => setBook(book))
            .finally(() => {
                setLoadingBook(false);
                setBookFetched(true);
            });
    }, [router.query.id]);

    const [page, setPage] = useState(Number(router.query.page) || 1);
    // Sync page with URL
    useEffect(() => {
        if (router.query.id) {
            // value is `undefined` on first render
            router.replace(
                {
                    pathname: '/book',
                    query: router.query,
                },
                {
                    pathname: `/book`,
                    query: {
                        ...router.query,
                        page,
                    },
                },
            );
        }
    }, [page]);

    const [voices, setVoices] = useState<Voice[]>([]);
    const [voice, setVoice] = useState<Voice | null>(defaultVoice);
    useEffect(() => {
        async function fetchVoices() {
            try {
                const { data } = await apiClient.voices();
                setVoices(data.voices);
            } catch (err) {
                console.error(err);
            }
        }

        fetchVoices();
    }, []);

    const [audioContent, setAudioContent] = useState(''); // Base64
    const [loadingSynthesize, setLoadingSynthesize] = useState(false);

    const handleSynthesize = (page: PDFPage) => {
        async function synthesize() {
            if (!voice) {
                console.error('No voice selected');
                return;
            }

            setLoadingSynthesize(true);

            // На первых страницах книг не всегда есть текст.
            // Часто это просто обложка. Скипаем это страницу
            // чтобы Autoplay работал как надо.
            if (page.textContent === '') {
                console.warn(
                    `[synthesize] Skipping the page ${page.pageNum}` +
                        'because of empty `page.textContent`. Perhaps this is the cover of the page, ' +
                        'which does not contain text, or pdf.js did not parse the text correctly.',
                );
                handleAudioEnd();

                return;
            }

            try {
                const { data } = await apiClient.textSynthesize(
                    page.textContent,
                    voice.languageCodes[0],
                    voice.name,
                    voice.ssmlGender,
                    1,
                );

                setAudioContent(data.audioContent);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingSynthesize(false);
            }
        }

        synthesize();
    };
    useEffect(() => {
        if (book && page) {
            handleSynthesize(book.pages[page - 1]);
        }
    }, [book && book.id, page]);

    const [autoplay, setAutoplay] = useState(true);
    const handleAudioEnd = () => {
        if (!book) {
            console.warn('handleAudioEnd: book is not defined');
            return;
        }
        if (!autoplay) {
            return;
        }

        const newPage = page + 1;

        if (newPage > book.numPages) {
            return console.log('newPage overflows book.numPages');
        }

        setPage(newPage);
    };

    if (loadingBook || !book) {
        return (
            <NavigationLayout className={classes.root} disableBottomNavigation>
                <div className={classes.circularProgressContainer}>
                    <CircularProgress variant="indeterminate" />
                </div>
            </NavigationLayout>
        );
    }

    return (
        <NavigationLayout
            className={classes.root}
            AppBarProps={{
                title: book.title,
            }}
            disableBottomNavigation
        >
            <Player
                className={classes.Player}
                audioContent={audioContent}
                onAudioEnd={handleAudioEnd}
            />

            <VoicesCombobox
                className={classes.VoicesCombobox}
                value={voice}
                onChange={setVoice}
                voices={voices}
            />

            <Box
                className={classes.bookMetaBox}
                display="flex"
                alignItems="center"
            >
                <Typography>
                    {page}/{book.numPages} {t('page', { count: book.numPages })}
                </Typography>
                <FlexSpacer />
                <FormControlLabel
                    className={classes.autoplayFormControl}
                    control={
                        <Switch
                            checked={autoplay}
                            onChange={(e) => setAutoplay(e.target.checked)}
                            color="primary"
                            name="autoplay"
                            inputProps={{ 'aria-label': 'Autoplay' }}
                        />
                    }
                    label={t('autoplay')}
                />
            </Box>

            <PlayList
                book={book}
                page={page}
                onChange={(page) => setPage(page)}
            />

            <LoadingOverlay loading={loadingSynthesize} />
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

export default Book;
