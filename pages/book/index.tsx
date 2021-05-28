import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, FormControlLabel, Switch } from '@material-ui/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import apiClient, { SsmlVoiceGender, Voice } from 'util/apiClient';
import { FlexSpacer } from 'components/FlexSpacer';
import { LoadingOverlay } from 'components/LoadingOverlay';
import { PDFBook, PDFPage } from 'types';
import { PlayList } from 'components/PlayList';
import { Player } from 'components/Player/Player';
import { VoicesCombobox } from 'components/VoicesCombobox';
import { getBook } from 'util/indexedDB/books';

const useStyles = makeStyles(
    () => ({
        /* Styles applied to the root element. */
        root: {},
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

    const [book, setBook] = useState<PDFBook | null>(null);
    useEffect(() => {
        if (!router.query.id) return;

        getBook(Number(router.query.id)).then((book) => setBook(book));
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

    if (!book) {
        return null;
    }

    return (
        <div className={classes.root}>
            <Player audioContent={audioContent} onAudioEnd={handleAudioEnd} />
            <VoicesCombobox value={voice} onChange={setVoice} voices={voices} />
            <Box display="flex">
                <FlexSpacer />
                <FormControlLabel
                    control={
                        <Switch
                            checked={autoplay}
                            onChange={(e) => setAutoplay(e.target.checked)}
                            color="primary"
                            name="autoplay"
                            inputProps={{ 'aria-label': 'Autoplay' }}
                        />
                    }
                    label="Autoplay"
                />
            </Box>

            <PlayList
                book={book}
                page={page}
                onChange={(page) => setPage(page)}
            />

            <LoadingOverlay loading={loadingSynthesize} />
        </div>
    );
};

export default Book;
