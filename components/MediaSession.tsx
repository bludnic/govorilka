import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const useStyles = makeStyles(
    (theme) => ({
        /* Styles applied to the root element. */
        root: {},
    }),
    { name: 'MediaSession' },
);

type Props = {};

export const MediaSession: FC<Props> = (props) => {
    const classes = useStyles();

    const audio = useMemo(() => {
        return new Audio();
    }, []);
    const playlist = useMemo(() => {
        return getAwesomePlaylist();
    }, []);

    const [index, setIndex] = useState(0);

    const playAudio = () => {
        audio.src = playlist[index].src;
        audio
            .play()
            .then((_) => updateMetadata())
            .catch((error) => console.log(error));
    };

    const updateMetadata = () => {
        if (!navigator.mediaSession) return;

        let track = playlist[index];

        console.log('Playing ' + track.title + ' track...');
        navigator.mediaSession.metadata = new MediaMetadata({
            title: track.title,
            artist: track.artist,
            album: track.album,
            artwork: track.artwork,
        });

        // Media is loaded, set the duration.
        updatePositionState();
    };

    /* Position state (supported since Chrome 81) */

    const updatePositionState = () => {
        if (navigator.mediaSession && navigator.mediaSession.setPositionState) {
            console.log('Updating position state...');
            navigator.mediaSession.setPositionState({
                duration: audio.duration,
                playbackRate: audio.playbackRate,
                position: audio.currentTime,
            });
        }
    };

    /* Previous Track & Next Track */

    const onPreviousTrack = useCallback(() => {
        console.log('> User clicked "Previous Track" icon.');
        setIndex((index - 1 + playlist.length) % playlist.length);
        playAudio();
    }, [playAudio, index, playlist]);
    useEffect(() => {
        if (!navigator.mediaSession) return;

        navigator.mediaSession.setActionHandler(
            'previoustrack',
            onPreviousTrack,
        );
    }, [onPreviousTrack]);

    const onNextTrack = useCallback(() => {
        console.log('> User clicked "Next Track" icon.');
        setIndex((index + 1) % playlist.length);
        playAudio();
    }, [playAudio, index, playlist]);
    useEffect(() => {
        if (!navigator.mediaSession) return;

        navigator.mediaSession.setActionHandler('nexttrack', onNextTrack);
    }, [onNextTrack]);

    const onEnded = useCallback(() => {
        // Play automatically the next track when audio ends.
        setIndex((index - 1 + playlist.length) % playlist.length);
        playAudio();
    }, [playAudio, index, playlist]);
    useEffect(() => {
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('ended', onEnded);
        };
    }, [onEnded]);

    /* Seek Backward & Seek Forward */

    const defaultSkipTime = 10; /* Time to skip in seconds by default */

    const onSeekBackward = useCallback(
        (event) => {
            console.log('> User clicked "Seek Backward" icon.');
            const skipTime = event.seekOffset || defaultSkipTime;
            audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
            updatePositionState();
        },
        [audio, updatePositionState],
    );
    useEffect(() => {
        if (!navigator.mediaSession) return;

        navigator.mediaSession.setActionHandler('seekbackward', onSeekBackward);
    }, [onSeekBackward]);

    const onSeekForward = useCallback(
        (event) => {
            console.log('> User clicked "Seek Forward" icon.');
            const skipTime = event.seekOffset || defaultSkipTime;
            audio.currentTime = Math.min(
                audio.currentTime + skipTime,
                audio.duration,
            );
            updatePositionState();
        },
        [audio],
    );
    useEffect(() => {
        if (!navigator.mediaSession) return;

        navigator.mediaSession.setActionHandler('seekforward', onSeekBackward);
    }, [onSeekForward]);

    /* Play & Pause */

    const onPlay = useCallback(() => {
        console.log('> User clicked "Play" icon.');
        audio.play().then(() => {
            if (!navigator.mediaSession) return;

            navigator.mediaSession.playbackState = 'playing';
            // Do something more than just playing audio...
        });
    }, [audio]);
    useEffect(() => {
        if (!navigator.mediaSession) return;

        navigator.mediaSession.setActionHandler('play', onPlay);
    }, [onPlay]);

    const onPause = useCallback(() => {
        if (!navigator.mediaSession) return;

        console.log('> User clicked "Pause" icon.');
        audio.pause();
        navigator.mediaSession.playbackState = 'paused';
        // Do something more than just pausing audio...
    }, [audio]);
    useEffect(() => {
        if (!navigator.mediaSession) return;

        navigator.mediaSession.setActionHandler('pause', onPause);
    }, [onPause]);

    /* Stop (supported since Chrome 77) */

    const onStop = useCallback(() => {
        console.log('> User clicked "Stop" icon.');
        // TODO: Clear UI playback...
    }, [audio]);
    useEffect(() => {
        if (!navigator.mediaSession) return;

        try {
            navigator.mediaSession.setActionHandler('stop', onStop);
        } catch (error) {
            console.log(
                'Warning! The "stop" media session action is not supported.',
            );
        }
    }, [onStop]);

    /* Seek To (supported since Chrome 78) */

    const onSeekTo = useCallback(
        (event) => {
            console.log('> User clicked "Seek To" icon.');
            if (event.fastSeek && 'fastSeek' in audio) {
                audio.fastSeek(event.seekTime);
                return;
            }
            audio.currentTime = event.seekTime;
            updatePositionState();
        },
        [audio, updatePositionState],
    );
    useEffect(() => {
        if (!navigator.mediaSession) return;

        try {
            navigator.mediaSession.setActionHandler('seekto', onSeekTo);
        } catch (error) {
            console.log(
                'Warning! The "seekto" media session action is not supported.',
            );
        }
    }, [onSeekTo]);

    return (
        <div className={classes.root}>
            <div>index: {index}</div>
            <div>
                <Button onClick={playAudio}>Play</Button>
            </div>
        </div>
    );
};

function getAwesomePlaylist() {
    const BASE_URL = 'https://storage.googleapis.com/media-session/';

    return [
        {
            src: BASE_URL + 'sintel/snow-fight.mp3',
            title: 'Snow Fight',
            artist: 'Jan Morgenstern',
            album: 'Sintel',
            artwork: [
                {
                    src: BASE_URL + 'sintel/artwork-96.png',
                    sizes: '96x96',
                    type: 'image/png',
                },
                {
                    src: BASE_URL + 'sintel/artwork-128.png',
                    sizes: '128x128',
                    type: 'image/png',
                },
                {
                    src: BASE_URL + 'sintel/artwork-192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: BASE_URL + 'sintel/artwork-256.png',
                    sizes: '256x256',
                    type: 'image/png',
                },
                {
                    src: BASE_URL + 'sintel/artwork-384.png',
                    sizes: '384x384',
                    type: 'image/png',
                },
                {
                    src: BASE_URL + 'sintel/artwork-512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
            ],
        },
        {
            src: BASE_URL + 'big-buck-bunny/prelude.mp3',
            title: 'Prelude',
            artist: 'Jan Morgenstern',
            album: 'Big Buck Bunny',
            artwork: [
                {
                    src: BASE_URL + 'big-buck-bunny/artwork-96.png',
                    sizes: '96x96',
                    type: 'image/png',
                },
                {
                    src: BASE_URL + 'big-buck-bunny/artwork-128.png',
                    sizes: '128x128',
                    type: 'image/png',
                },
                {
                    src: BASE_URL + 'big-buck-bunny/artwork-192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: BASE_URL + 'big-buck-bunny/artwork-256.png',
                    sizes: '256x256',
                    type: 'image/png',
                },
                {
                    src: BASE_URL + 'big-buck-bunny/artwork-384.png',
                    sizes: '384x384',
                    type: 'image/png',
                },
                {
                    src: BASE_URL + 'big-buck-bunny/artwork-512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
            ],
        },
        {
            src: BASE_URL + 'elephants-dream/the-wires.mp3',
            title: 'The Wires',
            artist: 'Jan Morgenstern',
            album: 'Elephants Dream',
            artwork: [
                {
                    src: BASE_URL + 'elephants-dream/artwork-96.png',
                    sizes: '96x96',
                    type: 'image/png',
                },
                {
                    src: BASE_URL + 'elephants-dream/artwork-128.png',
                    sizes: '128x128',
                    type: 'image/png',
                },
                {
                    src: BASE_URL + 'elephants-dream/artwork-192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: BASE_URL + 'elephants-dream/artwork-256.png',
                    sizes: '256x256',
                    type: 'image/png',
                },
                {
                    src: BASE_URL + 'elephants-dream/artwork-384.png',
                    sizes: '384x384',
                    type: 'image/png',
                },
                {
                    src: BASE_URL + 'elephants-dream/artwork-512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
            ],
        },
        {
            src: BASE_URL + 'caminandes/original-score.mp3',
            title: 'Original Score',
            artist: 'Jan Morgenstern',
            album: 'Caminandes 2: Gran Dillama',
            artwork: [
                {
                    src: BASE_URL + 'caminandes/artwork-96.png',
                    sizes: '96x96',
                    type: 'image/png',
                },
                {
                    src: BASE_URL + 'caminandes/artwork-128.png',
                    sizes: '128x128',
                    type: 'image/png',
                },
                {
                    src: BASE_URL + 'caminandes/artwork-192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: BASE_URL + 'caminandes/artwork-256.png',
                    sizes: '256x256',
                    type: 'image/png',
                },
                {
                    src: BASE_URL + 'caminandes/artwork-384.png',
                    sizes: '384x384',
                    type: 'image/png',
                },
                {
                    src: BASE_URL + 'caminandes/artwork-512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
            ],
        },
    ];
}
